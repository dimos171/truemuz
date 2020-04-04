using System.Collections.Generic;

namespace truemuz.API.Domain.Models
{
    public class LinkType: Entity<int>
    {
        public string Name { get; set; }

        public ICollection<Link> Links { get; set; }
    }
}
