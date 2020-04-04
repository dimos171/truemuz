using System.Collections.Generic;
using System.Threading.Tasks;
using truemuz.API.Domain.Models;

namespace truemuz.API.Domain.Services
{
    public interface ISongService
    {
        Task<IEnumerable<Link>> GetStreamLinks(int songId);
    }
}
