using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Shop.API.Domain.Model;
using Shop.API.Domain.Services;
using Shop.API.Resources;

namespace Shop.API.Controllers
{
    [Authorize]
    [Route("/api/[controller]")]
    public class UserRolesController : Controller
    {
        private readonly IMapper mapper;
        private readonly IUserRoleService userRoleService;
        public UserRolesController(IMapper mapper, IUserRoleService userRoleService)
        {
            this.mapper = mapper;
            this.userRoleService = userRoleService;
        }

        [Authorize(Roles="lexus_driver, corolla_driver")]
        [HttpGet("{id}")]
        public async Task<ResponseData> ListUsersByRoleAsync(int id) 
        {
            var users = await userRoleService.ListUsersByRoleAsync(id);
            var userResource = mapper.Map<IEnumerable<User>, IEnumerable<UserResource>>(users);
            var result = new ResponseData
            {
                Data = userResource,
                Success = true,
                Message = ""
            };
            return result;
        }

        [Authorize(Roles="lexus_driver")]
        [HttpPost]
        public async Task<ResponseData> SetUserRole([FromBody] SaveUserRoleResource resource)
        {
            var userResponse = await userRoleService.SetRole(resource.UserId, resource.RoleId);
            var userResource = mapper.Map<User, UserResource>(userResponse.User);
            var result = new ResponseData
            {
                Success = true,
                Message = "",
                Data = userResource
            };
            return result;
        }

        [Authorize(Roles="lexus_driver")]
        [HttpDelete]
        public async Task<ResponseData> DeleteUserRole([FromBody] SaveUserRoleResource resource)
        {
            var userResponse = await userRoleService.DeleteRole(resource.UserId, resource.RoleId);
            var userResource = mapper.Map<User, UserResource>(userResponse.User);
            var result = new ResponseData
            {
                Success = true,
                Message = "",
                Data = userResource
            };
            return result;
        }
    }
}