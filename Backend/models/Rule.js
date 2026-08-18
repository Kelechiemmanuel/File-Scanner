
//Defines every detection that the auditor checks for
//Pure data + matching logic — no knowledge of files, requests, or responses.

const RULES = [
    {
        name: "Generic API key",
        regex: /(api[_-]?key|apikey)\s*[:=]\s*['"][A-Za-z0-9_\-]{16,}['"]/gi,
        severity: "HIGH"
    },
    {
        name: "Hardcoded password",
        regex: /(password|pwd|pass)\s*[:=]\s*['"].{4,}['"]/gi,
        severity: "HIGH"
    },
    {
        name: "AWS Access Key",
        regex: /AKIA[0-9A-Z]{16}/g,
        severity: "CRITICAL"
    },
    {
        name: "Generic secret/token",
        regex: /(secret|token)\s*[:=]\s*['"][A-Za-z0-9_\-]{16,}['"]/gi,
        severity: "HIGH"
    },
    {
        name: "Database connection string with credentials",
        regex: /(mongodb|postgres|mysql):\/\/[^:\s]+:[^@\s]+@/gi,
        severity: "CRITICAL"
    },
    {
        name: "CORS allows all origins",
        regex: /origin\s*:\s*(['"]\*['"]|true)/gi,
        severity: "HIGH"
    },
    {
        name: "Debug mode enabled",
        regex: /debug\s*:\s*true/gi,
        severity: "MEDIUM"
    },
    {
        name: "Insecure cookie/session setting",
        regex: /secure\s*:\s*false/gi,
        severity: "MEDIUM"
    },
    {
        name: "Session/cookie secret hardcoded as weak default",
        regex: /secret\s*:\s*['"](keyboard cat|secret|changeme|mysecret)['"]/gi,
        severity: "HIGH"
    },
];

function matchLine(line) {
    const matches = []
    for (const rule of RULES) {
        rule.regex.lastIndex = 0 //resets global regex state between line
        if (rule.regex.test(line)) {
            matches.push({
                name: rule.name,
                severity: rule.severity
            })
            break // one match per line is enough — stop checking remaining rules
        }
    }
    return matches
}

module.exports = { RULES, matchLine }