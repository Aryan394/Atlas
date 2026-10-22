namespace Atlas.Api.Entity;

public class User : BaseEntity
{
    public required string Email { get; set; }

    public required string PasswordHash { get; set; }
}
