using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using truemuz.API.Domain.Models;
using truemuz.API.Infrastructure;

namespace truemuz.API.Mapping
{
    public class AlbumMapping : EntityTypeMapping<Album>
    {
        public override void Map(EntityTypeBuilder<Album> builder)
        {
            builder.ToTable("Album");
            builder.HasKey(p => p.Id);
            builder.Property(p => p.Id).IsRequired().ValueGeneratedOnAdd();
            builder.Property(p => p.Name).IsRequired().HasMaxLength(30);

            builder.HasOne(x => x.Band).WithMany(x => x.Albums).HasForeignKey(x => x.BandId);
            builder.HasMany(p => p.SongGroups).WithOne(p => p.Album).HasForeignKey(p => p.AlbumId);

            builder.HasData
            (
                new Album
                {
                    Id = 100,
                    Name = "Supreme Truth",
                    BandId = 100
                },
                new Album
                {
                    Id = 101,
                    Name = "Exodus",
                    BandId = 100
                },
                new Album
                {
                    Id = 102,
                    Name = "Amanuensis",
                    BandId = 101,
                },
                new Album
                {
                    Id = 103,
                    Name = "Phronesis",
                    BandId = 101,
                }
            );
        }
    }
}
