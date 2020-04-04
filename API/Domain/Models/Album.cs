using System.Collections.Generic;

namespace truemuz.API.Domain.Models
{
    public class Album : Entity<int>
    {
        public string Name { get; set; }

        public int Year { get; set; }

        public string Image { get; set; }

        public int BandId { get; set; }

        public Band Band { get; set; }

        public ICollection<SongGroup> SongGroups { get; set; } = new List<SongGroup>();
    }
}