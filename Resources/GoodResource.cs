namespace Shop.API.Resources
{
    public class GoodResource
    {
        public int Id { get; set; }
        public string GoodName { get; set; }
        public int GoodCount { get; set; }
        public double Price { get; set; }
        public int CategoryId { get; set; }
        public string CategoryName { get; set; }
    }
}