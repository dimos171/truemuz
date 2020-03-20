using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using truemuz.API.Domain.Models;
using truemuz.API.Infrastructure;

namespace truemuz.API.Mapping
{
    public class LinkMapping : EntityTypeMapping<Link>
    {
        public override void Map(EntityTypeBuilder<Link> builder)
        {
            builder.ToTable("Link");
            builder.HasKey(p => p.Id);
            builder.Property(p => p.Id).IsRequired().ValueGeneratedOnAdd();
            builder.Property(p => p.Name).IsRequired().HasMaxLength(30);

            builder.HasOne(x => x.Song).WithMany(x => x.Links).HasForeignKey(x => x.SongId);
            builder.HasOne(p => p.LinkType).WithMany(p => p.Links).HasForeignKey(p => p.LinkTypeId);
        }
    }
}
