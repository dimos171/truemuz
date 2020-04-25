using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using MongoDB.Bson;
using MongoDB.Driver;
using System.Security.Authentication;
using Microsoft.Extensions.Configuration;
using System.IO;

namespace TimeTrigger
{
    public static class SongValidator
    {
        private const string ATLAS_CONNECTION_STRING = "mongodb+srv://truemuz:12345@truemuz-xd4d1.azure.mongodb.net/test?retryWrites=true&w=majority";

        private const string DB_NAME = "truemuzdb";
        private const string ARTIST_COLLECTION_NAME = "artist";


        [FunctionName("SongValidator")]
        public static void Run([TimerTrigger("0 */30 * * * *")]TimerInfo myTimer, ILogger log)
        {
            try
            {
                MongoClientSettings settings = MongoClientSettings.FromUrl(new MongoUrl(ATLAS_CONNECTION_STRING));
                settings.SslSettings = new SslSettings() { EnabledSslProtocols = SslProtocols.Tls12 };
                var mongoClient = new MongoClient(settings);

                var database = mongoClient.GetDatabase(DB_NAME);
                var collection = database.GetCollection<BsonDocument>(ARTIST_COLLECTION_NAME);

                Validate();
            }
            catch (Exception e)
            {
                log.LogError(e.Message);
                //TODO
            }
        }

        private static void Validate()
        {
            ConfigWrapper config = new ConfigWrapper(new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
                .AddEnvironmentVariables()
                .Build().GetSection("Generator"));
        }
    }
}
