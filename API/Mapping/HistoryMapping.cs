using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using truemuz.API.Domain.Models;
using truemuz.API.Infrastructure;

namespace truemuz.API.Mapping
{
    public class HistoryMapping : EntityTypeMapping<History>
    {
        public override void Map(EntityTypeBuilder<History> builder)
        {
            builder.ToTable("History");
            builder.HasKey(p => p.Id);
            builder.Property(p => p.Id).IsRequired().ValueGeneratedOnAdd();
            builder.Property(p => p.Name).IsRequired().HasMaxLength(30);

            builder.HasOne(x => x.SongGroup).WithOne(x => x.History).HasForeignKey<History>(x => x.SongGroupId);
        }
    }
}
