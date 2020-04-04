using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using truemuz.API.Domain.Models;
using truemuz.API.Domain.Repositories;
using truemuz.API.Persistence.Contexts;

namespace truemuz.API.Persistence.Repositories
{
    public class SongRepository : BaseRepository, ISongRepository
    {
        public SongRepository(AppDbContext context) : base(context) { }

        public async Task<IEnumerable<Song>> ListAsync()
        {
            return await _context.Song.AsNoTracking().ToListAsync();
        }

        public async Task AddAsync(Song song)
        {
            await _context.Song.AddAsync(song);
        }

        public async Task<Song> FindByIdAsync(int id)
        {
            var song = await _context.Song.Include(s => s.Links).Include(s => s.SongGroup.Album.Band).FirstOrDefaultAsync(s => s.Id == id);
            return song;
        }

        public void Update(Song song)
        {
            _context.Song.Update(song);
        }

        public void Remove(Song song)
        {
            _context.Song.Remove(song);
        }
    }
}
