using Microsoft.EntityFrameworkCore;
using Moneytize.Api.Application.Transaction.DTOs;
using Moneytize.Api.Helpers;
using Moneytize.Api.Infrastructure.Data;
using TransactionEntity = Moneytize.Api.Entity.Transaction;

namespace Moneytize.Api.Application.Transaction;

public class TransactionRepository : ITransactionRepository
{
    private readonly AppDbContext _dbContext;

    public TransactionRepository(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<PaginatedResponse<TransactionDto>> GetAllAsync(GetTransactionsRequest request)
    {
        var query = _dbContext.Transactions.AsNoTracking();

        if (request.StartDate.HasValue)
        {
            query = query.Where(t => t.Date >= request.StartDate.Value);
        }

        if (request.EndDate.HasValue)
        {
            query = query.Where(t => t.Date <= request.EndDate.Value);
        }

        var orderedQuery = query
            .OrderByDescending(t => t.Date)
            .ThenByDescending(t => t.Id)
            .Select(t => new TransactionDto
            {
                Id = t.Id,
                Description = t.Description,
                Amount = t.Amount,
                Date = t.Date,
                Category = t.Category
            });

        return await PaginationHelper.PaginateAsync(orderedQuery, request.Page, request.PageSize);
    }

    public async Task<MonthlySpendingResponse> GetMonthlySpendingAsync(GetMonthlySpendingRequest request)
    {
        var now = DateTime.UtcNow;
        var year = request.Year ?? now.Year;
        var month = request.Month ?? now.Month;

        var startDate = new DateOnly(year, month, 1);
        var endDate = startDate.AddMonths(1).AddDays(-1);

        var spendingQuery = _dbContext.Transactions
            .AsNoTracking()
            .Where(t => t.Date >= startDate && t.Date <= endDate && t.Amount < 0);

        var totalSpent = await spendingQuery.SumAsync(t => t.Amount);
        var transactionCount = await spendingQuery.CountAsync();

        return new MonthlySpendingResponse
        {
            Year = year,
            Month = month,
            StartDate = startDate,
            EndDate = endDate,
            TotalSpent = Math.Abs(totalSpent),
            TransactionCount = transactionCount
        };
    }

    public async Task<TransactionDto?> GetByIdAsync(Guid id)
    {
        var transaction = await _dbContext.Transactions
            .AsNoTracking()
            .FirstOrDefaultAsync(t => t.Id == id);

        return transaction is null ? null : ToDto(transaction);
    }

    public async Task<TransactionDto> CreateAsync(CreateTransactionRequest request)
    {
        var transaction = new TransactionEntity
        {
            Id = Guid.NewGuid(),
            Description = request.Description,
            Amount = request.Amount,
            Date = request.Date,
            Category = request.Category
        };

        _dbContext.Transactions.Add(transaction);
        await _dbContext.SaveChangesAsync();

        return ToDto(transaction);
    }

    public async Task<TransactionDto?> UpdateAsync(Guid id, UpdateTransactionRequest request)
    {
        var transaction = await _dbContext.Transactions.FirstOrDefaultAsync(t => t.Id == id);
        if (transaction is null)
        {
            return null;
        }

        transaction.Description = request.Description;
        transaction.Amount = request.Amount;
        transaction.Date = request.Date;
        transaction.Category = request.Category;

        await _dbContext.SaveChangesAsync();

        return ToDto(transaction);
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var transaction = await _dbContext.Transactions.FirstOrDefaultAsync(t => t.Id == id);
        if (transaction is null)
        {
            return false;
        }

        transaction.IsDeleted = true;
        transaction.DeletionTime = DateTime.UtcNow;

        await _dbContext.SaveChangesAsync();

        return true;
    }

    private static TransactionDto ToDto(TransactionEntity transaction) => new()
    {
        Id = transaction.Id,
        Description = transaction.Description,
        Amount = transaction.Amount,
        Date = transaction.Date,
        Category = transaction.Category
    };
}
