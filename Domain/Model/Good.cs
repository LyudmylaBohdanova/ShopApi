namespace Shop.API.Domain.Model
{
    public class Good
    {
        public int Id { get; set; }
        public string GoodName { get; set; }
        public int GoodCount { get; set; }
        public double Price { get; set; }
        public int CategoryId { get; set; }
        
        public Category Category { get; set; }
    }
}