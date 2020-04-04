﻿using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using truemuz.API.Domain.Models;
using truemuz.API.Domain.Repositories;
using truemuz.API.Persistence.Contexts;

namespace truemuz.API.Persistence.Repositories
{
    public class LinkRepository : BaseRepository, ILinkRepository
    {
        public LinkRepository(AppDbContext context) : base(context) { }

        public async Task<IEnumerable<Link>> ListAsync()
        {
            return await _context.Links.AsNoTracking().ToListAsync();
        }

        public async Task AddAsync(Link link)
        {
            await _context.Links.AddAsync(link);
        }

        public async Task<Link> FindByIdAsync(int id)
        {
            var Link = await _context.Links.FindAsync(id);
            return Link;
        }

        public void Update(Link link)
        {
            _context.Links.Update(link);
        }

        public void Remove(Link link)
        {
            _context.Links.Remove(link);
        }
    }
}
