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
            builder.Property(p => p.Name).IsRequired().HasMaxLength(100);
            builder.Property(p => p.FileName).HasMaxLength(100);

            builder.HasMany(p => p.Links).WithOne(p => p.Song).HasForeignKey(p => p.SongId);

            builder.HasData
            (
                new Song
                {
                    Id = 1,
                    Name = "Avtostopom - v1",
                    FileName = "Avtostopom - v1.mp3",
                    SongGroupId = 1
                },
                new Song
                {
                    Id = 2,
                    Name = "Hitchhiking The Air",
                    FileName = "HitchhikingTheAir.mp3",
                    IsMaster = true,
                    SongGroupId = 1
                },
                new Song
                {
                    Id = 3,
                    Name = "Aerophobia",
                    FileName = "Aerophobia.mp3",
                    IsMaster = true,
                    SongGroupId = 2
                },
                new Song
                {
                    Id = 4,
                    Name = "Chaos-v1",
                    FileName = "Chaos-v1.mp3",
                    SongGroupId = 3
                },
                new Song
                {
                    Id = 5,
                    Name = "Chaos",
                    FileName = "Chaos.mp3",
                    IsMaster = true,
                    SongGroupId = 3
                },
                new Song
                {
                    Id = 6,
                    Name = "Do What You Feel - v1",
                    FileName = "Do What You Feel - v1.mp3",
                    SongGroupId = 4
                },
                new Song
                {
                    Id = 7,
                    Name = "Do What You Feel",
                    FileName = "Do What You Feel.mp3",
                    IsMaster = true,
                    SongGroupId = 4
                }
            );
        }
    }
}
