using System.Collections.Generic;
using System.Threading.Tasks;

namespace truemuz.API.Domain.Repositories
{
    public interface IGenericRepository<T>
    {
        Task<IEnumerable<T>> ListAsync();

        Task AddAsync(T item);

        Task<T> FindByIdAsync(int itemId);

        void Update(T item);

        void Remove(T item);
    }
}
