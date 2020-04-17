using System.Collections.Generic;
using System.Globalization;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Shop.API.Domain.Model;
using Shop.API.Domain.Services;
using Shop.API.Extensions;
using Shop.API.Resources;

namespace Shop.API.Controllers
{
    [Authorize]
    [Route("/api/[controller]")]
    public class RolesController : Controller
    {
        private readonly IRoleService service;
        private readonly IMapper mapper;

        public RolesController(IRoleService service, IMapper mapper)
        {
            this.service = service;
            this.mapper = mapper;
        }

        [Authorize(Roles="lexus_driver, corolla_driver")]
        [HttpGet]
        public async Task<ResponseData> GetAllAsync()
        {
            var roles = await service.ListAsync();
            var resource = mapper.Map<IEnumerable<Role>, IEnumerable<RoleResource>>(roles);
            var result = new ResponseData
            {
                Data = resource,
                Message = "",
                Success = true
            };
            return result;
        }

        [Authorize(Roles="lexus_driver")]
        [HttpPost]
        public async Task<IActionResult> PostAsync([FromBody] SaveRoleResource resource)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState.GetErrorMessages());

            var role = mapper.Map<SaveRoleResource, Role>(resource);
            var roleResponse = await service.SaveAsync(role);
            var roleResourse = mapper.Map<Role, RoleResource>(roleResponse.Role);
            var result = new ResponseData
            {
                Data = roleResourse,
                Message = roleResponse.Message,
                Success = roleResponse.Success
            };
            return Ok(result);
        }

        [Authorize(Roles="lexus_driver")]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutAsync(int id, [FromBody] SaveRoleResource resource)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState.GetErrorMessages());

            var role = mapper.Map<SaveRoleResource, Role>(resource);
            var roleResponse = await service.UpdateAsync(id, role);
            var roleResource = mapper.Map<Role, RoleResource>(roleResponse.Role);
            var result = new ResponseData
            {
                Data = roleResource,
                Success = roleResponse.Success,
                Message = roleResponse.Message
            };
            return Ok(result);
        }
        
        [Authorize(Roles="lexus_driver")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAsync(int id)
        {
            var roleResponse = await service.DeleteAsync(id);
            var roleResource = mapper.Map<Role, RoleResource>(roleResponse.Role);
            var result = new ResponseData
            {
                Data = roleResource,
                Success = roleResponse.Success,
                Message = roleResponse.Message
            };
            return Ok(result);
        }
    }
}