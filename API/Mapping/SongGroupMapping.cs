using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using truemuz.API.Domain.Models;
using truemuz.API.Infrastructure;

namespace truemuz.API.Mapping
{
    public class SongGroupMapping : EntityTypeMapping<SongGroup>
    {
        public override void Map(EntityTypeBuilder<SongGroup> builder)
        {
            builder.ToTable("SongGroup");
            builder.HasKey(p => p.Id);
            builder.Property(p => p.Id).IsRequired().ValueGeneratedOnAdd();
            builder.Property(p => p.Name).IsRequired().HasMaxLength(100);

            builder.HasOne(x => x.History).WithOne(x => x.SongGroup).HasForeignKey<SongGroup>(x => x.HistoryId);
            builder.HasOne(x => x.Album).WithMany(x => x.SongGroups).HasForeignKey(x => x.AlbumId);
            builder.HasMany(p => p.Songs).WithOne(p => p.SongGroup).HasForeignKey(p => p.SongGroupId);

            builder.HasData
            (
                new SongGroup
                {
                    Id = 1,
                    Name = "Hitchhiking the Air",
                    AlbumId = 1,
                    HistoryId = 1
                },
                new SongGroup
                {
                    Id = 2,
                    Name = "Aerophobia",
                    AlbumId = 1,
                    HistoryId = 2
                },
                new SongGroup
                {
                    Id = 3,
                    Name = "Chaos",
                    AlbumId = 1,
                    HistoryId = 3
                },
                new SongGroup
                {
                    Id = 4,
                    Name = "Do What You Feel",
                    AlbumId = 1,
                    HistoryId = 4
                }
            );
        }
    }
}
