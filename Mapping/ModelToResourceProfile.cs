using System.Runtime.CompilerServices;
using System.Linq;
using AutoMapper;
using Shop.API.Domain.Model;
using Shop.API.Resources;

namespace Shop.API.Mapping
{
    public class ModelToResourceProfile : Profile
    {
        public ModelToResourceProfile()
        {
            CreateMap<Category, CategoryResource>();
            CreateMap<Good, GoodResource>();
            CreateMap<User, UserResource>()
                .ForMember(dest => dest.Role, src => src.MapFrom(x => x.UserRoles
                            .Select(y => y.Role.Name)));
            CreateMap<Role, RoleResource>();
        }
    }
}