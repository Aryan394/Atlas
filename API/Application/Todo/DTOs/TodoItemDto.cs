namespace Atlas.Api.Application.Todo.DTOs;

public class TodoItemDto
{
    public int Id { get; set; }

    public required string Title { get; set; }

    public string? Notes { get; set; }

    public bool IsCompleted { get; set; }

    public DateTime? EndTime { get; set; }

    public DateTime? CompletionTime { get; set; }

    public DateTime CreationTime { get; set; }
}
