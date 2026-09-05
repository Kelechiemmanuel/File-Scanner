const ruleDescription = {
    "Generic API key": {
        description:
            "An API key appears to be hardcoded in the project and may be exposed to unauthorized users.",
        recommendation:
            "Move the API key into an environment variable or secrets manager and rotate the exposed key."
    },

    "Hardcoded password": {
        description:
            "A password appears to be stored directly in the source code.",
        recommendation:
            "Remove the password from the source code, rotate it, and store it securely."
    },

    "AWS Access Key": {
        description:
            "An AWS access key appears to be present in the project and could provide unauthorized access to AWS resources.",
        recommendation:
            "Rotate the exposed key immediately and use secure environment variables or IAM roles."
    },

    "Generic secret/token": {
        description:
            "A secret or authentication token appears to be hardcoded in the project.",
        recommendation:
            "Move the secret into an environment variable or secure secrets manager."
    },

    "Database connection string with credentials": {
        description:
            "A database connection string containing credentials appears to be exposed.",
        recommendation:
            "Remove the credentials from the source code, rotate them, and store the connection string securely."
    },

    "CORS allows all origins": {
        description:
            "This configuration allows requests from any origin, which can expose the application to cross-origin attacks.",
        recommendation:
            "Restrict CORS to a specific list of trusted origins instead of allowing all (*)."
    },

    "Debug mode enabled": {
        description:
            "Debug mode is enabled, which can expose internal application details, stack traces, or sensitive data to users.",
        recommendation:
            "Disable debug mode in production and enable it only in local development environments."
    },

    "Insecure cookie/session setting": {
        description:
            "A cookie or session is configured without the secure flag, meaning it could be transmitted over an unencrypted connection.",
        recommendation:
            "Set the secure flag on cookies/sessions so they are only sent over HTTPS."
    },

    "Session/cookie secret hardcoded as weak default": {
        description:
            "The session or cookie secret is set to a well-known default value, making sessions easy to forge.",
        recommendation:
            "Replace the default secret with a strong, randomly generated value stored in an environment variable."
    },

    ".env file not excluded in .gitignore": {
        description:
            "An environment file containing potentially sensitive configuration is not excluded from Git.",
        recommendation:
            "Add the environment file to .gitignore and make sure sensitive credentials are not committed."
    },

    ".env file exists but no .gitignore found": {
        description:
            "An environment file containing potentially sensitive configuration exists, but the project has no .gitignore to exclude it.",
        recommendation:
            "Create a .gitignore file and add the environment file to it before committing any code."
    },

    "Possible missing input validation": {
        description:
            "User input from the request (body, query, or URL parameters) is used directly without any visible validation, which can allow malformed or malicious input to reach the application logic.",
        recommendation:
            "Validate and sanitize incoming request data using a library like express-validator, Joi, or Zod before using it."
    },

    "Dependency check could not complete": {
        description:
            "The dependency vulnerability check could not run successfully for this project, often because no package-lock.json exists yet, or the check couldn't reach the npm registry.",
        recommendation:
            "Run 'npm install' to generate a package-lock.json, ensure the server has network access, then re-run the scan."
    }
};

export default ruleDescription;