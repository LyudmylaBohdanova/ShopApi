using Microsoft.AspNetCore.Mvc;
using Microsoft.VisualBasic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace Shop.API.Resources
{
    public class SaveGoodResource
    {
        [Required]
        [MaxLength(50)]
        public string GoodName {get; set;}

        [Required]
        [DefaultValueAttribute(0)]
        [Range(0, int.MaxValue)]
        public int GoodCount {get; set;}

        [Required]
        [Range(0.01, double.MaxValue)]
        public decimal Price {get; set;}
        
        public string CategoryName {get; set;}
    }
}