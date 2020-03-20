using System.Collections.Generic;
using System.Threading.Tasks;
using truemuz.API.Domain.Models;
using truemuz.API.Domain.Services.Communication;

namespace truemuz.API.Domain.Services
{
    public interface IBandService
    {
        Task<IEnumerable<Band>> ListAsync();

        Task<Band> FindByIdAsync(int bandId);

        Task<BandResponse> SaveAsync(Band band);

        Task<BandResponse> UpdateAsync(int bandId, Band band);

        Task<BandResponse> DeleteAsync(int bandId);
    }
}