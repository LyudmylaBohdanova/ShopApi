using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Shop.API.Domain.Model;
using Shop.API.Domain.Repositories;
using Shop.API.Domain.Services;
using Shop.API.Domain.Services.Communication;

namespace Shop.API.Services
{
    public class UserRoleService : IUserRoleService
    {
        private readonly IUserRepository userRepository;
        private readonly IUnitOfWork unitOfWork;
        public UserRoleService(IUserRepository userRepository, IUnitOfWork unitOfWork)
        {
            this.userRepository = userRepository;
            this.unitOfWork = unitOfWork;
        }

        public async Task<UserResponse> DeleteRole(int userId, int roleId)
        {
            try
            {
                var user = await userRepository.FindByIdAsync(userId);
                user.UserRoles.Remove(user.UserRoles.FirstOrDefault(x => x.RoleId == roleId));
                await unitOfWork.CompleteAsync();
                user = await userRepository.FindByIdAsync(userId);
                return new UserResponse(user);
            }
            catch (Exception ex)
            {
                return new UserResponse($"Error when deleting role: {ex.Message}");
            }
        }

        public async Task<IEnumerable<User>> ListUsersByRoleAsync(int roleId)
        {
            var users = await userRepository.ListAsync();
            var usersInRole = users.Where(x => x.UserRoles.Contains(x.UserRoles.SingleOrDefault(y => y.RoleId == roleId)));
            return usersInRole;

        }

        public async Task<UserResponse> SetRole(int userId, int roleId)
        {
            try
            {
                var user = await userRepository.FindByIdAsync(userId);
                user.UserRoles.Add(new UserRole { UserId = userId, RoleId = roleId });
                await unitOfWork.CompleteAsync();
                user = await userRepository.FindByIdAsync(userId);
                return new UserResponse(user);
            }
            catch (Exception ex)
            {
                return new UserResponse($"Error when setting role: {ex.Message}");
            }

        }
    }
}