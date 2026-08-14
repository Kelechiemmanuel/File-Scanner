
//Verifies that any .env file in the project is excluded from Git via .gitignore.

const fs = require("fs");
const path = require("path");
const { createFinding } = require("./Finding");

function isEnvExcluded(gitignorePath) {
    if (!fs.existsSync(gitignorePath)) return false;
    const content = fs.readFileSync(gitignorePath, "utf8");
    return content
        .split("\n")
        .map((line) => line.trim())
        .some((line) => line === ".env" || line === "*.env" || line === ".env*");
}

function checkEnvExclusion(targetDir, allFiles) {
    const findings = [];
    const unexcludedEnvFiles = new Set();
    const envFiles = allFiles.filter((f) => path.basename(f) === ".env");

    for (const envFile of envFiles) {
        const envDir = path.dirname(envFile);
        const localGitignore = path.join(envDir, ".gitignore");
        const rootGitignore = path.join(targetDir, ".gitignore");

        const excluded = isEnvExcluded(localGitignore) || isEnvExcluded(rootGitignore);
        const anyGitignoreExists = fs.existsSync(localGitignore) || fs.existsSync(rootGitignore);

        if (!excluded) {
            unexcludedEnvFiles.add(envFile);
            findings.push(
                createFinding({
                    file: envFile,
                    line: 1,
                    rule: anyGitignoreExists
                        ? ".env file not excluded in .gitignore"
                        : ".env file exists but no .gitignore found",
                    severity: "CRITICAL",
                    snippet: "Add .env to your .gitignore to prevent committing secrets to version control.",
                })
            );
        }
    }

    return { findings, unexcludedEnvFiles };
}

module.exports = { checkEnvExclusion, isEnvExcluded };