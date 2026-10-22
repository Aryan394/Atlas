using System.ComponentModel.DataAnnotations;
using Atlas.Api.Enums;

namespace Atlas.Api.Application.Transaction.DTOs;

public class UpdateTransactionRequest
{
    [Required]
    [MaxLength(200)]
    public required string Description { get; set; }

    [Required]
    public decimal Amount { get; set; }

    [Required]
    [EnumDataType(typeof(TransactionType))]
    public TransactionType Type { get; set; }

    [Required]
    public DateOnly Date { get; set; }

    [MaxLength(100)]
    public string? Category { get; set; }
}
