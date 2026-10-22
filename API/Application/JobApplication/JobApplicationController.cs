using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Atlas.Api.Application.JobApplication.DTOs;
using Atlas.Api.Entity;
using Atlas.Api.Helpers;

namespace Atlas.Api.Application.JobApplication;

[ApiController]
[Route("api/job-applications")]
[Authorize]
public class JobApplicationController : ControllerBase
{
    private readonly IJobApplicationRepository _jobApplicationRepository;

    public JobApplicationController(IJobApplicationRepository jobApplicationRepository)
    {
        _jobApplicationRepository = jobApplicationRepository;
    }

    [HttpGet("get-all")]
    public async Task<ActionResult<PaginatedResponse<JobApplicationDto>>> GetAll([FromQuery] GetJobApplicationsRequest request)
    {
        var paginationError = PaginationHelper.Validate(request.Page, request.PageSize);
        if (paginationError is not null)
        {
            return BadRequest(CommonHttpResponseHelper.CreateBadRequestResponse(paginationError));
        }

        var jobApplications = await _jobApplicationRepository.GetAllAsync(request);
        return Ok(jobApplications);
    }

    [HttpGet("get-by-id/{id:int}")]
    public async Task<ActionResult<JobApplicationDto>> GetById(int id)
    {
        var jobApplication = await _jobApplicationRepository.GetByIdAsync(id);
        if (jobApplication is null)
        {
            return NotFound(CommonHttpResponseHelper.CreateNotFoundResponse("Job application not found."));
        }

        return Ok(jobApplication);
    }

    [HttpPost("create")]
    public async Task<ActionResult<JobApplicationDto>> Create([FromBody] CreateJobApplicationRequest request)
    {
        var validationError = ValidateRoundFields(request.Status, request.RoundNumber, request.TotalRounds);
        if (validationError is not null)
        {
            return BadRequest(CommonHttpResponseHelper.CreateBadRequestResponse(validationError));
        }

        var jobApplication = await _jobApplicationRepository.CreateAsync(request);
        return CreatedAtAction(nameof(GetById), new { id = jobApplication.Id }, jobApplication);
    }

    [HttpPut("update/{id:int}")]
    public async Task<ActionResult<JobApplicationDto>> Update(int id, [FromBody] UpdateJobApplicationRequest request)
    {
        var validationError = ValidateRoundFields(request.Status, request.RoundNumber, request.TotalRounds);
        if (validationError is not null)
        {
            return BadRequest(CommonHttpResponseHelper.CreateBadRequestResponse(validationError));
        }

        var jobApplication = await _jobApplicationRepository.UpdateAsync(id, request);
        if (jobApplication is null)
        {
            return NotFound(CommonHttpResponseHelper.CreateNotFoundResponse("Job application not found."));
        }

        return Ok(jobApplication);
    }

    [HttpPut("update-status/{id:int}")]
    public async Task<ActionResult<JobApplicationDto>> UpdateStatus(int id, [FromBody] UpdateJobApplicationStatusRequest request)
    {
        var validationError = ValidateRoundFields(request.Status, request.RoundNumber, request.TotalRounds);
        if (validationError is not null)
        {
            return BadRequest(CommonHttpResponseHelper.CreateBadRequestResponse(validationError));
        }

        var jobApplication = await _jobApplicationRepository.UpdateStatusAsync(id, request);
        if (jobApplication is null)
        {
            return NotFound(CommonHttpResponseHelper.CreateNotFoundResponse("Job application not found."));
        }

        return Ok(jobApplication);
    }

    [HttpDelete("delete/{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted = await _jobApplicationRepository.DeleteAsync(id);
        if (!deleted)
        {
            return NotFound(CommonHttpResponseHelper.CreateNotFoundResponse("Job application not found."));
        }

        return NoContent();
    }

    private static string? ValidateRoundFields(ApplicationStatus status, int? roundNumber, int? totalRounds)
    {
        if (status != ApplicationStatus.ShortlistedForInterview)
        {
            return null;
        }

        if (!roundNumber.HasValue || !totalRounds.HasValue)
        {
            return "Round number and total rounds are required when status is Shortlisted for interview.";
        }

        if (roundNumber.Value > totalRounds.Value)
        {
            return "Round number cannot be greater than total rounds.";
        }

        return null;
    }
}
