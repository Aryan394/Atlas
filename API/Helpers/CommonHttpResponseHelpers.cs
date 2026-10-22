namespace Atlas.Api.Helpers;

public static class CommonHttpResponseHelper
{
    public static object CreateBadRequestResponse(string message)
    {
        return new
        {
            success = false,
            message
        };
    }

    public static object CreateUnauthorizedResponse()
    {
        return new
        {
            success = false,
            message = "Current user did not log in to the application"
        };
    }

    public static object CreateForbiddenResponse()
    {
        return new
        {
            success = false,
            message = "Current user does not have permission to access this resource"
        };
    }

    public static object CreateNotFoundResponse(string message)
    {
        return new
        {
            success = false,
            message
        };
    }

    public static object CreateConflictResponse(string message)
    {
        return new
        {
            success = false,
            message
        };
    }

    public static object CreateMethodNotAllowedResponse()
    {
        return new
        {
            success = false,
            message = "HTTP method not allowed for this endpoint"
        };
    }

    public static object CreateUnprocessableEntityResponse(string message)
    {
        return new
        {
            success = false,
            message
        };
    }

    public static object CreateInternalServerErrorResponse()
    {
        return new
        {
            success = false,
            message = "An error occurred while processing your request. Please try again later."
        };
    }
}
