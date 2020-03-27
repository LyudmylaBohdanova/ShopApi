using System.Collections.Generic;
using System.Threading.Tasks;
using Shop.API.Domain.Model;
using Shop.API.Domain.Services.Communication;

namespace Shop.API.Domain.Services
{
    public interface IGoodService
    {
        Task<IEnumerable<Good>> ListAsync();
        Task<GoodResponse> SaveAsync(Good good);
        Task<GoodResponse> UpdateAsync(int id, Good good);
        Task<GoodResponse> DeleteAsync(int id);
    }
}