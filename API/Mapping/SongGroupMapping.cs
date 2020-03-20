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
            builder.Property(p => p.Name).IsRequired().HasMaxLength(30);

            builder.HasOne(x => x.History).WithOne(x => x.SongGroup).HasForeignKey<SongGroup>(x => x.HistoryId);
            builder.HasOne(x => x.Album).WithMany(x => x.SongGroups).HasForeignKey(x => x.AlbumId);
            builder.HasMany(p => p.Songs).WithOne(p => p.SongGroup).HasForeignKey(p => p.SongGroupId);

            builder.HasData
            (
                new SongGroup 
                {
                    Id = 100,
                    Name = "EP Group",
                    AlbumId = 100,
                    HistoryId = 100
                },
                new SongGroup
                {
                    Id = 101,
                    Name = "Release Group",
                    AlbumId = 101,
                    HistoryId = 101
                }
            );
        }
    }
}
