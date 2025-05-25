using AutoMapper;
using CapstoneController.Dtos;
using CapstoneController.Models;

namespace CapstoneController.Profiles{
    public class CapstoneProfile: Profile{
        public CapstoneProfile(){
            // Source -> Target
            CreateMap<InterviewDto, Interviews>();
            CreateMap<Interviews, InterviewDto>();

            CreateMap<WhitelistedUsersDto, WhitelistedUsers>();
            CreateMap<WhitelistedUsers, WhitelistedUsersDto>();

        }
    }
}