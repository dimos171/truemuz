using System.Collections.Generic;

namespace truemuz.API.Domain.Models
{
    public class Band : BaseModel
    {
        #region Navigation properties
        public ICollection<Album> Albums { get; set; } = new List<Album>();
        #endregion
    }
}