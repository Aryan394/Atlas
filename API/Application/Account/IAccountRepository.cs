using Atlas.Api.Application.Account.DTOs;

namespace Atlas.Api.Application.Account;

public interface IAccountRepository
{
    Task<RegisterResponse> RegisterAsync(RegisterRequest request);

    Task<LoginResponse> LoginAsync(LoginRequest request);
}
