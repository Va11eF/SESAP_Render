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