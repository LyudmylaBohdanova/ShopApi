using System.ComponentModel.DataAnnotations;

namespace Shop.API.Resources
{
    public class SaveUserResource
    {
        [Required]
        [MaxLength(30)]
        public string Firstname { get; set; }

        [Required]
        [MaxLength(30)]
        public string Lastname { get; set; }

        [Required]
        [MaxLength(20)]
        public string Login { get; set; }

        [Required]
        [MaxLength(20)]
        public string Password { get; set; }
    }
}