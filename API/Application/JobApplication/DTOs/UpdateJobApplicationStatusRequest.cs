using System.ComponentModel.DataAnnotations;
using Atlas.Api.Entity;

namespace Atlas.Api.Application.JobApplication.DTOs;

public class UpdateJobApplicationStatusRequest
{
    [Required]
    [EnumDataType(typeof(ApplicationStatus))]
    public ApplicationStatus Status { get; set; }

    [Range(1, int.MaxValue)]
    public int? RoundNumber { get; set; }

    [Range(1, int.MaxValue)]
    public int? TotalRounds { get; set; }
}
