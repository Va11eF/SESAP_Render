/*
**    InterviewDto.cs

*     Holds the properties needed for an interview. Comes in the form of a request body sent by a user
*     All the proeprties are the same as the model, just no ID attribute
*/

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