using System.Collections.Generic;

namespace truemuz.API.Domain.Models
{
    public class Song : Entity<int>
    {
        public string Name { get; set; }

        public string FileName { get; set; }

        public bool IsMaster { get; set; }

        public int SongGroupId { get; set; }

        public SongGroup SongGroup { get; set; }

        public ICollection<Link> Links { get; set; }
    }
}
