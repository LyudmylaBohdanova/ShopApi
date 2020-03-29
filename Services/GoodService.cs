using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Shop.API.Domain.Model;
using Shop.API.Domain.Repositories;
using Shop.API.Domain.Services;
using Shop.API.Domain.Services.Communication;

namespace Shop.API.Services
{
    public class GoodService : IGoodService
    {
        private readonly IGoodRepository goodRepository;
        private readonly IUnitOfWork unitOfWork;
        public GoodService(IGoodRepository goodRepository, IUnitOfWork unitOfWork)
        {
            this.goodRepository = goodRepository;
            this.unitOfWork = unitOfWork;
        }

        public async Task<GoodResponse> DeleteAsync(int id)
        {
            var existingGood = await goodRepository.FindByIdAsync(id);
            if (existingGood == null)
                return new GoodResponse("Good not found");
            try
            {
                goodRepository.Remove(existingGood);
                await unitOfWork.CompleteAsync();

                return new GoodResponse(existingGood);
            }
            catch (Exception ex)
            {
                return new GoodResponse($"Error when deleting good: {ex.Message}");
            }
        }

        public async Task<IEnumerable<Good>> ListAsync()
        {
            return await goodRepository.ListAsync();
        }

        public async Task<GoodResponse> SaveAsync(Good good)
        {
            try
            {
                await goodRepository.AddAsync(good);
                await unitOfWork.CompleteAsync();

                return new GoodResponse(good);
            }
            catch (Exception ex)
            {
                return new GoodResponse($"Error when saving the good: {ex.Message}");
            }
        }

        public async Task<GoodResponse> UpdateAsync(int id, Good good)
        {
            var existingGood = await goodRepository.FindByIdAsync(id);
            if (existingGood == null)
                return new GoodResponse("Good not found");
            
            if(good.GoodName != null) existingGood.GoodName = good.GoodName;
            existingGood.GoodCount = good.GoodCount;
            existingGood.Price = good.Price;
            existingGood.CategoryId = good.CategoryId;

            try
            {
                goodRepository.Update(existingGood);
                await unitOfWork.CompleteAsync();

                return new GoodResponse(existingGood);
            }
            catch (Exception ex)
            {
                return new GoodResponse($"Error when updating good: {ex.Message}");
            }
        }
    }
}