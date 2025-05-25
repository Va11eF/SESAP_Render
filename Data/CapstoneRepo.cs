using Microsoft.EntityFrameworkCore;
using CapstoneController.Models;

namespace CapstoneController.Data{
    public class CapstoneRepo: ICapstoneRepo{

        private readonly AppDbContext _context;

        public CapstoneRepo(AppDbContext context){
            _context = context;
        }

        public async Task SaveChanges(){
            await _context.SaveChangesAsync();
        }

        public async Task<IEnumerable<Interviews>> GetAllInterviews(){
            return await _context.Interviews.ToListAsync();
        }

        public async Task CreateInterview(Interviews interviews){
            if (interviews == null){
                throw new ArgumentNullException(nameof(interviews));
            }

            await _context.Interviews.AddAsync(interviews);
        }

        public async Task<Interviews?> GetInterviewById(int id){
            return await _context.Interviews.FirstOrDefaultAsync(c => c.interviewId == id);
        }

        public void DeleteInterview(Interviews interviews){
            if(interviews == null){
                throw new ArgumentNullException(nameof(interviews));
            }

            _context.Interviews.Remove(interviews);
        }

        public async Task<IEnumerable<WhitelistedUsers>> GetAllWhitelistedUsers(){
            return await _context.WhitelistedUsers.ToListAsync();
        }

    }
}