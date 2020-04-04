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

            builder.HasOne(x => x.SongGroup).WithOne(x => x.History).HasForeignKey<History>(x => x.SongGroupId);

            builder.HasData
            (
                new History
                {
                    Id = 1,
                    SongGroupId = 1,
                    Text = "Первая версия этой песни была написана ещё в 2008 году на русском языке и звучала в первой аранжировке так <a href='song/1'>Avtostopom-v1.</a>"+
                           "В 2018 мы решили сделать другую версию где каждый участник команды добавил своё видение. Получился такой трек <a href='song/2'>Hitchhiking the Air</a>," +
                           "текст является переводом оригинальной русской версии.Этот трек вышел в первом EP альбоме Modernova." +
                           "@Dima_Razorvin придумал классное гитарное вступление," +
                           "которое сразу всем зашло $alternative - track#3-v1"
                },
                new History
                {
                    Id = 2,
                    SongGroupId = 2,
                    Text = "Текст песни написан @Dmitry Dyadin во время полета после сильной турбулентности и начинался с основной басовой партией. " +
                           "Дальше все вместе стали развивать этот рисунок. Песня почти сразу сформировалась в финальный вид <a href='song/3'>Aerophobia</a>, который и вошёл в альбом Do what you feel. " +
                           "Песню отличает непопулярный размер 5/4 в куплетах и в проигрыше перед соло символизирующий ту самую турбулентность."
                },
                new History
                {
                    Id = 3,
                    SongGroupId = 3,
                    Text = "Набросок принёс @Vladimir Grishman и выглядел он так: <a href='song/4'>Chaos-v1</a> @Dmitry Dyadin тут же уловил, " +
                           "что в музыке веет ассоциацией на фильм Мама! Даррена Аронофски. Он написал текст вдохновлённый сюжетом этого фильма. " +
                           "Затем мы сделали аранжировку и получилась финальная версия <a href='song/5'>Chaos</a> которая вошла в первый EP - альбом Do What You Feel."
                },
                new History
                {
                    Id = 4,
                    SongGroupId = 4,
                    Text = "Изначально у @Vladimir Grishman был набросок трека и он никак не собирался в цельную структуру. Последней черновой версией, которую он записал была <a href='song/6'>Do what you feel - v1</a>." +
                           "Во вступлении был странный контрабас и параллельный гитарный риф, а также трубы на фоне, что было довольно шумно, это обычное дело для первых демок,  мы не боимся пихать лишнее," +
                           "чтобы на финальном треке оставить только самое важное, а лишнее убрать. По итогу трек получился таким: <a href='song/7'>Do what you feel</a>." +
                           "Вступление похоже на босанову и звучит легко.А взрыв происходит в самом припеве.Текст песни написал @Dmitry Razorvin.Мы внутри себя думали о том, " +
                           "насколько же он графоманский и нормально ли писать о том что буквально означает делай, что чувствуешь. Но наверное, это послужило девизом для нашего дальнейшего творчества. " +
                           "Делай, что чувствуешь — это как нельзя хорошо подходит для музыки и поисков себя."
                }
            );
        }
    }
}
