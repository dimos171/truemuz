using System.Threading.Tasks;
using truemuz.API.Domain.Models;
using truemuz.API.Domain.Models.Queries;

namespace truemuz.API.Domain.Repositories
{
    public interface IAlbumRepository : IGenericRepository<Album>
    {
        Task<QueryResult<Album>> ListAsync(AlbumsQuery query);
    }
}