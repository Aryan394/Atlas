using System.ComponentModel.DataAnnotations;

namespace Atlas.Api.Application.Todo.DTOs;

public class CreateTodoItemRequest
{
    [Required]
    [MaxLength(300)]
    public required string Title { get; set; }

    [MaxLength(1000)]
    public string? Notes { get; set; }

    /// <summary>
    /// Deadline in UTC. Frontend converts IST selections to UTC before sending.
    /// </summary>
    public DateTime? EndTime { get; set; }
}
