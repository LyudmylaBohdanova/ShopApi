using System.Net;
using System.Collections.Generic;
using System.ComponentModel;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Shop.API.Domain.Model;
using Shop.API.Domain.Services;
using Shop.API.Extensions;
using Shop.API.Resources;
using Microsoft.AspNetCore.Authorization;

namespace Shop.API.Controllers
{
    [Authorize]
    [Route("/api/[controller]")]
    public class UsersController : Controller
    {
        private readonly IUserService userService;
        private readonly IMapper mapper;
        public UsersController(IUserService userService, IMapper mapper)
        {
            this.userService = userService;
            this.mapper = mapper;
        }

        [Authorize(Roles="lexus_driver, corolla_driver")]
        [HttpGet]
        public async Task<IEnumerable<UserResource>> GetAllAsync()
        {
            var users = await userService.ListAsync();
            var resource = mapper.Map<IEnumerable<User>, IEnumerable<UserResource>>(users);
            return resource;
        }

        [Authorize(Roles="lexus_driver")]
        [HttpPost]
        public async Task<IActionResult> PostAsync([FromBody] SaveUserResource resource)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState.GetErrorMessages());

            var user = mapper.Map<SaveUserResource, User>(resource);
            var result = await userService.SaveAsync(user);

            if (!result.Success)
                return BadRequest(result.Message);

            var userResource = mapper.Map<User, UserResource>(result.User);
            return Ok(userResource);
        }

        [Authorize(Roles="lexus_driver")]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutAsync(int id, [FromBody] SaveUserResource resource)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState.GetErrorMessages());

            var user = mapper.Map<SaveUserResource, User>(resource);
            var result = await userService.UpdateAsync(id, user);

            if (!result.Success)
                return BadRequest(result.Message);

            var userResource = mapper.Map<User, UserResource>(result.User);
            return Ok(userResource);
        }

        [Authorize(Roles="lexus_driver")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAsync(int id)
        {
            var result = await userService.DeleteAsync(id);
            if (!result.Success)
                return BadRequest(result.Message);

            var userResource = mapper.Map<User, UserResource>(result.User);
            return Ok(userResource);
        }
    }
}