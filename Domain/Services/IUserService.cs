using System.Collections.Generic;
using System.Threading.Tasks;
using Shop.API.Domain.Model;
using Shop.API.Domain.Services.Communication;

namespace Shop.API.Domain.Services
{
    public interface IUserService
    {
        Task<IEnumerable<User>> ListAsync();
        Task<UserResponse> SaveAsync(User user);
        Task<UserResponse> UpdateAsync(int id, User user);
        Task<UserResponse> DeleteAsync(int id);
    }
}