namespace Moneytize.Api.Application.Transaction.DTOs;

public class GetMonthlySpendingRequest
{
    public int? Year { get; set; }

    public int? Month { get; set; }
}
