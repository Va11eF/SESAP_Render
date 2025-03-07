using CapstoneController.Data;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
namespace CapstoneController.Models{
    public class Interviews{
        [Key]
        public int interviewId {get; set;}

        [Required]
        public string? intervieweeName {get; set;}

        [Required]
        public string? interviewerName {get; set;}

        [Required]
        [JsonConverter(typeof(DateOnlyConverter))]
        public DateOnly? interviewDate {get; set;}

        [Required]
        public string? interviewDesc {get; set;}

        [Required]
        public string? transcriptText {get; set;}
    }
}