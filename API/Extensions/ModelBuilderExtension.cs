using Microsoft.EntityFrameworkCore;
using truemuz.API.Infrastructure;

namespace truemuz.API.Extensions
{
    public static class ModelBuilderExtension
    {
        public static void AddConfiguration<TEntity>(this ModelBuilder modelBuilder, EntityTypeMapping<TEntity> configuration)
           where TEntity : class
        {
            configuration.Map(modelBuilder.Entity<TEntity>());
        }
    }
}
