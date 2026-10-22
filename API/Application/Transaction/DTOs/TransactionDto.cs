using Atlas.Api.Enums;

namespace Atlas.Api.Application.Transaction.DTOs;

public class TransactionDto
{
    public int Id { get; set; }

    public required string Description { get; set; }

    public decimal Amount { get; set; }

    public TransactionType Type { get; set; }

    public DateOnly Date { get; set; }

    public string? Category { get; set; }

    public DateTime CreationTime { get; set; }
}
