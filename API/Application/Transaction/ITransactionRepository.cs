using Atlas.Api.Application.Transaction.DTOs;
using Atlas.Api.Helpers;

namespace Atlas.Api.Application.Transaction;

public interface ITransactionRepository
{
    Task<PaginatedResponse<TransactionDto>> GetAllAsync(GetTransactionsRequest request);

    Task<MonthlySpendingResponse> GetMonthlySpendingAsync(GetMonthlySpendingRequest request);

    Task<TransactionDto?> GetByIdAsync(int id);

    Task<TransactionDto> CreateAsync(CreateTransactionRequest request);

    Task<TransactionDto?> UpdateAsync(int id, UpdateTransactionRequest request);

    Task<bool> DeleteAsync(int id);
}
