using CapstoneController.Data;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
namespace CapstoneController.Dtos{
    public class InterviewDto{

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
        public string? interviewEmbedLink {get; set;}

        [Required]
        public string? interviewTranscript {get; set;}

    }
}