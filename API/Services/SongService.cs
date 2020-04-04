using System.Threading.Tasks;
using truemuz.API.Domain.Models;
using truemuz.API.Domain.Repositories;
using truemuz.API.Domain.Services;
using System.Collections.Generic;

namespace truemuz.API.Services
{
    public class SongService : ISongService
    {
        private readonly ISongRepository _songRepository;
        private readonly ILinkGenerationService _linkGenerationService;
        private readonly ILinkRepository _linkRepository;
        private readonly IUnitOfWork _unitOfWork;

        public SongService(ISongRepository songRepository, ILinkGenerationService linkGenerationService, ILinkRepository linkRepository, IUnitOfWork unitOfWork)
        {
            _songRepository = songRepository;
            _linkGenerationService = linkGenerationService;
            _linkRepository = linkRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<IEnumerable<Link>> GetStreamLinks(int songId)
        {
            var song = await _songRepository.FindByIdAsync(songId);

            if (song.Links == null || song.Links.Count == 0)
            {
                var links = await _linkGenerationService.GenerateStreamLinks(song.SongGroup.Album.Band.Name, song.SongGroup.Album.Name, song.Name, songId);

                foreach (var link in links)
                {
                    await _linkRepository.AddAsync(link);
                }
                await _unitOfWork.CompleteAsync();
            }

            return song.Links;
        }

    }
}
