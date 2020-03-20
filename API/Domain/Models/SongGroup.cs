using System.Collections.Generic;

namespace truemuz.API.Domain.Models
{
    public class SongGroup : BaseModel
    {
        public int AlbumId { get; set; }

        public int HistoryId { get; set; }

        #region Navigation properties
        public Album Album { get; set; }

        public History History { get; set; }

        public ICollection<Song> Songs { get; set; } = new List<Song>();
        #endregion
    }
}
