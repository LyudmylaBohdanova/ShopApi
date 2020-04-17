using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Shop.API.Domain.Model;
using Shop.API.Domain.Repositories;
using Shop.API.Domain.Services;
using Shop.API.Domain.Services.Communication;

namespace Shop.API.Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository userRepository;
        private readonly IUnitOfWork unitOfWork;
        public UserService(IUserRepository userRepository, IUnitOfWork unitOfWork)
        {
            this.userRepository = userRepository;
            this.unitOfWork = unitOfWork;
        }

        public async Task<UserResponse> DeleteAsync(int id)
        {
            var existingUser = await userRepository.FindByIdAsync(id);
            if (existingUser == null)
                return new UserResponse("User not found");
            try
            {
                userRepository.Remove(existingUser);
                await unitOfWork.CompleteAsync();

                return new UserResponse(existingUser);
            }
            catch (Exception ex)
            {
                return new UserResponse($"Error when deleting user: {ex.Message}");
            }
        }

        public async Task<IEnumerable<User>> ListAsync()
        {
            return await userRepository.ListAsync();
        }

        public async Task<UserResponse> SaveAsync(User user)
        {
            try
            {
                await userRepository.AddAsync(user);
                await unitOfWork.CompleteAsync();

                return new UserResponse(user);
            }
            catch (Exception ex)
            {
                return new UserResponse($"Error when saving the user: {ex.Message}");
            }
        }

        public async Task<UserResponse> UpdateAsync(int id, User user)
        {
            var existingUser = await userRepository.FindByIdAsync(id);
            if (existingUser == null)
                return new UserResponse("User not found");
            
            existingUser.Firstname = user.Firstname;
            existingUser.Lastname = user.Lastname;

            try
            {
                userRepository.Update(existingUser);
                await unitOfWork.CompleteAsync();

                return new UserResponse(existingUser);
            }
            catch (Exception ex)
            {
                return new UserResponse($"Error when updating user: {ex.Message}");
            }
        }
    }
}