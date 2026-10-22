namespace Atlas.Api.Infrastructure.Logging;

public sealed class MongoHttpContextLoggingMiddleware
{
    public const string ServerErrorLoggedItemKey = "Atlas.ServerErrorLogged";

    private readonly RequestDelegate _next;
    private readonly MongoLoggerProvider? _provider;

    public MongoHttpContextLoggingMiddleware(RequestDelegate next, IEnumerable<ILoggerProvider> providers)
    {
        _next = next;
        _provider = providers.OfType<MongoLoggerProvider>().FirstOrDefault();
    }

    public async Task InvokeAsync(HttpContext context, IMongoLogWriter logWriter)
    {
        _provider?.SetHttpContext(context);

        try
        {
            await _next(context);
        }
        finally
        {
            if (context.Response.StatusCode >= StatusCodes.Status500InternalServerError
                && !context.Items.ContainsKey(ServerErrorLoggedItemKey)
                && logWriter.IsEnabled)
            {
                context.Items[ServerErrorLoggedItemKey] = true;

                await logWriter.WriteAsync(new MongoLogEntry
                {
                    TimestampUtc = DateTime.UtcNow,
                    Level = LogLevel.Error.ToString(),
                    Category = "Atlas.Api.Http.ServerError",
                    Message = $"HTTP {context.Response.StatusCode} returned for {context.Request.Method} {context.Request.Path}",
                    TraceId = context.TraceIdentifier,
                    RequestMethod = context.Request.Method,
                    RequestPath = context.Request.Path.Value,
                    StatusCode = context.Response.StatusCode
                });
            }

            _provider?.SetHttpContext(null);
        }
    }
}
