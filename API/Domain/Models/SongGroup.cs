using System.Collections.Generic;

namespace truemuz.API.Domain.Models
{
    public class SongGroup : Entity<int>
    {
        public string Name { get; set; }

        public int AlbumId { get; set; }

        public int HistoryId { get; set; }

        public Album Album { get; set; }

        public History History { get; set; }

        public ICollection<Song> Songs { get; set; }
    }
}
