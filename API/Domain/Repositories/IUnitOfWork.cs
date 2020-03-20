using System.Threading.Tasks;

namespace truemuz.API.Domain.Repositories
{
    public interface IUnitOfWork
    {
         Task CompleteAsync();
    }
}