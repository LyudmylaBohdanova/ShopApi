using System.Collections.Generic;
using System.Threading.Tasks;
using Shop.API.Domain.Model;
using Shop.API.Domain.Services.Communication;

namespace Shop.API.Domain.Services
{
    public interface IRoleService
    {
        Task<IEnumerable<Role>> ListAsync();
        Task<RoleResponse> SaveAsync(Role role);
        Task<RoleResponse> UpdateAsync(int id, Role role);
        Task<RoleResponse> DeleteAsync(int id);
    }
}