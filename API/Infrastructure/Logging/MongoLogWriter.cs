using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace Atlas.Api.Infrastructure.Logging;

public sealed class MongoLogWriter : IMongoLogWriter
{
    private readonly IMongoCollection<MongoLogEntry>? _collection;
    private int _writeFailureLogged;

    public MongoLogWriter(IOptions<MongoLoggingOptions> options)
    {
        var settings = options.Value;

        if (!settings.IsConfigured)
        {
            IsEnabled = false;
            return;
        }

        try
        {
            var client = new MongoClient(settings.ConnectionString);
            var database = client.GetDatabase(settings.DatabaseName);
            _collection = database.GetCollection<MongoLogEntry>(settings.CollectionName);
            IsEnabled = true;
        }
        catch (Exception ex)
        {
            IsEnabled = false;
            Console.Error.WriteLine($"[Atlas] Failed to initialize MongoDB logging: {ex.Message}");
        }
    }

    public bool IsEnabled { get; }

    public async Task WriteAsync(MongoLogEntry entry, CancellationToken cancellationToken = default)
    {
        if (!IsEnabled || _collection is null)
        {
            return;
        }

        try
        {
            await _collection.InsertOneAsync(entry, cancellationToken: cancellationToken);
        }
        catch (Exception ex)
        {
            if (Interlocked.Exchange(ref _writeFailureLogged, 1) == 0)
            {
                Console.Error.WriteLine($"[Atlas] MongoDB log write failed: {ex.Message}");
            }
        }
    }
}
