using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Moneytize.Api.Application.Transaction.DTOs;
using Moneytize.Api.Helpers;

namespace Moneytize.Api.Application.Transaction;

[ApiController]
[Route("api/transactions")]
[Authorize]
public class TransactionController : ControllerBase
{
    private readonly ITransactionRepository _transactionRepository;

    public TransactionController(ITransactionRepository transactionRepository)
    {
        _transactionRepository = transactionRepository;
    }

    [HttpGet("get-all")]
    public async Task<ActionResult<PaginatedResponse<TransactionDto>>> GetAll([FromQuery] GetTransactionsRequest request)
    {
        var paginationError = PaginationHelper.Validate(request.Page, request.PageSize);
        if (paginationError is not null)
        {
            return BadRequest(CommonHttpResponseHelper.CreateBadRequestResponse(paginationError));
        }

        if (request.StartDate.HasValue && request.EndDate.HasValue && request.StartDate > request.EndDate)
        {
            return BadRequest(CommonHttpResponseHelper.CreateBadRequestResponse("StartDate must be on or before EndDate."));
        }

        var transactions = await _transactionRepository.GetAllAsync(request);
        return Ok(transactions);
    }

    [HttpGet("get-monthly-spending")]
    public async Task<ActionResult<MonthlySpendingResponse>> GetMonthlySpending([FromQuery] GetMonthlySpendingRequest request)
    {
        var now = DateTime.UtcNow;
        var year = request.Year ?? now.Year;
        var month = request.Month ?? now.Month;

        if (month is < 1 or > 12)
        {
            return BadRequest(CommonHttpResponseHelper.CreateBadRequestResponse("Month must be between 1 and 12."));
        }

        if (year is < 1 or > 9999)
        {
            return BadRequest(CommonHttpResponseHelper.CreateBadRequestResponse("Year must be between 1 and 9999."));
        }

        var spending = await _transactionRepository.GetMonthlySpendingAsync(request);
        return Ok(spending);
    }

    [HttpGet("get-by-id/{id:guid}")]
    public async Task<ActionResult<TransactionDto>> GetById(Guid id)
    {
        var transaction = await _transactionRepository.GetByIdAsync(id);
        if (transaction is null)
        {
            return NotFound(CommonHttpResponseHelper.CreateNotFoundResponse("Transaction not found."));
        }

        return Ok(transaction);
    }

    [HttpPost("create")]
    public async Task<ActionResult<TransactionDto>> Create([FromBody] CreateTransactionRequest request)
    {
        var transaction = await _transactionRepository.CreateAsync(request);
        return CreatedAtAction(nameof(GetById), new { id = transaction.Id }, transaction);
    }

    [HttpPut("update/{id:guid}")]
    public async Task<ActionResult<TransactionDto>> Update(Guid id, [FromBody] UpdateTransactionRequest request)
    {
        var transaction = await _transactionRepository.UpdateAsync(id, request);
        if (transaction is null)
        {
            return NotFound(CommonHttpResponseHelper.CreateNotFoundResponse("Transaction not found."));
        }

        return Ok(transaction);
    }

    [HttpDelete("delete/{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var deleted = await _transactionRepository.DeleteAsync(id);
        if (!deleted)
        {
            return NotFound(CommonHttpResponseHelper.CreateNotFoundResponse("Transaction not found."));
        }

        return NoContent();
    }
}
