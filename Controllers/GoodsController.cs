using System.Collections.Generic;
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
    [Route ("/api/[controller]")]
    public class GoodsController : Controller
    {
        private readonly IGoodService goodService;
        private readonly IMapper mapper;
        public GoodsController(IGoodService goodService, IMapper mapper)
        {
            this.goodService = goodService;
            this.mapper = mapper;
        }

        [Authorize(Roles="lexus_driver, corolla_driver")]
        [HttpGet]
        public async Task<ResponseData> GetAllAsync() 
        {
            var goods = await goodService.ListAsync();
            var resource = mapper.Map<IEnumerable<Good>,IEnumerable<GoodResource>>(goods);
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
        public async Task<IActionResult> PostAsync([FromBody] SaveGoodResource resource)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState.GetErrorMessages());

            var good = mapper.Map<SaveGoodResource, Good>(resource);
            var goodResponse = await goodService.SaveAsync(good);
            var goodResource = mapper.Map<Good, GoodResource>(goodResponse.Good);
            var result = new ResponseData
            {
                Data = goodResource,
                Message = goodResponse.Message,
                Success = goodResponse.Success
            };
            return Ok(result);
        }

        [Authorize(Roles="lexus_driver")]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutAsync(int id, [FromBody] SaveGoodResource resource)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState.GetErrorMessages());

            var good = mapper.Map<SaveGoodResource, Good>(resource);
            var goodResponse = await goodService.UpdateAsync(id, good);
            var goodResource = mapper.Map<Good, GoodResource>(goodResponse.Good);
            var result = new ResponseData
            {
                Data = goodResource,
                Success = goodResponse.Success,
                Message = goodResponse.Message
            };
            return Ok(result);
        }

        [Authorize(Roles="lexus_driver")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAsync(int id)
        {
            var goodResponse = await goodService.DeleteAsync(id);
            var goodResource = mapper.Map<Good, GoodResource>(goodResponse.Good);
            var result = new ResponseData
            {
                Data = goodResource,
                Success = goodResponse.Success,
                Message = goodResponse.Message
            };
            return Ok(result);
        }
    }
}