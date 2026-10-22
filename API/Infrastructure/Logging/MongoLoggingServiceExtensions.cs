using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace Atlas.Api.Infrastructure.Logging;

public static class MongoLoggingServiceExtensions
{
    public static IServiceCollection AddMongoLogging(this IServiceCollection services, IConfiguration configuration)
    {
        services.Configure<MongoLoggingOptions>(configuration.GetSection(MongoLoggingOptions.SectionName));
        services.TryAddSingleton<IMongoLogWriter, MongoLogWriter>();
        services.TryAddEnumerable(ServiceDescriptor.Singleton<ILoggerProvider, MongoLoggerProvider>());

        return services;
    }

    public static IApplicationBuilder UseMongoLogging(this IApplicationBuilder app)
    {
        return app.UseMiddleware<MongoHttpContextLoggingMiddleware>();
    }
}
