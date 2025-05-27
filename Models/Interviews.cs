/*
**   Interviews.cs

*    This file holds all of the properties needed for a interview entry in the database 
*    Each interview will have an Id, interviewee name, interviewer name, interview date,
*    interview description, and embeded link from kaltura (provided by the user), and a transcript file
*/

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
        public string? interviewEmbedLink {get; set;}

        [Required]
        public string? interviewTranscript {get; set;}

    }
}