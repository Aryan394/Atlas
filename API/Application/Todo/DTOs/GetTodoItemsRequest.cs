using Atlas.Api.Helpers;

namespace Atlas.Api.Application.Todo.DTOs;

public class GetTodoItemsRequest : PaginationParameters
{
    /// <summary>
    /// When true, returns incomplete tasks whose EndTime is in the past (UTC).
    /// </summary>
    public bool OverdueOnly { get; set; }
}
