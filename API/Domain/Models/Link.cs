namespace truemuz.API.Domain.Models
{
    public class Link: Entity<int>
    {
        public string Url { get; set; }

        public string Name { get; set; }

        public int SongId { get; set; }

        public int LinkTypeId { get; set; }

        public Song Song { get; set; }

        public LinkType LinkType { get; set; }
    }
}
