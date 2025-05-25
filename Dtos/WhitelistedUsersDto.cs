using CapstoneController.Data;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
namespace CapstoneController.Dtos{
    public class WhitelistedUsersDto{

        [Required]
        public string? email {get; set;}

    }
}