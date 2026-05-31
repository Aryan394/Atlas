using Moneytize.Api.Helpers;

namespace Moneytize.Api.Application.Transaction.DTOs;

public class GetTransactionsRequest : PaginationParameters
{
    public DateOnly? StartDate { get; set; }

    public DateOnly? EndDate { get; set; }
}
