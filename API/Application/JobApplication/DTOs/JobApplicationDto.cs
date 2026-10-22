using Atlas.Api.Entity;

namespace Atlas.Api.Application.JobApplication.DTOs;

public class JobApplicationDto
{
    public int Id { get; set; }

    public required string CompanyName { get; set; }

    public required string JobUrl { get; set; }

    public ApplicationStatus Status { get; set; }

    public int? RoundNumber { get; set; }

    public int? TotalRounds { get; set; }

    public DateTime CreationTime { get; set; }
}
