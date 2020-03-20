using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace truemuz.API.Infrastructure
{
    public abstract class EntityTypeMapping<TEntity> where TEntity : class
    {
        public abstract void Map(EntityTypeBuilder<TEntity> builder);
    }
}
