namespace Atlas.Api.Entity;

public class TodoItem : BaseEntity
{
    public required string Title { get; set; }

    public string? Notes { get; set; }

    public bool IsCompleted { get; set; }

    public DateTime? EndTime { get; set; }

    public DateTime? CompletionTime { get; set; }
}
