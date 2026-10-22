using System.ComponentModel.DataAnnotations;
using Atlas.Api.Entity;

namespace Atlas.Api.Application.JobApplication.DTOs;

public class UpdateJobApplicationRequest
{
    [Required]
    [MaxLength(200)]
    public required string CompanyName { get; set; }

    [Required]
    [MaxLength(2048)]
    [Url]
    public required string JobUrl { get; set; }

    [Required]
    [EnumDataType(typeof(ApplicationStatus))]
    public ApplicationStatus Status { get; set; }

    [Range(1, int.MaxValue)]
    public int? RoundNumber { get; set; }

    [Range(1, int.MaxValue)]
    public int? TotalRounds { get; set; }
}
