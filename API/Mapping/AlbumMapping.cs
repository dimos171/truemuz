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
            builder.Property(p => p.Name).IsRequired().HasMaxLength(100);
            builder.Property(p => p.Year).IsRequired().HasMaxLength(4);
            builder.Property(p => p.Image).IsRequired().HasMaxLength(100);


            builder.HasOne(x => x.Band).WithMany(x => x.Albums).HasForeignKey(x => x.BandId);
            builder.HasMany(p => p.SongGroups).WithOne(p => p.Album).HasForeignKey(p => p.AlbumId);

            builder.HasData
            (
                new Album
                {
                    Id = 1,
                    Name = "DoWhatYouFeel",
                    Year = 2018,
                    Image = "Logo black.jpg",
                    BandId = 1,                    
                }
            );
        }
    }
}
