using System.Collections.Generic;
using System.Threading.Tasks;
using Shop.API.Domain.Model;

namespace Shop.API.Domain.Repositories
{
    public interface IRoleRepository
    {
        Task<IEnumerable<Role>> ListAsync();
        Task AddAsync(Role role);
        void Update(Role role);
        Task<Role> FindByIdAsync(int id);
        void Remove(Role role);
    }
}