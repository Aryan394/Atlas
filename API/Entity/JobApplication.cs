namespace Atlas.Api.Entity;

public class JobApplication : BaseEntity
{
    public required string CompanyName { get; set; }

    public required string JobUrl { get; set; }

    public ApplicationStatus Status { get; set; }

    public int? RoundNumber { get; set; }

    public int? TotalRounds { get; set; }
}
