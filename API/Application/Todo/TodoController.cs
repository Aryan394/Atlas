using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Atlas.Api.Application.Todo.DTOs;
using Atlas.Api.Helpers;

namespace Atlas.Api.Application.Todo;

[ApiController]
[Route("api/todos")]
[Authorize]
public class TodoController : ControllerBase
{
    private readonly ITodoRepository _todoRepository;

    public TodoController(ITodoRepository todoRepository)
    {
        _todoRepository = todoRepository;
    }

    [HttpGet("get-all")]
    public async Task<ActionResult<PaginatedResponse<TodoItemDto>>> GetAll([FromQuery] GetTodoItemsRequest request)
    {
        var paginationError = PaginationHelper.Validate(request.Page, request.PageSize);
        if (paginationError is not null)
        {
            return BadRequest(CommonHttpResponseHelper.CreateBadRequestResponse(paginationError));
        }

        var todos = await _todoRepository.GetAllAsync(request);
        return Ok(todos);
    }

    [HttpGet("get-by-id/{id:int}")]
    public async Task<ActionResult<TodoItemDto>> GetById(int id)
    {
        var todoItem = await _todoRepository.GetByIdAsync(id);
        if (todoItem is null)
        {
            return NotFound(CommonHttpResponseHelper.CreateNotFoundResponse("Todo item not found."));
        }

        return Ok(todoItem);
    }

    [HttpPost("create")]
    public async Task<ActionResult<TodoItemDto>> Create([FromBody] CreateTodoItemRequest request)
    {
        var todoItem = await _todoRepository.CreateAsync(request);
        return CreatedAtAction(nameof(GetById), new { id = todoItem.Id }, todoItem);
    }

    [HttpPut("update/{id:int}")]
    public async Task<ActionResult<TodoItemDto>> Update(int id, [FromBody] UpdateTodoItemRequest request)
    {
        var todoItem = await _todoRepository.UpdateAsync(id, request);
        if (todoItem is null)
        {
            return NotFound(CommonHttpResponseHelper.CreateNotFoundResponse("Todo item not found."));
        }

        return Ok(todoItem);
    }

    [HttpPut("mark-completed/{id:int}")]
    public async Task<ActionResult<TodoItemDto>> MarkCompleted(int id)
    {
        var todoItem = await _todoRepository.MarkCompletedAsync(id);
        if (todoItem is null)
        {
            return NotFound(CommonHttpResponseHelper.CreateNotFoundResponse("Todo item not found."));
        }

        return Ok(todoItem);
    }

    [HttpDelete("delete/{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted = await _todoRepository.DeleteAsync(id);
        if (!deleted)
        {
            return NotFound(CommonHttpResponseHelper.CreateNotFoundResponse("Todo item not found."));
        }

        return NoContent();
    }
}
