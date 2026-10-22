using System.Text.Json.Serialization;

namespace Atlas.Api.Application.Account.DTOs;

public class RegisterResponse
{
    public UserResponse? User { get; init; }

    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? ErrorMessage { get; init; }

    [JsonIgnore]
    public bool IsSuccess => ErrorMessage is null;

    public static RegisterResponse Success(UserResponse user) => new() { User = user };

    public static RegisterResponse Failure(string errorMessage) => new() { ErrorMessage = errorMessage };
}
