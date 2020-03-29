using Microsoft.EntityFrameworkCore;
using Shop.API.Domain.Model;

namespace Shop.API.Persistence.Context
{
    public class AppDbContext : DbContext
    {
        public DbSet<Category> Categories { get; set; }
        public DbSet<Good> Goods { get; set; }
        public DbSet<User> Users {get; set;}
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<Category>().ToTable("Categories");
            builder.Entity<Category>().HasKey(x => x.Id);
            builder.Entity<Category>().Property(x => x.Id).IsRequired().ValueGeneratedOnAdd();
            builder.Entity<Category>().Property(x => x.Name).IsRequired().HasMaxLength(50);

            builder.Entity<Category>().HasData
            (
                new Category { Id = 100, Name = "Notebook"},
                new Category { Id = 101, Name = "Smartphone"}
            );

            builder.Entity<Good>().ToTable("Goods");
            builder.Entity<Good>().HasKey(x => x.Id);
            builder.Entity<Good>().Property(x => x.Id).IsRequired().ValueGeneratedOnAdd();
            builder.Entity<Good>().Property(x => x.GoodName).IsRequired().HasMaxLength(50);
            builder.Entity<Good>().Property(x => x.GoodCount).IsRequired().HasDefaultValue(0);
            builder.Entity<Good>().Property(x => x.Price).IsRequired();
            builder.Entity<Good>().Property(x => x.CategoryId);

            builder.Entity<Good>().HasData
            (
                new Good {Id = 200, GoodName = "Asus Transformer Book T100TAF 32GB", GoodCount = 5, Price = 4999.00, CategoryId = 100},
                new Good {Id = 201, GoodName = "Samsung Galaxy S3 Neo Duos I9300i Black", GoodCount = 7, Price = 3999.00, CategoryId = 101},
                new Good {Id = 202, GoodName = "Lenovo A5000 Black", GoodCount = 5, Price = 3299.00, CategoryId = 101},
                new Good {Id = 203, GoodName = "HP 255 G4 (N0Y69ES)", GoodCount = 3, Price = 6199.00, CategoryId = 100}
            );

            builder.Entity<User>().ToTable("Users");
            builder.Entity<User>().HasKey(x => x.Id);
            builder.Entity<User>().Property(x => x.Id).IsRequired().ValueGeneratedOnAdd();
            builder.Entity<User>().Property(x => x.Firstname).IsRequired().HasMaxLength(30);
            builder.Entity<User>().Property(x => x.Lastname).IsRequired().HasMaxLength(30);
            builder.Entity<User>().Property(x => x.Login).IsRequired().HasMaxLength(30);
            builder.Entity<User>().HasAlternateKey(x => x.Login);
            builder.Entity<User>().Property(x => x.Password).IsRequired().HasMaxLength(30);

            builder.Entity<User>().HasData
            (
                new User{
                    Id = 777,
                    Firstname = "Людмила",
                    Lastname = "Богданова",
                    Login = "Corolla",
                    Password = "Corolla123",
                    Role = "corolla_driver" //user
                },
                new User{
                    Id = 666,
                    Firstname = "Дмитрий",
                    Lastname = "Чумак",
                    Login = "Lexus",
                    Password = "Lexus123",
                    Role = "lexus_driver" //maybe admin
                }
            );
        }
    }
}