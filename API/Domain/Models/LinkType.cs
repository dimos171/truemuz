using System.Collections.Generic;

namespace truemuz.API.Domain.Models
{
    public class LinkType: BaseModel
    {
        #region Navigation properties
        public ICollection<Link> Links { get; set; } = new List<Link>();
        #endregion
    }
}
