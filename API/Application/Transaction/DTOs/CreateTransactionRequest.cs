using System.ComponentModel.DataAnnotations;

namespace Moneytize.Api.Application.Transaction.DTOs;

public class CreateTransactionRequest
{
    [Required]
    [MaxLength(200)]
    public required string Description { get; set; }

    [Required]
    public decimal Amount { get; set; }

    [Required]
    public DateOnly Date { get; set; }

    [MaxLength(100)]
    public string? Category { get; set; }
}
