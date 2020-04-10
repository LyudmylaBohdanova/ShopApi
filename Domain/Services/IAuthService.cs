using System.Threading.Tasks;
using Shop.API.Domain.Model;

namespace Shop.API.Domain.Services
{
    public interface IAuthService
    {
        Task<User> Authenticate(string login, string password);
    }
}