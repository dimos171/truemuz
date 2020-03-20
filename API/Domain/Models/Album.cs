using System.Collections.Generic;

namespace truemuz.API.Domain.Models
{
    public class Album : BaseModel
    {
        public int BandId { get; set; }

        #region Navigation properties
        public Band Band { get; set; }

        public ICollection<SongGroup> SongGroups { get; set; } = new List<SongGroup>();
        #endregion
    }
}