using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Azure.WebJobs;
using Microsoft.Extensions.Logging;
using MongoDB.Bson;
using MongoDB.Driver;
using MongoDB.Bson.Serialization;
using System.Security.Authentication;
using System.Linq;
using Microsoft.Azure.Management.Media;
using Microsoft.Azure.Management.Media.Models;
using Microsoft.IdentityModel.Clients.ActiveDirectory;
using Microsoft.Rest;
using Microsoft.Rest.Azure.Authentication;
using NAudio.Wave;
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Blob;
using System.IO;

namespace TimeTriggers
{
    public static class SongConsistencyValidator
    {
        private const string ATLAS_CONNECTION_STRING = "mongodb+srv://truemuz:12345@truemuz-xd4d1.azure.mongodb.net/test?retryWrites=true&w=majority";

        private const string DB_NAME = "truemuzdb";
        private const string ARTIST_COLLECTION_NAME = "artist";
        private const string AuidioTransformName = "MyTransformWithHighQualityAudioPreset";
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
                Environment.GetEnvironmentVariable("Region"),
                Environment.GetEnvironmentVariable("WaveFormSmoothingRate")
            );

        [FunctionName("SongConsistencyValidator")]
        public static async Task Run([TimerTrigger("0 */5 * * * *")]TimerInfo myTimer, ILogger log)
        {
            try
            {
                MongoClientSettings settings = MongoClientSettings.FromUrl(new MongoUrl(ATLAS_CONNECTION_STRING));
                settings.SslSettings = new SslSettings() { EnabledSslProtocols = SslProtocols.Tls12 };
                var mongoClient = new MongoClient(settings);

                var database = mongoClient.GetDatabase(DB_NAME);
                var collection = database.GetCollection<BsonDocument>(ARTIST_COLLECTION_NAME);
                var artistsBsonList = await collection.Find(FilterDefinition<BsonDocument>.Empty).ToListAsync();

                List<Artist> artists = new List<Artist>();
                foreach (var bson in artistsBsonList)
                {
                    var artist = BsonSerializer.Deserialize<Artist>(bson.ToJson());
                    artists.Add(artist);
                }

                var linksToAdd = await ValidateStreamLinks(artists);

                foreach (var link in linksToAdd)
                {
                    var filter = Builders<BsonDocument>.Filter.Eq("name", link.artistName);

                    var bsonArray = new BsonArray();
                    bsonArray.AddRange(link.links.Select(l => new BsonDocument { { "type", l.Type.ToString() }, { "url", l.Url } }));

                    var indexes = GetIndexes(artists, link.artistName, link.albumName, link.songGroupName, link.blobName);

                    var update =  Builders<BsonDocument>.Update.Set($"albums.{indexes.albumIndex}.songGroups.{indexes.songGroupIndex}.songs.{indexes.songIndex}.streamLinks", bsonArray);

                    collection.UpdateOne(filter, update);
                }

                var waveFormsToAdd = await ValidateWaveForms(artists);
                foreach (var waveForm in waveFormsToAdd)
                {
                    var filter = Builders<BsonDocument>.Filter.Eq("name", waveForm.artistName);

                    var indexes = GetIndexes(artists, waveForm.artistName, waveForm.albumName, waveForm.songGroupName, waveForm.blobName);

                    var update = Builders<BsonDocument>.Update.Set($"albums.{indexes.albumIndex}.songGroups.{indexes.songGroupIndex}.songs.{indexes.songIndex}.duration", waveForm.duration);
                    collection.UpdateOne(filter, update);

                    update = Builders<BsonDocument>.Update.Set($"albums.{indexes.albumIndex}.songGroups.{indexes.songGroupIndex}.songs.{indexes.songIndex}.waveForm", waveForm.peaks);
                    collection.UpdateOne(filter, update);
                }

            }
            catch (Exception e)
            {
                log.LogError(e.Message);
                //TODO
            }
        }

        private static (int albumIndex, int songGroupIndex, int songIndex) GetIndexes(List<Artist> artists, string artistName, string albumName, string songGroupName, string blobName)
        {
            var albumIndex = artists.Where(ar => ar.Name == artistName).FirstOrDefault().Albums.ToList().FindIndex(al => al.Name == albumName);
            var songGroupIndex = artists.Where(ar => ar.Name == artistName).FirstOrDefault().Albums.Where(al => al.Name == albumName).FirstOrDefault().SongGroups.ToList().FindIndex(sg => sg.Name == songGroupName);
            var songIndex = artists.Where(ar => ar.Name == artistName).FirstOrDefault().Albums.Where(al => al.Name == albumName).FirstOrDefault().SongGroups.Where(sg => sg.Name == songGroupName).FirstOrDefault().Songs.ToList().FindIndex(s => s.BlobName == blobName);

            return (albumIndex, songGroupIndex, songIndex);
        }

        private static async Task<IEnumerable<(string artistName, string albumName, string songGroupName, string blobName, IEnumerable<Link> links)>> ValidateStreamLinks(List<Artist> artists)
        {
            IEnumerable<(string artistName, string albumName, string songGroupName, string blobName, string format)> songsWithoutLinks = artists.SelectMany(ar => ar.Albums
                .SelectMany(al => al.SongGroups
                .SelectMany(sg => sg.Songs.Where(s => s.StreamLinks.Count() == 0)
                ?.Select(s => (ar.Name, al.Name, sg.Name, s.BlobName, s.Format)))));

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

            Transform transform = await GetOrCreateTransformAsync(client, config.ResourceGroup, config.AccountName, AuidioTransformName);

            Asset outputAsset = await CreateOutputAssetAsync(client, config.ResourceGroup, config.AccountName, outputAssetName);

            Job job = await SubmitJobAsync(client, config.ResourceGroup, config.AccountName, AuidioTransformName, outputAsset.Name, jobName, fileName);

            job = await WaitForJobToFinishAsync(client, config.ResourceGroup, config.AccountName, AuidioTransformName, jobName);

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
                            PresetName = EncoderNamedPreset.AACGoodQualityAudio
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

        private static async Task<IEnumerable<(string artistName, string albumName, string songGroupName, string blobName, double[] peaks, double duration)>> ValidateWaveForms(List<Artist> artists)
        {
            IEnumerable<(string artistName, string albumName, string songGroupName, string blobName, string format)> songsWithoutWaveForms = artists.SelectMany(ar => ar.Albums
                .SelectMany(al => al.SongGroups
                .SelectMany(sg => sg.Songs
                ?.Select(s => (ar.Name, al.Name, sg.Name, s.BlobName, s.Format)))));

            var validationOutput = new List<(string artistName, string albumName, string songGroupName, string blobName, double[] peaks, double duration)>();

            foreach (var song in songsWithoutWaveForms)
            {
                var waveForm = await GetWaveFormArray(song.artistName, song.albumName, song.songGroupName, song.blobName, song.format);
                validationOutput.Add((song.artistName, song.albumName, song.songGroupName, song.blobName, waveForm.array, waveForm.duration));
            }

            return validationOutput;
        }

        private static async Task<(double[] array, double duration)> GetWaveFormArray(string artistName, string albumName, string songGroupName, string songBlobName, string format)
        {
            var url = string.Join('/', new List<string> { _blobStorage, artistName, albumName, songGroupName, songBlobName + format });

            CloudStorageAccount cloudStorageAccount = CloudStorageAccount.Parse("DefaultEndpointsProtocol=https;AccountName=truemuz;AccountKey=GNwCZBVP4mzZRKw++g0kfIqXaGPT9QBVePb3cMlK+ItocOLmEGEUk6pNYyr0FrKWURIYxQRRhrqbZlelV+b5mA==;EndpointSuffix=core.windows.net");
            var blob = new CloudBlockBlob(new Uri(url), cloudStorageAccount.Credentials);

            var peakProvider = new PeakProvider();

            using (MemoryStream ms = new MemoryStream())
            {
                await blob.DownloadToStreamAsync(ms);

                using (var reader = new StreamMediaFoundationReader(ms))
                {
                    int bytesPerSample = (reader.WaveFormat.BitsPerSample / 8);
                    var samples = reader.Length / (bytesPerSample);
                    var samplesPerPixel = (int)(samples / 1000);
                    peakProvider.Init(reader, samplesPerPixel, 1000);

                    var duration = (double)Decimal.Round((decimal)reader.TotalTime.TotalSeconds, 2);
                    var peaks = GetPeaks(peakProvider);

                    return (peaks, duration);
                }
            }
        }

        private static double[] GetPeaks(PeakProvider peakProvider)
        {
            decimal[] array = new decimal[1000];
            int x = 0;
            while (x < 1000)
            {
                var nextPeak = peakProvider.GetNextPeak();

                array[x] = (decimal)nextPeak;
                x++;
            }

            return Smooth(array);
        }

        private static double[] Smooth(decimal[] array)
        {
            var avg = Queryable.Average(array.AsQueryable()) * (decimal)config.WaveFormSmoothingRate;
            var ret = new double[array.Length];
            for (var i = 0; i <array.Length; i++)
            {
                var prev = i > 0 ? (decimal)ret[i - 1] : array[i];
                var next = i < array.Length ? array[i] : array[i - 1];
                ret[i] = (double)decimal.Round(((avg + ((prev + next + array[i]) / 3)) / 2), 2);
            }

            return ret;
        }
    }
}
