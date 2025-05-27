/*
**    WhitelistedUsers.cs

*     This file holds all of the properties needed for a whitelisted user (Id and email)
*     A whitelisted user has permissions to post and delete interviews 
*/

using CapstoneController.Data;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
namespace CapstoneController.Models{
    public class WhitelistedUsers{
        [Key]
        public int whitelistedUsersId {get; set;}

        [Required]
        public string? email {get; set;}

    }
}