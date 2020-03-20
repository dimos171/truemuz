using truemuz.API.Domain.Models;

namespace truemuz.API.Domain.Services.Communication
{
    public class AlbumResponse : BaseResponse<Album>
    {
        public AlbumResponse(Album album) : base(album) { }

        public AlbumResponse(string message) : base(message) { }
    }
}