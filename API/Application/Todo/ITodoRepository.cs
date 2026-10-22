using Atlas.Api.Application.Todo.DTOs;
using Atlas.Api.Helpers;

namespace Atlas.Api.Application.Todo;

public interface ITodoRepository
{
    Task<PaginatedResponse<TodoItemDto>> GetAllAsync(GetTodoItemsRequest request);

    Task<TodoItemDto?> GetByIdAsync(int id);

    Task<TodoItemDto> CreateAsync(CreateTodoItemRequest request);

    Task<TodoItemDto?> UpdateAsync(int id, UpdateTodoItemRequest request);

    Task<TodoItemDto?> MarkCompletedAsync(int id);

    Task<bool> DeleteAsync(int id);
}
