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
    public class CategoriesController : Controller
    {
        private readonly ICategoryService categoryService;
        private readonly IMapper mapper;
        public CategoriesController(ICategoryService categoryService, IMapper mapper)
        {
            this.categoryService = categoryService;
            this.mapper = mapper;
        }

        [Authorize(Roles="lexus_driver, corolla_driver")]
        [HttpGet]
        public async Task<ResponseData> GetAllAsync() 
        {
            var categories = await categoryService.ListAsync();
            var resource = mapper.Map<IEnumerable<Category>,IEnumerable<CategoryResource>>(categories);
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
        public async Task<IActionResult> PostAsync([FromBody] SaveCategoryResource resource)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState.GetErrorMessages());

            var category = mapper.Map<SaveCategoryResource, Category>(resource);
            var categoryResponse = await categoryService.SaveAsync(category);  
            var categoryResource = mapper.Map<Category, CategoryResource>(categoryResponse.Category);
            var result = new ResponseData
            {
                Data = categoryResource,
                Message = categoryResponse.Message,
                Success = categoryResponse.Success
            };
            return Ok(result);
        }

        [Authorize(Roles="lexus_driver")]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutAsync(int id, [FromBody] SaveCategoryResource resource)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState.GetErrorMessages());

            var category = mapper.Map<SaveCategoryResource, Category>(resource);
            var categoryResponse = await categoryService.UpdateAsync(id, category);  
            var categoryResource = mapper.Map<Category, CategoryResource>(categoryResponse.Category);
            var result = new ResponseData
            {
                Data = categoryResource,
                Message = categoryResponse.Message,
                Success = categoryResponse.Success
            };
            return Ok(result);
        }

        [Authorize(Roles="lexus_driver")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAsync(int id)
        {
            var categoryResponse = await categoryService.DeleteAsync(id);
            var categoryResource = mapper.Map<Category, CategoryResource>(categoryResponse.Category);
            var result = new ResponseData
            {
                Data = categoryResource,
                Message = categoryResponse.Message,
                Success = categoryResponse.Success
            };
            return Ok(result);
        }
    }
}