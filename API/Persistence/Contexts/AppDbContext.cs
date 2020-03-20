using Microsoft.EntityFrameworkCore;
using truemuz.API.Domain.Models;
using truemuz.API.Infrastructure;

namespace truemuz.API.Persistence.Contexts
{
    public class AppDbContext : DbContext
    {
        public DbSet<Band> Bands { get; set; }

        public DbSet<Album> Albums { get; set; }

        public DbSet<SongGroup> SongGroup { get; set; }

        public DbSet<History> History { get; set; }

        public DbSet<Song> Song { get; set; }

        public DbSet<Link> Link { get; set; }

        public DbSet<LinkType> LinkType { get; set; }

        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            EntityMappingConfig.RegisterMappings(builder);

            base.OnModelCreating(builder);
        }
    }
}