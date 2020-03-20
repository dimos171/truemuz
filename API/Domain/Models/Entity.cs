namespace truemuz.API.Domain.Models
{
    public abstract class Entity<TId>
    {
        public virtual TId Id { get; set; }
    }
}
