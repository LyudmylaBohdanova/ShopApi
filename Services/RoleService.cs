using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Shop.API.Domain.Model;
using Shop.API.Domain.Repositories;
using Shop.API.Domain.Services;
using Shop.API.Domain.Services.Communication;

namespace Shop.API.Services
{
    public class RoleService : IRoleService
    {
        private readonly IRoleRepository repository;
        private readonly IUnitOfWork unit;

        public RoleService(IRoleRepository repository, IUnitOfWork unit)
        {
            this.repository = repository;
            this.unit = unit;
        }
        public async Task<RoleResponse> DeleteAsync(int id)
        {
            var role = await repository.FindByIdAsync(id);
            if(role == null)
                return new RoleResponse("Role not found");
            
            try
            {
                repository.Remove(role);
                await unit.CompleteAsync();

                return new RoleResponse(role);
            }
            catch (Exception ex)
            {
                return new RoleResponse($"Error when deleting role: {ex.Message}");
            }
        }

        public async Task<IEnumerable<Role>> ListAsync()
        {
            return await repository.ListAsync();
        }

        public async Task<RoleResponse> SaveAsync(Role role)
        {
            try
            {
                await repository.AddAsync(role);
                await unit.CompleteAsync();

                return new RoleResponse(role);
            }
            catch (Exception ex)
            {
                return new RoleResponse($"Error when saving role: {ex.Message}");
            }
        }

        public async Task<RoleResponse> UpdateAsync(int id, Role role)
        {
            var findRole = await repository.FindByIdAsync(id);
            if(findRole == null)
                return new RoleResponse("Role not found");
            
            findRole.Name = role.Name;

            try
            {
                repository.Update(findRole);
                await unit.CompleteAsync();

                return new RoleResponse(findRole);
            }
            catch (Exception ex)
            {
                return new RoleResponse($"Error when updating role: {ex.Message}");
            }
        }
    }
}