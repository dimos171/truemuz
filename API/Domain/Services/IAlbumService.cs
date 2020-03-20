using System.Threading.Tasks;
using truemuz.API.Domain.Models;
using truemuz.API.Domain.Models.Queries;
using truemuz.API.Domain.Services.Communication;

namespace truemuz.API.Domain.Services
{
    public interface IAlbumService
    {
        Task<QueryResult<Album>> ListAsync(AlbumsQuery query);

        Task<AlbumResponse> SaveAsync(Album album);

        Task<AlbumResponse> UpdateAsync(int albumId, Album album);

        Task<AlbumResponse> DeleteAsync(int albumId);
    }
}