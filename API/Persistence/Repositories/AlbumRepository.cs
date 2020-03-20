using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using truemuz.API.Domain.Models;
using truemuz.API.Domain.Models.Queries;
using truemuz.API.Domain.Repositories;
using truemuz.API.Persistence.Contexts;

namespace truemuz.API.Persistence.Repositories
{
	public class AlbumRepository : BaseRepository, IAlbumRepository
	{
		public AlbumRepository(AppDbContext context) : base(context) { }

		public async Task<IEnumerable<Album>> ListAsync()
		{
			return await _context.Albums.AsNoTracking().ToListAsync();
		}

		public async Task<QueryResult<Album>> ListAsync(AlbumsQuery query)
		{
			IQueryable<Album> queryable = _context.Albums.Include(p => p.Band).AsNoTracking();

			if (query.BandId.HasValue && query.BandId > 0)
			{
				queryable = queryable.Where(p => p.BandId == query.BandId);
			}

			int totalItems = await queryable.CountAsync();

			List<Album> albums = await queryable.Skip((query.Page - 1) * query.ItemsPerPage)
													.Take(query.ItemsPerPage)
													.ToListAsync();

			return new QueryResult<Album>
			{
				Items = albums,
				TotalItems = totalItems,
			};
		}

		public async Task<Album> FindByIdAsync(int id)
		{
			return await _context.Albums
								 .Include(p => p.Band)
								 .FirstOrDefaultAsync(p => p.Id == id);
		}

		public async Task AddAsync(Album album)
		{
			await _context.Albums.AddAsync(album);
		}

		public void Update(Album album)
		{
			_context.Albums.Update(album);
		}

		public void Remove(Album album)
		{
			_context.Albums.Remove(album);
		}
	}
}