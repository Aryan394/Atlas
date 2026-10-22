using System.ComponentModel.DataAnnotations;
using Atlas.Api.Helpers;

namespace Atlas.Api.Application.JobApplication.DTOs;

public class GetJobApplicationsRequest : PaginationParameters
{
    [MaxLength(200)]
    public string? CompanyName { get; set; }
}
