using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using truemuz.API.Domain.Models;
using truemuz.API.Domain.Models.Queries;
using truemuz.API.Domain.Services;
using truemuz.API.Resources;

namespace truemuz.API.Controllers
{
    [Route("/api/albums")]
    [Produces("application/json")]
    [ApiController]
    public class AlbumsController : Controller
    {
        private readonly IAlbumService _albumService;
        private readonly IMapper _mapper;

        public AlbumsController(IAlbumService albumService, IMapper mapper)
        {
            _albumService = albumService;
            _mapper = mapper;
        }

        /// <summary>
        /// Lists all existing albums.
        /// </summary>
        /// <returns>List of albums.</returns>
        [HttpGet]
        [ProducesResponseType(typeof(QueryResultResource<AlbumResource>), 200)]
        public async Task<QueryResultResource<AlbumResource>> ListAsync([FromQuery] AlbumsQueryResource query)
        {
            var albumsQuery = _mapper.Map<AlbumsQueryResource, AlbumsQuery>(query);
            var queryResult = await _albumService.ListAsync(albumsQuery);

            var resource = _mapper.Map<QueryResult<Album>, QueryResultResource<AlbumResource>>(queryResult);
            return resource;
        }

        /// <summary>
        /// Saves a new album.
        /// </summary>
        /// <param name="resource">Album data.</param>
        /// <returns>Response for the request.</returns>
        [HttpPost]
        [ProducesResponseType(typeof(AlbumResource), 201)]
        [ProducesResponseType(typeof(ErrorResource), 400)]
        public async Task<IActionResult> PostAsync([FromBody] SaveAlbumResource resource)
        {
            var album = _mapper.Map<SaveAlbumResource, Album>(resource);
            var result = await _albumService.SaveAsync(album);

            if (!result.Success)
            {
                return BadRequest(new ErrorResource(result.Message));
            }

            var albumResource = _mapper.Map<Album, AlbumResource>(result.Resource);
            return Ok(albumResource);
        }

        /// <summary>
        /// Updates an existing album according to an identifier.
        /// </summary>
        /// <param name="id">Album identifier.</param>
        /// <param name="resource">Album data.</param>
        /// <returns>Response for the request.</returns>
        [HttpPut("{id}")]
        [ProducesResponseType(typeof(AlbumResource), 201)]
        [ProducesResponseType(typeof(ErrorResource), 400)]
        public async Task<IActionResult> PutAsync(int id, [FromBody] SaveAlbumResource resource)
        {
            var album = _mapper.Map<SaveAlbumResource, Album>(resource);
            var result = await _albumService.UpdateAsync(id, album);

            if (!result.Success)
            {
                return BadRequest(new ErrorResource(result.Message));
            }

            var albumResource = _mapper.Map<Album, AlbumResource>(result.Resource);
            return Ok(albumResource);
        }

        /// <summary>
        /// Deletes a given album according to an identifier.
        /// </summary>
        /// <param name="id">Album identifier.</param>
        /// <returns>Response for the request.</returns>
        [HttpDelete("{id}")]
        [ProducesResponseType(typeof(AlbumResource), 200)]
        [ProducesResponseType(typeof(ErrorResource), 400)]
        public async Task<IActionResult> DeleteAsync(int id)
        {
            var result = await _albumService.DeleteAsync(id);

            if (!result.Success)
            {
                return BadRequest(new ErrorResource(result.Message));
            }

            var albumResource = _mapper.Map<Album, AlbumResource>(result.Resource);
            return Ok(albumResource);
        }
    }
}