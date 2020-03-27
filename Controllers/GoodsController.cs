using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Shop.API.Domain.Model;
using Shop.API.Domain.Services;
using Shop.API.Extensions;
using Shop.API.Resources;

namespace Shop.API.Controllers
{
    [Route ("api/goods")]
    public class GoodsController : Controller
    {
        private readonly IGoodService goodService;
        private readonly IMapper mapper;
        public GoodsController(IGoodService goodService, IMapper mapper)
        {
            this.goodService = goodService;
            this.mapper = mapper;
        }

        [HttpGet]
        public async Task<IEnumerable<GoodResource>> GetAllAsync() 
        {
            var goods = await goodService.ListAsync();
            var resource = mapper.Map<IEnumerable<Good>,IEnumerable<GoodResource>>(goods);
            return resource;
        }

        [HttpPost]
        public async Task<IActionResult> PostAsync([FromBody] SaveGoodResource resource)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState.GetErrorMessages());

            var good = mapper.Map<SaveGoodResource, Good>(resource);
            var result = await goodService.SaveAsync(good);

            if (!result.Success)
                return BadRequest(result.Message);
            
            var goodResource = mapper.Map<Good, GoodResource>(result.Good);
            return Ok(goodResource);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutAsync(int id, [FromBody] SaveGoodResource resource)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState.GetErrorMessages());

            var good = mapper.Map<SaveGoodResource, Good>(resource);
            var result = await goodService.UpdateAsync(id, good);

            if (!result.Success)
                return BadRequest(result.Message);
            
            var goodResource = mapper.Map<Good, GoodResource>(result.Good);
            return Ok(goodResource);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAsync(int id)
        {
            var result = await goodService.DeleteAsync(id);
            if (!result.Success)
                return BadRequest(result.Message);
            
            var goodResource = mapper.Map<Good, GoodResource>(result.Good);
            return Ok(goodResource);
        }
    }
}