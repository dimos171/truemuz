using System;
using System.Configuration;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using MongoDB.Bson;
using MongoDB.Driver;
using MongoDB.Bson.Serialization;
using System.Security.Authentication;
using Microsoft.Extensions.Configuration;
using System.IO;
using Newtonsoft.Json;
using System.Linq;
using Microsoft.Azure.Management.Media;
using Microsoft.Azure.Management.Media.Models;
using Microsoft.IdentityModel.Clients.ActiveDirectory;
using Microsoft.Rest;
using Microsoft.Rest.Azure.Authentication;

namespace TimeTriggers
{
    public static class SongConsistencyValidator
    {
        private const string ATLAS_CONNECTION_STRING = "mongodb+srv://truemuz:12345@truemuz-xd4d1.azure.mongodb.net/test?retryWrites=true&w=majority";

        private const string DB_NAME = "truemuzdb";
        private const string ARTIST_COLLECTION_NAME = "artist";
        private const string AdaptiveStreamingTransformName = "MyTransformWithAdaptiveStreamingPreset";
        private const string _blobStorage = "https://truemuz.blob.core.windows.net/songs";
        private static ConfigWrapper config = new ConfigWrapper(
                Environment.GetEnvironmentVariable("SubscriptionId"),
                Environment.GetEnvironmentVariable("ResourceGroup"),
                Environment.GetEnvironmentVariable("AccountName"),
                Environment.GetEnvironmentVariable("AadTenantId"),
                Environment.GetEnvironmentVariable("AadClientId"),
                Environment.GetEnvironmentVariable("AadSecret"),
                Environment.GetEnvironmentVariable("ArmAadAudience"),
                Environment.GetEnvironmentVariable("AadEndpoint"),
                Environment.GetEnvironmentVariable("ArmEndpoint"),
                Environment.GetEnvironmentVariable("Region")
            );

        [FunctionName("SongConsistencyValidator")]
        public static async Task Run([TimerTrigger("*/30 * * * *")]TimerInfo myTimer, ILogger log)
        {
            try
            {
                MongoClientSettings settings = MongoClientSettings.FromUrl(new MongoUrl(ATLAS_CONNECTION_STRING));
                settings.SslSettings = new SslSettings() { EnabledSslProtocols = SslProtocols.Tls12 };
                var mongoClient = new MongoClient(settings);

                var database = mongoClient.GetDatabase(DB_NAME);
                var collection = database.GetCollection<BsonDocument>(ARTIST_COLLECTION_NAME);
                var artistsBsonList = await collection.Find(FilterDefinition<BsonDocument>.Empty).ToListAsync();

                var linksToAdd = await Validate(artistsBsonList);

                foreach (var link in linksToAdd)
                {
                    var filter3 = Builders<BsonDocument>.Filter.Eq("name", link.artistName)
                        & Builders<BsonDocument>.Filter.Eq("albums.name", link.albumName)
                        & Builders<BsonDocument>.Filter.Eq("albums.song-groups.name", link.songGroupName)
                        & Builders<BsonDocument>.Filter.Eq("albums.song-groups.songs.blob-name", link.blobName);

                    var bsonArray = new BsonArray();
                    bsonArray.AddRange(link.links.Select(l => new BsonDocument { { "type", l.Type.ToString() }, { "url", l.Url } }));
                    
                    var update = Builders<BsonDocument>.Update.Set("albums.song-groups.songs.$.stream-links", bsonArray);

                    collection.UpdateOne(filter3, update);
                }
            }
            catch (Exception e)
            {
                log.LogError(e.Message);
                //TODO
            }
        }

        private static async Task<IEnumerable<(string artistName, string albumName, string songGroupName, string blobName, IEnumerable<Link> links)>> Validate(IEnumerable<BsonDocument> artistsBsonList)
        {
            List<Artist> artists = new List<Artist>();

            foreach (var bson in artistsBsonList)
            {
                var artist = BsonSerializer.Deserialize<Artist>(bson.ToJson());
                artists.Add(artist);
            }

            IEnumerable<(string artistName, string albumName, string songGroupName, string blobName, string format)> songsWithoutLinks = artists.SelectMany(ar => ar.Albums
                .SelectMany(al => al.SongGroups
                .SelectMany(sg => sg.Songs.Where(s => s.StreamLinks.Count() == 0)
                .Select(s => (ar.Name, al.Name, sg.Name, s.BlobName, s.Format)))));

            var validationOutput = new List<(string artistName, string albumName, string songGroupName, string blobName, IEnumerable<Link> links)>();
            foreach(var song in songsWithoutLinks)
            {
                var links = await RunAsync(song.artistName, song.albumName, song.songGroupName, song.blobName, song.format);
                validationOutput.Add((song.artistName, song.albumName, song.songGroupName, song.blobName, links));
            }

            return validationOutput;
        }

        private static async Task<IEnumerable<Link>> RunAsync(string artistName, string albumName, string songGroupName, string songBlobName, string format)
        {
            IAzureMediaServicesClient client = await CreateMediaServicesClientAsync();

            var links = new List<Link>();

            client.LongRunningOperationRetryTimeout = 2;

            string fileName = string.Join('/', new List<string> { _blobStorage, artistName, albumName, songGroupName, songBlobName + format });
            string uniqueness = string.Join('-', new List<string> { artistName, albumName, songGroupName, songBlobName });
            string jobName = $"{uniqueness}-job";
            string locatorName = $"{uniqueness}-locator";
            string outputAssetName = $"{uniqueness}-asset";

            Transform transform = await GetOrCreateTransformAsync(client, config.ResourceGroup, config.AccountName, AdaptiveStreamingTransformName);

            Asset outputAsset = await CreateOutputAssetAsync(client, config.ResourceGroup, config.AccountName, outputAssetName);

            Job job = await SubmitJobAsync(client, config.ResourceGroup, config.AccountName, AdaptiveStreamingTransformName, outputAsset.Name, jobName, fileName);

            job = await WaitForJobToFinishAsync(client, config.ResourceGroup, config.AccountName, AdaptiveStreamingTransformName, jobName);

            if (job.State == JobState.Finished)
            {
                StreamingLocator locator = await CreateStreamingLocatorAsync(client, config.ResourceGroup, config.AccountName, outputAsset.Name, locatorName);

                IList<string> urls = await GetStreamingUrlsAsync(client, config.ResourceGroup, config.AccountName, locator.Name);

                foreach (var url in urls)
                {
                    int type = 0;

                    if (url.EndsWith("manifest(format=m3u8-aapl)")) type = 0;
                    else if (url.EndsWith("manifest(format=mpd-time-csf)")) type = 1;
                    else if (url.EndsWith("manifest")) type = 2;

                    links.Add(new Link
                    {
                        Type = (LinkType)type,
                        Url = url
                    });
                }
            }

            await CleanUpAsync(client, config.ResourceGroup, config.AccountName, transform.Name);

            return links;
        }

        private static async Task<ServiceClientCredentials> GetCredentialsAsync()
        {
            ClientCredential clientCredential = new ClientCredential(config.AadClientId, config.AadSecret);
            return await ApplicationTokenProvider.LoginSilentAsync(config.AadTenantId, clientCredential, ActiveDirectoryServiceSettings.Azure);
        }
        

        private static async Task<IAzureMediaServicesClient> CreateMediaServicesClientAsync()
        {
            var credentials = await GetCredentialsAsync();

            return new AzureMediaServicesClient(config.ArmEndpoint, credentials)
            {
                SubscriptionId = config.SubscriptionId,
            };
        }
        
        private static async Task<Transform> GetOrCreateTransformAsync(
            IAzureMediaServicesClient client,
            string resourceGroupName,
            string accountName,
            string transformName)
        {
            Transform transform = await client.Transforms.GetAsync(resourceGroupName, accountName, transformName);

            if (transform == null)
            {
                TransformOutput[] output = new TransformOutput[]
                {
                    new TransformOutput
                    {
                        Preset = new BuiltInStandardEncoderPreset()
                        {
                            PresetName = EncoderNamedPreset.AdaptiveStreaming
                        }
                    }
                };

                transform = await client.Transforms.CreateOrUpdateAsync(resourceGroupName, accountName, transformName, output);
            }

            return transform;
        }

        private static async Task<Asset> CreateOutputAssetAsync(IAzureMediaServicesClient client, string resourceGroupName, string accountName, string assetName)
        {
            // Check if an Asset already exists
            Asset outputAsset = await client.Assets.GetAsync(resourceGroupName, accountName, assetName);

            if (outputAsset != null)
            {
                return outputAsset;
            }

            Asset asset = new Asset();
            asset.Container = assetName.ToLower();
            string outputAssetName = assetName;
            return await client.Assets.CreateOrUpdateAsync(resourceGroupName, accountName, outputAssetName, asset);
        }

        private static async Task<Job> SubmitJobAsync(IAzureMediaServicesClient client,
            string resourceGroupName,
            string accountName,
            string transformName,
            string outputAssetName,
            string jobName,
            string filePath)
        {
            JobInputHttp jobInput =
                new JobInputHttp(files: new[] { filePath });

            JobOutput[] jobOutputs =
            {
                new JobOutputAsset(outputAssetName),
            };

            Job job = await client.Jobs.CreateAsync(
                resourceGroupName,
                accountName,
                transformName,
                jobName,
                new Job
                {
                    Input = jobInput,
                    Outputs = jobOutputs,
                });

            return job;
        }

        private static async Task<Job> WaitForJobToFinishAsync(IAzureMediaServicesClient client,
            string resourceGroupName,
            string accountName,
            string transformName,
            string jobName)
        {
            const int SleepIntervalMs = 1000;

            Job job = null;

            do
            {
                job = await client.Jobs.GetAsync(resourceGroupName, accountName, transformName, jobName);

                if (job.State != JobState.Finished && job.State != JobState.Error && job.State != JobState.Canceled)
                {
                    await Task.Delay(SleepIntervalMs);
                }
            }
            while (job.State != JobState.Finished && job.State != JobState.Error && job.State != JobState.Canceled);

            return job;
        }

        private static async Task<StreamingLocator> CreateStreamingLocatorAsync(
            IAzureMediaServicesClient client,
            string resourceGroupName,
            string accountName,
            string assetName,
            string locatorName)
        {
            var locator = await client.StreamingLocators.GetAsync(resourceGroupName, accountName, locatorName);

            if (locator != null)
            {
                return locator;
            }

            StreamingLocator newLocator = await client.StreamingLocators.CreateAsync(
                resourceGroupName,
                accountName,
                locatorName,
                new StreamingLocator
                {
                    AssetName = assetName,
                    StreamingPolicyName = PredefinedStreamingPolicy.ClearStreamingOnly
                });

            return newLocator;
        }

        private static async Task<IList<string>> GetStreamingUrlsAsync(
            IAzureMediaServicesClient client,
            string resourceGroupName,
            string accountName,
            string locatorName)
        {
            const string DefaultStreamingEndpointName = "default";

            IList<string> streamingUrls = new List<string>();

            StreamingEndpoint streamingEndpoint = await client.StreamingEndpoints.GetAsync(resourceGroupName, accountName, DefaultStreamingEndpointName);

            if (streamingEndpoint != null)
            {
                if (streamingEndpoint.ResourceState != StreamingEndpointResourceState.Running)
                {
                    await client.StreamingEndpoints.StartAsync(resourceGroupName, accountName, DefaultStreamingEndpointName);
                }
            }

            ListPathsResponse paths = await client.StreamingLocators.ListPathsAsync(resourceGroupName, accountName, locatorName);

            foreach (StreamingPath path in paths.StreamingPaths)
            {
                UriBuilder uriBuilder = new UriBuilder();
                uriBuilder.Scheme = "https";
                uriBuilder.Host = streamingEndpoint.HostName;

                uriBuilder.Path = path.Paths[0];
                streamingUrls.Add(uriBuilder.ToString());
            }

            return streamingUrls;
        }

        private static async Task CleanUpAsync(
            IAzureMediaServicesClient client,
            string resourceGroupName,
            string accountName,
            string transformName)
        {

            var jobs = await client.Jobs.ListAsync(resourceGroupName, accountName, transformName);
            foreach (var job in jobs)
            {
                await client.Jobs.DeleteAsync(resourceGroupName, accountName, transformName, job.Name);
            }
        }
    }
}
