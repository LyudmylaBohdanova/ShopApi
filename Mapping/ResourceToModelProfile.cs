using AutoMapper;
using Shop.API.Domain.Model;
using Shop.API.Resources;

namespace Shop.API.Mapping
{
    public class ResourceToModelProfile : Profile
    {
        public ResourceToModelProfile()
        {
            CreateMap<SaveCategoryResource, Category>();
            CreateMap<SaveGoodResource, Good>();
        }
    }
}