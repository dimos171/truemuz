using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using truemuz.API.Domain.Models;
using truemuz.API.Infrastructure;

namespace truemuz.API.Mapping
{
    public class LinkTypeMapping : EntityTypeMapping<LinkType>
    {
        public override void Map(EntityTypeBuilder<LinkType> builder)
        {
            builder.ToTable("LinkType");
            builder.HasKey(p => p.Id);
            builder.Property(p => p.Id).IsRequired().ValueGeneratedOnAdd();
            builder.Property(p => p.Name).IsRequired().HasMaxLength(30);

            builder.HasMany(p => p.Links).WithOne(p => p.LinkType).HasForeignKey(p => p.LinkTypeId);

            builder.HasData
            (
                new LinkType { Id = 1, Name = "Hls" },
                new LinkType { Id = 2, Name = "Dash"},
                new LinkType { Id = 3, Name = "Smooth"}
            );
        }
    }
}
