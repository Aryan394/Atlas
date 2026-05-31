using System.Text.Json.Serialization;

namespace Moneytize.Api.Application.Account.DTOs;

public class LoginResponse
{
    public string? Token { get; init; }

    public DateTime? ExpiresAt { get; init; }

    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? ErrorMessage { get; init; }

    [JsonIgnore]
    public bool IsSuccess => ErrorMessage is null;

    public static LoginResponse Success(string token, DateTime expiresAt) =>
        new() { Token = token, ExpiresAt = expiresAt };

    public static LoginResponse Failure(string errorMessage) =>
        new() { ErrorMessage = errorMessage };
}
