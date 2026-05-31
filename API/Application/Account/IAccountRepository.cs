using Moneytize.Api.Application.Account.DTOs;

namespace Moneytize.Api.Application.Account;

public interface IAccountRepository
{
    Task<RegisterResponse> RegisterAsync(RegisterRequest request);

    Task<LoginResponse> LoginAsync(LoginRequest request);
}
