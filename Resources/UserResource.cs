namespace Shop.API.Resources
{
    public class UserResource
    {
        public int Id {get;set;}
        public string Firstname { get; set; }
        public string Lastname { get; set; }
        public string Login { get; set; }
        public string Token { get; set; }
        public string[] Role { get; set; }
    }
}