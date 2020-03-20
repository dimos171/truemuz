using truemuz.API.Domain.Models;

namespace truemuz.API.Domain.Services.Communication
{
    public class BandResponse : BaseResponse<Band>
    {
        /// <summary>
        /// Creates a success response.
        /// </summary>
        /// <param name="band">Saved band.</param>
        /// <returns>Response.</returns>
        public BandResponse(Band band) : base(band)
        { }

        /// <summary>
        /// Creates an error response.
        /// </summary>
        /// <param name="message">Error message.</param>
        /// <returns>Response.</returns>
        public BandResponse(string message) : base(message)
        { }
    }
}