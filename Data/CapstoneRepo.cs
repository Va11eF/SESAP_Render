/*
**  CapstoneRepo.cs 

*   This file implements the repository interface depending on the endpoint that is hit
*/

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
        
        /* "api/v1/interviews" GET request */
        public async Task<IEnumerable<Interviews>> GetAllInterviews()
        {
            return await _context.Interviews.ToListAsync();
        }
        
        /* "api/v1/interviews POST request */
        public async Task CreateInterview(Interviews interviews)
        {
            if (interviews == null)
            {
                throw new ArgumentNullException(nameof(interviews));
            }

            await _context.Interviews.AddAsync(interviews);
        }

        /* "api/v1/interviews/{id}" DELETE request */
        public async Task<Interviews?> GetInterviewById(int id)
        {
            return await _context.Interviews.FirstOrDefaultAsync(c => c.interviewId == id);
        }
        
        /* "api/v1/interviews/{id}" DELETE request */
        public void DeleteInterview(Interviews interviews)
        {
            if (interviews == null)
            {
                throw new ArgumentNullException(nameof(interviews));
            }

            _context.Interviews.Remove(interviews);
        }
        
        /* "api/v1/whitelistedUsers" GET request */
        public async Task<IEnumerable<WhitelistedUsers>> GetAllWhitelistedUsers()
        {
            return await _context.WhitelistedUsers.ToListAsync();
        }

    }
}