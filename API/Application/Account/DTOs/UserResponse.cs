namespace Moneytize.Api.Application.Account.DTOs;

public class UserResponse
{
    public Guid Id { get; set; }

    public required string Email { get; set; }

    public DateTime CreatedAt { get; set; }
}
