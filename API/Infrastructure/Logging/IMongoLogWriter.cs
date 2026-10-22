namespace Atlas.Api.Infrastructure.Logging;

public interface IMongoLogWriter
{
    bool IsEnabled { get; }

    Task WriteAsync(MongoLogEntry entry, CancellationToken cancellationToken = default);
}
