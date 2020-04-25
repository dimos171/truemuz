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

namespace HttpTriggers
{
    public static class GetArtist
    {        
        private const string ATLAS_CONNECTION_STRING = "mongodb+srv://truemuz:12345@truemuz-xd4d1.azure.mongodb.net/test?retryWrites=true&w=majority";

        private const string DB_NAME = "truemuzdb";
        private const string ARTIST_COLLECTION_NAME = "artist";

        [FunctionName("GetArtist")]
        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Function, "get", Route = "Artist/{name}")] HttpRequest req, string name,
            ILogger log)
        {
            try
            {
                MongoClientSettings settings = MongoClientSettings.FromUrl(new MongoUrl(ATLAS_CONNECTION_STRING));
                settings.SslSettings = new SslSettings() { EnabledSslProtocols = SslProtocols.Tls12 };
                var mongoClient = new MongoClient(settings);

                var database = mongoClient.GetDatabase(DB_NAME);
                var collection = database.GetCollection<BsonDocument>(ARTIST_COLLECTION_NAME);
                var filter = new BsonDocument("name", name);
                var artists = await collection.Find(filter).ToListAsync();

                return new OkObjectResult(artists[0]);
            }
            catch (Exception e)
            {
                log.LogError(e.Message);
                return new StatusCodeResult(StatusCodes.Status500InternalServerError);
            }
        }
    }
}
