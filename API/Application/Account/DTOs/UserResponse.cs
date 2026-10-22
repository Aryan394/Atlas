namespace Atlas.Api.Application.Account.DTOs;

public class UserResponse
{
    public int Id { get; set; }

    public required string Email { get; set; }

    public DateTime CreatedAt { get; set; }
}
