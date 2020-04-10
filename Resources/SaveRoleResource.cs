using System.ComponentModel.DataAnnotations;

namespace Shop.API.Resources
{
    public class SaveRoleResource
    {
        [Required]
        [MaxLength(30)]
        public string Name {get; set;}
    }
}