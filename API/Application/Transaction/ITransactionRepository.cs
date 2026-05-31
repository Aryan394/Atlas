using Moneytize.Api.Application.Transaction.DTOs;
using Moneytize.Api.Helpers;

namespace Moneytize.Api.Application.Transaction;

public interface ITransactionRepository
{
    Task<PaginatedResponse<TransactionDto>> GetAllAsync(GetTransactionsRequest request);

    Task<MonthlySpendingResponse> GetMonthlySpendingAsync(GetMonthlySpendingRequest request);

    Task<TransactionDto?> GetByIdAsync(Guid id);

    Task<TransactionDto> CreateAsync(CreateTransactionRequest request);

    Task<TransactionDto?> UpdateAsync(Guid id, UpdateTransactionRequest request);

    Task<bool> DeleteAsync(Guid id);
}
