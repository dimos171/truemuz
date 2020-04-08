using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using truemuz.API.Domain.Models;
using truemuz.API.Infrastructure;

namespace truemuz.API.Mapping
{
    public class BandMapping : EntityTypeMapping<Band>
    {
        public override void Map(EntityTypeBuilder<Band> builder)
        {
            builder.ToTable("Band");
            builder.HasKey(p => p.Id);
            builder.Property(p => p.Id).IsRequired().ValueGeneratedOnAdd();//.HasValueGenerator<InMemoryIntegerValueGenerator<int>>();
            builder.Property(p => p.Name).IsRequired().HasMaxLength(100);

            builder.HasMany(p => p.Albums).WithOne(p => p.Band).HasForeignKey(p => p.BandId);

            builder.HasData
            (
                new Band { Id = 1, Name = "modernova" }
            );
        }
    }
}
