/*
**   WhitelistedUsersDto.cs

*    Holds the email of a whitelisted user sent from the frontend
*    Same as the model, with the ID property
*/

using CapstoneController.Data;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
namespace CapstoneController.Dtos{
    public class WhitelistedUsersDto{

        [Required]
        public string? email {get; set;}

    }
}