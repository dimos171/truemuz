using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using truemuz.API.Domain.Models;
using truemuz.API.Infrastructure;

namespace truemuz.API.Mapping
{
    public class SongMapping : EntityTypeMapping<Song>
    {
        public override void Map(EntityTypeBuilder<Song> builder)
        {
            builder.ToTable("Song");
            builder.HasKey(p => p.Id);
            builder.Property(p => p.Id).IsRequired().ValueGeneratedOnAdd();
            builder.Property(p => p.Name).IsRequired().HasMaxLength(30);

            builder.HasMany(p => p.Links).WithOne(p => p.Song).HasForeignKey(p => p.SongId);
        }
    }
}
