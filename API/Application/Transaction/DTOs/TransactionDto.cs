namespace Moneytize.Api.Application.Transaction.DTOs;

public class TransactionDto
{
    public Guid Id { get; set; }

    public required string Description { get; set; }

    public decimal Amount { get; set; }

    public DateOnly Date { get; set; }

    public string? Category { get; set; }
}
