using System.Collections.Generic;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace TimeTriggers
{
    [BsonIgnoreExtraElements]
    public class Artist
    { 
        [BsonId]
        [BsonElement("_id")]
        public ObjectId Id { get; set; }

        [BsonElement("name")]
        public string Name { get; set; }

        [BsonElement("albums")]
        public IEnumerable<Album> Albums { get; set; }
    }

    [BsonIgnoreExtraElements]
    public class Album
    {
        [BsonElement("name")]
        public string Name { get; set; }

        [BsonElement("songGroups")]
        public IEnumerable<SongGroup> SongGroups { get; set; }
    }

    [BsonIgnoreExtraElements]
    public class SongGroup
    {
        [BsonElement("name")]
        public string Name { get; set; }

        [BsonElement("songs")]
        public IEnumerable<Song> Songs { get; set; }
    }

    [BsonIgnoreExtraElements]
    public class Song
    {
        [BsonElement("displayName")]
        public string DisplayName { get; set; }

        [BsonElement("blobName")]
        public string BlobName { get; set; }

        [BsonElement("format")]
        public string Format { get; set; }

        [BsonElement("streamLinks")]
        public IEnumerable<StreamLink> StreamLinks { get; set; }

        [BsonElement("waveForm")]
        public IEnumerable<double> WaveForm { get; set; }

        [BsonElement("duration")]
        public double Duration { get; set; }
    }

    [BsonIgnoreExtraElements]
    public class StreamLink
    {
        [BsonElement("type")]
        public string Type { get; set; }

        [BsonElement("url")]
        public string Url { get; set; }
    }
}
