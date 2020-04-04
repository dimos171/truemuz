using System.Collections.Generic;
using System.Threading.Tasks;
using truemuz.API.Domain.Models;

namespace truemuz.API.Domain.Services
{
    public interface ILinkGenerationService
    {
        Task<IEnumerable<Link>> GenerateStreamLinks(string bandName, string albumName, string songName, int songId);
    }
}
