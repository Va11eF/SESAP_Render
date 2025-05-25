/*
**   CapstoneProfile.cs

*    Maps the interview and whitelistedusers models to the dtos and vice versa
*    Used for simple and convenient object mapping when interacting with the database
*    and providing data back to the frontend
*/

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