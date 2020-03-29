using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace Shop.API.Resources
{
    public class UpdateGoodResource
    {
        [MaxLength(50)]
        public string GoodName {get; set;}

        [DefaultValueAttribute(0)]
        [Range(0, int.MaxValue)]
        public int GoodCount {get; set;}

        [Range(0.01, double.MaxValue)]
        public double Price {get; set;}
        
        public int CategoryId {get; set;}
    }
}