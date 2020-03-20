using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Extensions.Caching.Memory;
using truemuz.API.Domain.Models;
using truemuz.API.Domain.Repositories;
using truemuz.API.Domain.Services;
using truemuz.API.Domain.Services.Communication;
using truemuz.API.Infrastructure;

namespace truemuz.API.Services
{
    public class BandService : IBandService
    {
        private readonly IBandRepository _bandRepository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMemoryCache _cache;

        public BandService(IBandRepository bandRepository, IUnitOfWork unitOfWork, IMemoryCache cache)
        {
            _bandRepository = bandRepository;
            _unitOfWork = unitOfWork;
            _cache = cache;
        }

        public async Task<IEnumerable<Band>> ListAsync()
        {
            var bands = await _cache.GetOrCreateAsync(CacheKeys.BandsList, (entry) => {
                entry.AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(1);
                return _bandRepository.ListAsync();
            });
            
            return bands;
        }

        public async Task<Band> FindByIdAsync(int bandId)
        {
            return await _bandRepository.FindByIdAsync(bandId);
        }

        public async Task<BandResponse> SaveAsync(Band band)
        {
            try
            {
                await _bandRepository.AddAsync(band);
                await _unitOfWork.CompleteAsync();

                return new BandResponse(band);
            }
            catch (Exception ex)
            {
                return new BandResponse($"An error occurred when saving the band: {ex.Message}");
            }
        }

        public async Task<BandResponse> UpdateAsync(int id, Band band)
        {
            var existingBand = await _bandRepository.FindByIdAsync(id);

            if (existingBand == null)
                return new BandResponse("Band not found.");

            existingBand.Name = band.Name;

            try
            {
                _bandRepository.Update(existingBand);
                await _unitOfWork.CompleteAsync();

                return new BandResponse(existingBand);
            }
            catch (Exception ex)
            {
                return new BandResponse($"An error occurred when updating the band: {ex.Message}");
            }
        }

        public async Task<BandResponse> DeleteAsync(int id)
        {
            var existingBand = await _bandRepository.FindByIdAsync(id);

            if (existingBand == null)
                return new BandResponse("Band not found.");

            try
            {
                _bandRepository.Remove(existingBand);
                await _unitOfWork.CompleteAsync();

                return new BandResponse(existingBand);
            }
            catch (Exception ex)
            {
                return new BandResponse($"An error occurred when deleting the band: {ex.Message}");
            }
        }
    }
}