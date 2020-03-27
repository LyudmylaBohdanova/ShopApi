using System.Collections.Generic;
using System.Threading.Tasks;
using Shop.API.Domain.Model;

namespace Shop.API.Domain.Repositories
{
    public interface ICategoryRepository
    {
        Task<IEnumerable<Category>> ListAsync();
        Task AddAsync(Category category);
        void Update(Category category);
        Task<Category> FindByIdAsync(int id);
        void Remove(Category category);
    }
}