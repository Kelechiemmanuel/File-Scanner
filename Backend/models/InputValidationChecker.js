/**
 * models/InputValidationChecker.js
 * Flags request-handler-shaped functions that read req.body/req.query/req.params
 * (either directly or via destructuring) without any visible validation nearby.
 * Works on both route files (router.post(...)) AND controller files that export
 * an (req, res) handler separately from where the route is registered.
 */

const { createFinding } = require("./Finding");

const VALIDATION_INDICATORS = [
    /express-validator/i,
    /\bjoi\b/i,
    /\byup\b/i,
    /\bzod\b/i,
    /\.trim\(\)/,
    /\btypeof\s+req\./,
    /validationResult\s*\(/,
];

// Dot access: req.body.email
const DOT_ACCESS_PATTERN = /req\.(body|query|params)\.[A-Za-z_][A-Za-z0-9_]*/;
// Destructuring: const { email, password } = req.body;
const DESTRUCTURE_PATTERN = /(?:const|let|var)\s*\{[^}]*\}\s*=\s*req\.(body|query|params)/;

// Either a route registration (router.post(...)) OR a request-handler function
// signature ((req, res) => or function(req, res) or async (req, res) =>).
const ROUTE_OR_HANDLER_PATTERN = /(router|app)\.(get|post|put|patch|delete)\s*\(|\(\s*req\s*,\s*res/i;

function isCommentLine(trimmedLine) {
    return trimmedLine.startsWith("//") || trimmedLine.startsWith("*") || trimmedLine.startsWith("/*");
}

function checkContent(displayPath, content) {
    if (!ROUTE_OR_HANDLER_PATTERN.test(content)) return [];
    if (VALIDATION_INDICATORS.some((pattern) => pattern.test(content))) return [];

    const lines = content.split("\n");
    const findings = [];

    lines.forEach((line, index) => {
        const trimmed = line.trim();
        if (isCommentLine(trimmed)) return;

        if (DOT_ACCESS_PATTERN.test(line) || DESTRUCTURE_PATTERN.test(line)) {
            findings.push(
                createFinding({
                    file: displayPath,
                    line: index + 1,
                    rule: "Possible missing input validation",
                    severity: "MEDIUM",
                    snippet: trimmed.slice(0, 100),
                })
            );
        }
    });

    return findings;
}

module.exports = { checkContent };