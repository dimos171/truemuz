using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using truemuz.API.Domain.Models;
using truemuz.API.Domain.Repositories;
using truemuz.API.Persistence.Contexts;

namespace truemuz.API.Persistence.Repositories
{
    public class BandRepository : BaseRepository, IBandRepository
    {
        public BandRepository(AppDbContext context) : base(context) { }

        public async Task<IEnumerable<Band>> ListAsync()
        {
            return await _context.Bands.AsNoTracking().ToListAsync();
        }

        public async Task AddAsync(Band band)
        {
            await _context.Bands.AddAsync(band);
        }

        public async Task<Band> FindByIdAsync(int id)
        {
            return await _context.Bands.FindAsync(id);
        }

        public void Update(Band band)
        {
            _context.Bands.Update(band);
        }

        public void Remove(Band band)
        {
            _context.Bands.Remove(band);
        }
    }
}