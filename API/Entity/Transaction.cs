using Atlas.Api.Enums;

namespace Atlas.Api.Entity;

public class Transaction : BaseEntity
{
    public required string Description { get; set; }

    public decimal Amount { get; set; }

    public TransactionType Type { get; set; }

    public DateOnly Date { get; set; }

    public string? Category { get; set; }
}
