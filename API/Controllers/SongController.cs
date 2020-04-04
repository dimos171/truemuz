using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using truemuz.API.Domain.Services;
using truemuz.API.Resources;
using System.Collections.Generic;
using System.Linq;

namespace truemuz.API.Controllers
{
    [Route("api/song")]
    [Produces("application/json")]
    [ApiController]
    public class SongController : Controller
    {
        private readonly ISongService _songService;

        public SongController(ISongService songService)
        {
            _songService = songService;
        }

        /// <summary>
        /// Stream links for specified song.
        /// </summary>
        /// <returns>Stream links.</returns>
        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<LinkResource>), 200)]
        public async Task<IEnumerable<LinkResource>> GetStreamLinks([FromQuery] int songId)
        {
            var queryResult = await _songService.GetStreamLinks(songId);
            return queryResult.Select(x => new LinkResource { Url = x.Url, Type = (Resources.LinkType)x.LinkTypeId });
        }
    }
}
