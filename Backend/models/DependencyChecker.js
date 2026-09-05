/**
 * models/DependencyChecker.js
 * Runs `npm audit` against a project and turns known vulnerable dependencies
 * into findings. Unlike the other checks, this doesn't read file contents —
 * it runs a real subprocess and parses npm's own vulnerability database results.
 */

const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");
const { createFinding } = require("./Finding");

const NPM_SEVERITY_MAP = {
    critical: "CRITICAL",
    high: "HIGH",
    moderate: "MEDIUM",
    low: "MEDIUM",
    info: "MEDIUM",
};

function runNpmAudit(dirToScan) {
    return new Promise((resolve) => {
        exec(
            "npm audit --json",
            { cwd: dirToScan, timeout: 30000, maxBuffer: 10 * 1024 * 1024 },
            (err, stdout) => {
                if (!stdout) {
                    resolve({ failure: err ? err.message : "npm audit produced no output" });
                    return;
                }
                try {
                    const parsed = JSON.parse(stdout);
                    // npm audit can return valid JSON that ITSELF represents a failure —
                    // most commonly ENOLOCK, when there's no package-lock.json (e.g. a
                    // freshly cloned repo that's never had `npm install` run). Checking
                    // only for missing `vulnerabilities` would silently misreport this
                    // as "no vulnerabilities found", which is a false negative, not a
                    // clean result — so this has to be caught explicitly.
                    if (parsed.error) {
                        resolve({ failure: parsed.error.summary || "npm audit could not run" });
                        return;
                    }
                    resolve({ data: parsed });
                } catch (parseErr) {
                    resolve({ failure: "Could not parse npm audit output" });
                }
            }
        );
    });
}

async function checkDependencies(dirToScan) {
    const packageJsonPath = path.join(dirToScan, "package.json");

    if (!fs.existsSync(packageJsonPath)) {
        return [];
    }

    const result = await runNpmAudit(dirToScan);

    if (result.failure) {
        return [
            createFinding({
                file: "package.json",
                line: 1,
                rule: "Dependency check could not complete",
                severity: "MEDIUM",
                snippet: result.failure.slice(0, 150),
            }),
        ];
    }

    const vulnerabilities = result.data.vulnerabilities || {};
    const findings = [];

    for (const pkgName of Object.keys(vulnerabilities)) {
        const vuln = vulnerabilities[pkgName];
        const severity = NPM_SEVERITY_MAP[vuln.severity] || "MEDIUM";

        const firstAdvisory = Array.isArray(vuln.via)
            ? vuln.via.find((v) => typeof v === "object")
            : null;
        const title = firstAdvisory ? firstAdvisory.title : `Known vulnerability in ${pkgName}`;

        findings.push(
            createFinding({
                file: "package.json",
                line: 1,
                rule: `Vulnerable dependency: ${pkgName}`,
                severity,
                snippet: `${title} (affected range: ${vuln.range})`,
            })
        );
    }

    return findings;
}

module.exports = { checkDependencies };