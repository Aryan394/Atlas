using Atlas.Api.Application.JobApplication.DTOs;
using Atlas.Api.Helpers;

namespace Atlas.Api.Application.JobApplication;

public interface IJobApplicationRepository
{
    Task<PaginatedResponse<JobApplicationDto>> GetAllAsync(GetJobApplicationsRequest request);

    Task<JobApplicationDto?> GetByIdAsync(int id);

    Task<JobApplicationDto> CreateAsync(CreateJobApplicationRequest request);

    Task<JobApplicationDto?> UpdateAsync(int id, UpdateJobApplicationRequest request);

    Task<JobApplicationDto?> UpdateStatusAsync(int id, UpdateJobApplicationStatusRequest request);

    Task<bool> DeleteAsync(int id);
}
