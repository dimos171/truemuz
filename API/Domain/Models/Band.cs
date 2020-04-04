using System.Collections.Generic;

namespace truemuz.API.Domain.Models
{
    public class Band : Entity<int>
    {
        public string Name { get; set; }

        public ICollection<Album> Albums { get; set; } = new List<Album>();
    }
}