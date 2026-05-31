namespace Moneytize.Api.Application.Transaction.DTOs;

public class MonthlySpendingResponse
{
    public int Year { get; set; }

    public int Month { get; set; }

    public DateOnly StartDate { get; set; }

    public DateOnly EndDate { get; set; }

    public decimal TotalSpent { get; set; }

    public int TransactionCount { get; set; }
}
