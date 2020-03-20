using System;
using System.Threading.Tasks;
using Microsoft.Extensions.Caching.Memory;
using truemuz.API.Domain.Models;
using truemuz.API.Domain.Models.Queries;
using truemuz.API.Domain.Repositories;
using truemuz.API.Domain.Services;
using truemuz.API.Domain.Services.Communication;
using truemuz.API.Infrastructure;

namespace truemuz.API.Services
{
    public class AlbumService : IAlbumService
    {
        private readonly IAlbumRepository _albumRepository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IBandService _bandService;
        private readonly IMemoryCache _cache;

        public AlbumService(IAlbumRepository albumRepository, IUnitOfWork unitOfWork, IBandService bandService, IMemoryCache cache)
        {
            _albumRepository = albumRepository;
            _unitOfWork = unitOfWork;
            _bandService = bandService;
            _cache = cache;
        }

        public async Task<QueryResult<Album>> ListAsync(AlbumsQuery query)
        {
            string cacheKey = GetCacheKeyForAlbumsQuery(query);

            var albums = await _cache.GetOrCreateAsync(cacheKey, (entry) =>
            {
                entry.AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(1);
                return _albumRepository.ListAsync(query);
            });

            return albums;
        }

        public async Task<AlbumResponse> SaveAsync(Album album)
        {
            try
            {
                var existingBand = await _bandService.FindByIdAsync(album.BandId);
                if (existingBand == null)
                    return new AlbumResponse("Invalid band.");

                await _albumRepository.AddAsync(album);
                await _unitOfWork.CompleteAsync();

                return new AlbumResponse(album);
            }
            catch (Exception ex)
            {
                return new AlbumResponse($"An error occurred when saving the album: {ex.Message}");
            }
        }

        public async Task<AlbumResponse> UpdateAsync(int id, Album album)
        {
            var existingAlbum = await _albumRepository.FindByIdAsync(id);

            if (existingAlbum == null)
                return new AlbumResponse("Album not found.");

            var existingBand = await _bandService.FindByIdAsync(album.BandId);
            if (existingBand == null)
                return new AlbumResponse("Invalid band.");

            existingAlbum.Name = album.Name;
            existingAlbum.BandId = album.BandId;

            try
            {
                _albumRepository.Update(existingAlbum);
                await _unitOfWork.CompleteAsync();

                return new AlbumResponse(existingAlbum);
            }
            catch (Exception ex)
            {
                return new AlbumResponse($"An error occurred when updating the album: {ex.Message}");
            }
        }

        public async Task<AlbumResponse> DeleteAsync(int id)
        {
            var existingAlbum = await _albumRepository.FindByIdAsync(id);

            if (existingAlbum == null)
                return new AlbumResponse("Album not found.");

            try
            {
                _albumRepository.Remove(existingAlbum);
                await _unitOfWork.CompleteAsync();

                return new AlbumResponse(existingAlbum);
            }
            catch (Exception ex)
            {
                return new AlbumResponse($"An error occurred when deleting the album: {ex.Message}");
            }
        }

        private string GetCacheKeyForAlbumsQuery(AlbumsQuery query)
        {
            string key = CacheKeys.AlbumsList.ToString();

            if (query.BandId.HasValue && query.BandId > 0)
            {
                key = string.Concat(key, "_", query.BandId.Value);
            }

            key = string.Concat(key, "_", query.Page, "_", query.ItemsPerPage);
            return key;
        }
    }
}