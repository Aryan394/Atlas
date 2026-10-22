using System.Collections.Concurrent;
using Microsoft.Extensions.Options;

namespace Atlas.Api.Infrastructure.Logging;

[ProviderAlias("Mongo")]
public sealed class MongoLoggerProvider : ILoggerProvider
{
    private readonly IMongoLogWriter _writer;
    private readonly MongoLoggingOptions _options;
    private readonly ConcurrentDictionary<string, MongoLogger> _loggers = new(StringComparer.OrdinalIgnoreCase);
    private readonly AsyncLocal<HttpContextSnapshot?> _httpContext = new();

    public MongoLoggerProvider(IMongoLogWriter writer, IOptions<MongoLoggingOptions> options)
    {
        _writer = writer;
        _options = options.Value;
    }

    public void SetHttpContext(HttpContext? httpContext)
    {
        _httpContext.Value = httpContext is null
            ? null
            : new HttpContextSnapshot(
                httpContext.TraceIdentifier,
                httpContext.Request.Method,
                httpContext.Request.Path.Value,
                httpContext.Response.HasStarted ? httpContext.Response.StatusCode : null);
    }

    public ILogger CreateLogger(string categoryName) =>
        _loggers.GetOrAdd(categoryName, name => new MongoLogger(name, _writer, _options, () => _httpContext.Value));

    public void Dispose()
    {
        _loggers.Clear();
    }

    internal sealed record HttpContextSnapshot(
        string TraceId,
        string Method,
        string? Path,
        int? StatusCode);
}

internal sealed class MongoLogger : ILogger
{
    private static readonly HashSet<string> ExcludedCategories = new(StringComparer.OrdinalIgnoreCase)
    {
        typeof(MongoLogWriter).FullName!,
        typeof(MongoLoggerProvider).FullName!
    };

    private readonly string _categoryName;
    private readonly IMongoLogWriter _writer;
    private readonly MongoLoggingOptions _options;
    private readonly Func<MongoLoggerProvider.HttpContextSnapshot?> _httpContextAccessor;

    public MongoLogger(
        string categoryName,
        IMongoLogWriter writer,
        MongoLoggingOptions options,
        Func<MongoLoggerProvider.HttpContextSnapshot?> httpContextAccessor)
    {
        _categoryName = categoryName;
        _writer = writer;
        _options = options;
        _httpContextAccessor = httpContextAccessor;
    }

    public IDisposable? BeginScope<TState>(TState state) where TState : notnull => null;

    public bool IsEnabled(LogLevel logLevel)
    {
        if (!_writer.IsEnabled || logLevel == LogLevel.None)
        {
            return false;
        }

        if (ExcludedCategories.Contains(_categoryName))
        {
            return false;
        }

        return logLevel switch
        {
            LogLevel.Trace or LogLevel.Debug => false,
            LogLevel.Information => _options.EnableInformation,
            LogLevel.Warning or LogLevel.Error or LogLevel.Critical => true,
            _ => false
        };
    }

    public void Log<TState>(
        LogLevel logLevel,
        EventId eventId,
        TState state,
        Exception? exception,
        Func<TState, Exception?, string> formatter)
    {
        if (!IsEnabled(logLevel))
        {
            return;
        }

        var http = _httpContextAccessor();
        var entry = new MongoLogEntry
        {
            TimestampUtc = DateTime.UtcNow,
            Level = logLevel.ToString(),
            Category = _categoryName,
            Message = formatter(state, exception),
            Exception = exception?.ToString(),
            EventId = eventId.Id == 0 && string.IsNullOrEmpty(eventId.Name)
                ? null
                : $"{eventId.Id}:{eventId.Name}",
            TraceId = http?.TraceId,
            RequestMethod = http?.Method,
            RequestPath = http?.Path,
            StatusCode = http?.StatusCode
        };

        _ = _writer.WriteAsync(entry);
    }
}
