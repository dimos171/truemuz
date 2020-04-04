using System.Text.Json.Serialization;

namespace truemuz.API.Resources
{
    public class LinkResource
    {
        public string Url { get; set; }

        [JsonConverter(typeof(JsonStringEnumConverter))]
        public LinkType Type { get; set; }
    }

    public enum LinkType
    {
        Hls = 1,
        Dash,
        Smooth
    }
}
