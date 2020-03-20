using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using truemuz.API.Domain.Models;
using truemuz.API.Domain.Services;
using truemuz.API.Resources;

namespace truemuz.API.Controllers
{
    [Route("/api/bands")]
    [Produces("application/json")]
    [ApiController]
    public class BandsController : Controller
    {
        private readonly IBandService _bandService;
        private readonly IMapper _mapper;

        public BandsController(IBandService bandService, IMapper mapper)
        {
            _bandService = bandService;
            _mapper = mapper;
        }

        /// <summary>
        /// Lists all bands.
        /// </summary>
        /// <returns>List of bands.</returns>
        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<BandResource>), 200)]
        public async Task<IEnumerable<BandResource>> ListAsync()
        {
            var bands = await _bandService.ListAsync();
            var resources = _mapper.Map<IEnumerable<Band>, IEnumerable<BandResource>>(bands);

            return resources;
        }

        /// <summary>
        /// Saves a new band.
        /// </summary>
        /// <param name="resource">Band data.</param>
        /// <returns>Response for the request.</returns>
        [HttpPost]
        [ProducesResponseType(typeof(BandResource), 201)]
        [ProducesResponseType(typeof(ErrorResource), 400)]
        public async Task<IActionResult> PostAsync([FromBody] SaveBandResource resource)
        {
            var band = _mapper.Map<SaveBandResource, Band>(resource);
            var result = await _bandService.SaveAsync(band);

            if (!result.Success)
            {
                return BadRequest(new ErrorResource(result.Message));
            }

            var bandResource = _mapper.Map<Band, BandResource>(result.Resource);
            return Ok(bandResource);
        }

        /// <summary>
        /// Updates an existing band according to an identifier.
        /// </summary>
        /// <param name="id">Band identifier.</param>
        /// <param name="resource">Updated band data.</param>
        /// <returns>Response for the request.</returns>
        [HttpPut("{id}")]
        [ProducesResponseType(typeof(BandResource), 200)]
        [ProducesResponseType(typeof(ErrorResource), 400)]
        public async Task<IActionResult> PutAsync(int id, [FromBody] SaveBandResource resource)
        {
            var band = _mapper.Map<SaveBandResource, Band>(resource);
            var result = await _bandService.UpdateAsync(id, band);

            if (!result.Success)
            {
                return BadRequest(new ErrorResource(result.Message));
            }

            var bandResource = _mapper.Map<Band, BandResource>(result.Resource);
            return Ok(bandResource);
        }

        /// <summary>
        /// Deletes a given band according to an identifier.
        /// </summary>
        /// <param name="id">Band identifier.</param>
        /// <returns>Response for the request.</returns>
        [HttpDelete("{id}")]
        [ProducesResponseType(typeof(BandResource), 200)]
        [ProducesResponseType(typeof(ErrorResource), 400)]
        public async Task<IActionResult> DeleteAsync(int id)
        {
            var result = await _bandService.DeleteAsync(id);

            if (!result.Success)
            {
                return BadRequest(new ErrorResource(result.Message));
            }

            var bandResource = _mapper.Map<Band, BandResource>(result.Resource);
            return Ok(bandResource);
        }
    }
}