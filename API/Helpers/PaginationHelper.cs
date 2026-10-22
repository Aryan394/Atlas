using Microsoft.EntityFrameworkCore;

namespace Atlas.Api.Helpers;

public class PaginationParameters
{
    public int Page { get; set; } = PaginationHelper.DefaultPage;

    public int PageSize { get; set; } = PaginationHelper.DefaultPageSize;
}

public class PaginatedResponse<T>
{
    public IReadOnlyList<T> Items { get; set; } = [];

    public int Page { get; set; }

    public int PageSize { get; set; }

    public int TotalCount { get; set; }

    public int TotalPages { get; set; }
}

public static class PaginationHelper
{
    public const int DefaultPage = 1;
    public const int DefaultPageSize = 100;

    public static int CalculateSkip(int page, int pageSize) => (page - 1) * pageSize;

    public static int CalculateTotalPages(int totalCount, int pageSize) =>
        totalCount == 0 ? 0 : (int)Math.Ceiling(totalCount / (double)pageSize);

    public static string? Validate(int page, int pageSize)
    {
        if (page < 1)
        {
            return "Page must be greater than or equal to 1.";
        }

        if (pageSize < 1)
        {
            return "PageSize must be greater than or equal to 1.";
        }

        return null;
    }

    public static PaginatedResponse<T> Create<T>(
        IReadOnlyList<T> items,
        int page,
        int pageSize,
        int totalCount) =>
        new()
        {
            Items = items,
            Page = page,
            PageSize = pageSize,
            TotalCount = totalCount,
            TotalPages = CalculateTotalPages(totalCount, pageSize)
        };

    public static async Task<PaginatedResponse<T>> PaginateAsync<T>(
        IQueryable<T> query,
        int page,
        int pageSize)
    {
        var totalCount = await query.CountAsync();
        var items = await query
            .Skip(CalculateSkip(page, pageSize))
            .Take(pageSize)
            .ToListAsync();

        return Create(items, page, pageSize, totalCount);
    }
}
