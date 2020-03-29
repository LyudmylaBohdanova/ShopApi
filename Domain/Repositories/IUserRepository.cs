using System.Collections.Generic;
using System.Threading.Tasks;
using Shop.API.Domain.Model;

namespace Shop.API.Domain.Repositories
{
    public interface IUserRepository
    {
        Task<IEnumerable<User>> ListAsync();
        Task AddAsync(User user);
        void Update(User user);
        Task<User> FindByIdAsync(int id);
        void Remove(User user);
    }
}