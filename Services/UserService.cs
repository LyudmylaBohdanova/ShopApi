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
    public class UserService : IUserService
    {
        private readonly IUserRepository repository;
        private readonly AppSettings appSettings;

        public UserService(IOptions<AppSettings> appSettings, IUserRepository repository)
        {
            this.repository = repository;
            this.appSettings = appSettings.Value;
        }

        public async Task<User> Authenticate(string login, string password)
        {
            var user = (await repository.ListAsync())
                                .SingleOrDefault(usr => usr.Login == login &&
                                                        usr.Password == password);  
            if (user == null)
                return null;

            user.GenerateToken(appSettings.Secret, appSettings.ExpiresMinutes);

            return user;
        }
    }
}