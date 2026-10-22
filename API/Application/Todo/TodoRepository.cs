using Microsoft.EntityFrameworkCore;
using Atlas.Api.Application.Todo.DTOs;
using Atlas.Api.Helpers;
using Atlas.Api.Infrastructure.Data;
using TodoItemEntity = Atlas.Api.Entity.TodoItem;

namespace Atlas.Api.Application.Todo;

public class TodoRepository : ITodoRepository
{
    private readonly AppDbContext _dbContext;

    public TodoRepository(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<PaginatedResponse<TodoItemDto>> GetAllAsync(GetTodoItemsRequest request)
    {
        var query = _dbContext.TodoItems.AsNoTracking();

        if (request.OverdueOnly)
        {
            var utcNow = DateTime.UtcNow;
            query = query.Where(t =>
                !t.IsCompleted
                && t.EndTime != null
                && t.EndTime < utcNow);
        }

        var orderedQuery = query
            .OrderBy(t => t.IsCompleted)
            .ThenBy(t => t.EndTime == null)
            .ThenBy(t => t.EndTime)
            .ThenByDescending(t => t.CreationTime)
            .ThenByDescending(t => t.Id)
            .Select(t => new TodoItemDto
            {
                Id = t.Id,
                Title = t.Title,
                Notes = t.Notes,
                IsCompleted = t.IsCompleted,
                EndTime = t.EndTime,
                CompletionTime = t.CompletionTime,
                CreationTime = t.CreationTime
            });

        return await PaginationHelper.PaginateAsync(orderedQuery, request.Page, request.PageSize);
    }

    public async Task<TodoItemDto?> GetByIdAsync(int id)
    {
        var todoItem = await _dbContext.TodoItems
            .AsNoTracking()
            .FirstOrDefaultAsync(t => t.Id == id);

        return todoItem is null ? null : ToDto(todoItem);
    }

    public async Task<TodoItemDto> CreateAsync(CreateTodoItemRequest request)
    {
        var todoItem = new TodoItemEntity
        {
            Title = request.Title,
            Notes = request.Notes,
            IsCompleted = false,
            EndTime = NormalizeUtc(request.EndTime),
            CompletionTime = null
        };

        _dbContext.TodoItems.Add(todoItem);
        await _dbContext.SaveChangesAsync();

        return ToDto(todoItem);
    }

    public async Task<TodoItemDto?> UpdateAsync(int id, UpdateTodoItemRequest request)
    {
        var todoItem = await _dbContext.TodoItems.FirstOrDefaultAsync(t => t.Id == id);
        if (todoItem is null)
        {
            return null;
        }

        var wasCompleted = todoItem.IsCompleted;

        todoItem.Title = request.Title;
        todoItem.Notes = request.Notes;
        todoItem.EndTime = NormalizeUtc(request.EndTime);
        todoItem.IsCompleted = request.IsCompleted;

        if (request.IsCompleted && !wasCompleted)
        {
            todoItem.CompletionTime = DateTime.UtcNow;
        }
        else if (!request.IsCompleted)
        {
            todoItem.CompletionTime = null;
        }

        await _dbContext.SaveChangesAsync();

        return ToDto(todoItem);
    }

    public async Task<TodoItemDto?> MarkCompletedAsync(int id)
    {
        var todoItem = await _dbContext.TodoItems.FirstOrDefaultAsync(t => t.Id == id);
        if (todoItem is null)
        {
            return null;
        }

        if (!todoItem.IsCompleted)
        {
            todoItem.IsCompleted = true;
            todoItem.CompletionTime = DateTime.UtcNow;
            await _dbContext.SaveChangesAsync();
        }

        return ToDto(todoItem);
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var todoItem = await _dbContext.TodoItems.FirstOrDefaultAsync(t => t.Id == id);
        if (todoItem is null)
        {
            return false;
        }

        todoItem.IsDeleted = true;
        todoItem.DeletionTime = DateTime.UtcNow;

        await _dbContext.SaveChangesAsync();

        return true;
    }

    private static DateTime? NormalizeUtc(DateTime? value)
    {
        if (!value.HasValue)
        {
            return null;
        }

        return value.Value.Kind switch
        {
            DateTimeKind.Utc => value.Value,
            DateTimeKind.Local => value.Value.ToUniversalTime(),
            _ => DateTime.SpecifyKind(value.Value, DateTimeKind.Utc)
        };
    }

    private static TodoItemDto ToDto(TodoItemEntity todoItem) => new()
    {
        Id = todoItem.Id,
        Title = todoItem.Title,
        Notes = todoItem.Notes,
        IsCompleted = todoItem.IsCompleted,
        EndTime = todoItem.EndTime,
        CompletionTime = todoItem.CompletionTime,
        CreationTime = todoItem.CreationTime
    };

}
