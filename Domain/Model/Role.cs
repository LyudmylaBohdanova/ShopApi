using System.Collections.Generic;

namespace Shop.API.Domain.Model
{
    public class Role
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public IList<UserRole> UserRoles {get;set;} = new List<UserRole>();
    }
}