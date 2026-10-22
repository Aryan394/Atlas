using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Atlas.Api.Application.Account.DTOs;
using Atlas.Api.Helpers;

namespace Atlas.Api.Application.Account;

[ApiController]
[Route("api/[controller]")]
public class AccountController : ControllerBase
{
    private readonly IAccountRepository _accountRepository;

    public AccountController(IAccountRepository accountRepository)
    {
        _accountRepository = accountRepository;
    }
    [Authorize]
    [HttpPost("register")]
    public async Task<ActionResult<UserResponse>> Register([FromBody] RegisterRequest request)
    {
        var result = await _accountRepository.RegisterAsync(request);

        if (!result.IsSuccess)
        {
            return Conflict(CommonHttpResponseHelper.CreateConflictResponse(result.ErrorMessage!));
        }

        return CreatedAtAction(nameof(Register), result.User);
    }

    [AllowAnonymous]
    [HttpPost("login")]
    public async Task<ActionResult<LoginResponse>> Login([FromBody] LoginRequest request)
    {
        var result = await _accountRepository.LoginAsync(request);

        if (!result.IsSuccess)
        {
            return Unauthorized(CommonHttpResponseHelper.CreateUnauthorizedResponse());
        }

        return Ok(result);
    }
}
