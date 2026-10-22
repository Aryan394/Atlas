using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Atlas.Api.Infrastructure.Logging;

public class MongoLogEntry
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }

    public DateTime TimestampUtc { get; set; }

    public required string Level { get; set; }

    public required string Category { get; set; }

    public required string Message { get; set; }

    public string? Exception { get; set; }

    public string? EventId { get; set; }

    public string? TraceId { get; set; }

    public string? RequestMethod { get; set; }

    public string? RequestPath { get; set; }

    public int? StatusCode { get; set; }

    public string Source { get; set; } = "Atlas.Api";
}
