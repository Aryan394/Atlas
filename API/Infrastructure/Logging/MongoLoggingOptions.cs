namespace Atlas.Api.Infrastructure.Logging;

public class MongoLoggingOptions
{
    public const string SectionName = "MongoLogging";

    public string ConnectionString { get; set; } = string.Empty;

    public string DatabaseName { get; set; } = "atlas_logs";

    public string CollectionName { get; set; } = "application_logs";

    /// <summary>
    /// When false (default), Information logs are not written to MongoDB.
    /// Set to true to opt in to INFO logging.
    /// </summary>
    public bool EnableInformation { get; set; }

    public bool IsConfigured => !string.IsNullOrWhiteSpace(ConnectionString);
}
