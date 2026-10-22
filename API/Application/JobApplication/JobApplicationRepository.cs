using Microsoft.EntityFrameworkCore;
using Atlas.Api.Application.JobApplication.DTOs;
using Atlas.Api.Entity;
using Atlas.Api.Helpers;
using Atlas.Api.Infrastructure.Data;
using JobApplicationEntity = Atlas.Api.Entity.JobApplication;

namespace Atlas.Api.Application.JobApplication;

public class JobApplicationRepository : IJobApplicationRepository
{
    private readonly AppDbContext _dbContext;

    public JobApplicationRepository(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<PaginatedResponse<JobApplicationDto>> GetAllAsync(GetJobApplicationsRequest request)
    {
        var query = _dbContext.JobApplications.AsNoTracking();

        if (!string.IsNullOrWhiteSpace(request.CompanyName))
        {
            var companyName = request.CompanyName.Trim();
            query = query.Where(j => EF.Functions.ILike(j.CompanyName, $"%{companyName}%"));
        }

        var orderedQuery = query
            .OrderByDescending(j => j.CreationTime)
            .ThenByDescending(j => j.Id)
            .Select(j => new JobApplicationDto
            {
                Id = j.Id,
                CompanyName = j.CompanyName,
                JobUrl = j.JobUrl,
                Status = j.Status,
                RoundNumber = j.RoundNumber,
                TotalRounds = j.TotalRounds,
                CreationTime = j.CreationTime
            });

        return await PaginationHelper.PaginateAsync(orderedQuery, request.Page, request.PageSize);
    }

    public async Task<JobApplicationDto?> GetByIdAsync(int id)
    {
        var jobApplication = await _dbContext.JobApplications
            .AsNoTracking()
            .FirstOrDefaultAsync(j => j.Id == id);

        return jobApplication is null ? null : ToDto(jobApplication);
    }

    public async Task<JobApplicationDto> CreateAsync(CreateJobApplicationRequest request)
    {
        var (roundNumber, totalRounds) = NormalizeRoundFields(request.Status, request.RoundNumber, request.TotalRounds);

        var jobApplication = new JobApplicationEntity
        {
            CompanyName = request.CompanyName,
            JobUrl = request.JobUrl,
            Status = request.Status,
            RoundNumber = roundNumber,
            TotalRounds = totalRounds
        };

        _dbContext.JobApplications.Add(jobApplication);
        await _dbContext.SaveChangesAsync();

        return ToDto(jobApplication);
    }

    public async Task<JobApplicationDto?> UpdateAsync(int id, UpdateJobApplicationRequest request)
    {
        var jobApplication = await _dbContext.JobApplications.FirstOrDefaultAsync(j => j.Id == id);
        if (jobApplication is null)
        {
            return null;
        }

        var (roundNumber, totalRounds) = NormalizeRoundFields(request.Status, request.RoundNumber, request.TotalRounds);

        jobApplication.CompanyName = request.CompanyName;
        jobApplication.JobUrl = request.JobUrl;
        jobApplication.Status = request.Status;
        jobApplication.RoundNumber = roundNumber;
        jobApplication.TotalRounds = totalRounds;

        await _dbContext.SaveChangesAsync();

        return ToDto(jobApplication);
    }

    public async Task<JobApplicationDto?> UpdateStatusAsync(int id, UpdateJobApplicationStatusRequest request)
    {
        var jobApplication = await _dbContext.JobApplications.FirstOrDefaultAsync(j => j.Id == id);
        if (jobApplication is null)
        {
            return null;
        }

        var (roundNumber, totalRounds) = NormalizeRoundFields(request.Status, request.RoundNumber, request.TotalRounds);

        jobApplication.Status = request.Status;
        jobApplication.RoundNumber = roundNumber;
        jobApplication.TotalRounds = totalRounds;

        await _dbContext.SaveChangesAsync();

        return ToDto(jobApplication);
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var jobApplication = await _dbContext.JobApplications.FirstOrDefaultAsync(j => j.Id == id);
        if (jobApplication is null)
        {
            return false;
        }

        jobApplication.IsDeleted = true;
        jobApplication.DeletionTime = DateTime.UtcNow;

        await _dbContext.SaveChangesAsync();

        return true;
    }

    private static (int? RoundNumber, int? TotalRounds) NormalizeRoundFields(
        ApplicationStatus status,
        int? roundNumber,
        int? totalRounds)
    {
        if (status != ApplicationStatus.ShortlistedForInterview)
        {
            return (null, null);
        }

        return (roundNumber, totalRounds);
    }

    private static JobApplicationDto ToDto(JobApplicationEntity jobApplication) => new()
    {
        Id = jobApplication.Id,
        CompanyName = jobApplication.CompanyName,
        JobUrl = jobApplication.JobUrl,
        Status = jobApplication.Status,
        RoundNumber = jobApplication.RoundNumber,
        TotalRounds = jobApplication.TotalRounds,
        CreationTime = jobApplication.CreationTime
    };
}
