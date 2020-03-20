using System.Collections.Generic;

namespace truemuz.API.Domain.Models
{
    public class Song : BaseModel
    {
        public int SongGroupId { get; set; }

        #region Navigation properties
        public SongGroup SongGroup { get; set; }

        public ICollection<Link> Links { get; set; } = new List<Link>();
        #endregion
    }
}
