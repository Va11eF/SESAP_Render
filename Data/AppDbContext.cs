using Microsoft.EntityFrameworkCore;
using CapstoneController.Models;
using Microsoft.EntityFrameworkCore.Diagnostics;
namespace CapstoneController.Data{
    public class AppDbContext : DbContext{
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options){
            
        }

        public DbSet<Interviews> Interviews => Set<Interviews>();

        public DbSet<WhitelistedUsers> WhitelistedUsers => Set<WhitelistedUsers>();

    }
}