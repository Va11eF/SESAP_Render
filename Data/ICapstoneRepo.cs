using CapstoneController.Models;

namespace CapstoneController.Data{
    public interface ICapstoneRepo{
        Task SaveChanges();
    
        Task<IEnumerable<Interviews>> GetAllInterviews();

        Task CreateInterview(Interviews interviews);

        Task<Interviews?> GetInterviewById(int id);

        void DeleteInterview(Interviews interviews);

        Task<IEnumerable<WhitelistedUsers>> GetAllWhitelistedUsers();

    }
}