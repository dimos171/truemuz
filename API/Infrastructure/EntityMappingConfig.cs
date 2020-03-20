using Microsoft.EntityFrameworkCore;
using truemuz.API.Extensions;
using truemuz.API.Mapping;

namespace truemuz.API.Infrastructure
{
    public static class EntityMappingConfig
    {
        public static void RegisterMappings(ModelBuilder modelBuilder)
        {
            modelBuilder.AddConfiguration(new BandMapping());
            modelBuilder.AddConfiguration(new AlbumMapping());
            modelBuilder.AddConfiguration(new SongGroupMapping());
            modelBuilder.AddConfiguration(new HistoryMapping());
            modelBuilder.AddConfiguration(new SongMapping());
            modelBuilder.AddConfiguration(new LinkMapping());
            modelBuilder.AddConfiguration(new LinkTypeMapping());
        }
    }
}
