using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Options;
using Shop.API.Domain.Model;
using Shop.API.Domain.Repositories;
using Shop.API.Domain.Services;
using Shop.API.Extensions;
using Shop.API.Helpers;

namespace Shop.API.Services
{
    public class AuthService : IAuthService
    {

        private readonly AppSettings appSettings;
        private readonly IUserRepository userRepository;
        public AuthService(IOptions<AppSettings> appSettings, IUserRepository userRepository)
        {
            this.appSettings = appSettings.Value;
            this.userRepository = userRepository;
        }
        public async Task<User> Authenticate(string login, string password)
        {
            var user = (await userRepository.ListAsync())
                                .SingleOrDefault(usr => usr.Login == login &&
                                                        usr.Password == password);  
            if (user == null)
                return null;

            user.GenerateToken(appSettings.Secret, appSettings.ExpiresMinutes);

            return user;
        }
    }
}