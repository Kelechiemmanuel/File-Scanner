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

    "Database connection string": {
        description:
            "A database connection string containing credentials appears to be exposed.",
        recommendation:
            "Remove the credentials from the source code, rotate them, and store the connection string securely."
    },

    "Environment file not excluded": {
        description:
            "An environment file containing potentially sensitive configuration is not excluded from Git.",
        recommendation:
            "Add the environment file to .gitignore and make sure sensitive credentials are not committed."
    }
};

export default ruleDescription;