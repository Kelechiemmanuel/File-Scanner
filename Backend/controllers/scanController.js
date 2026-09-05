// controllers/scanController.js
// Receives the request, calls the models in the right order, sends the response.
// Accepts EITHER a local folder path (targetDir) — used for local/defense demos —
// OR a public GitHub repo URL (repoUrl) — used for the public-facing version.

const os = require("os");
const path = require("path");
const crypto = require("crypto");
const fs = require("fs");
const { walk } = require("../models/FileWalker");
const { checkEnvExclusion } = require("../models/EnvChecker");
const { scanAll } = require("../models/SecretScanner");
const { checkContent } = require("../models/InputValidationChecker");
const { checkDependencies } = require("../models/DependencyChecker");
const { sortBySeverity } = require("../models/Finding");
const { cloneRepo, cleanupClone } = require("../models/RepoCloner");
const reportView = require("../views/reportView");

function runInputValidationCheck(files) {
    let findings = [];
    for (const file of files) {
        try {
            const content = fs.readFileSync(file, "utf8");
            findings = findings.concat(checkContent(file, content));
        } catch {
            // unreadable/binary file — skip it rather than fail the whole scan
        }
    }
    return findings;
}

async function runScan(dirToScan) {
    const files = walk(dirToScan);
    const envCheck = checkEnvExclusion(dirToScan, files);
    const secretFindings = scanAll(files, envCheck.unexcludedEnvFiles);
    const inputValidationFindings = runInputValidationCheck(files);
    const dependencyFindings = await checkDependencies(dirToScan);
    return sortBySeverity([
        ...secretFindings,
        ...envCheck.findings,
        ...inputValidationFindings,
        ...dependencyFindings,
    ]);
}

// Strips the temp/root folder from every finding's file path, so reports
// always show a clean relative path (e.g. "backend/main.js") regardless of
// whether the scan came from a local path, a cloned repo, or an upload.
function makeRelative(rootDir, findings) {
    return findings.map((f) => ({
        ...f,
        file: path.relative(rootDir, f.file).split(path.sep).join("/"),
    }));
}

async function scan(req, res) {
    const { targetDir, repoUrl } = req.body;

    if (!targetDir && !repoUrl) {
        return res.status(400).json({ error: "Provide either targetDir (local path) or repoUrl (GitHub URL)." });
    }

    // Local folder path — used for local demos, same behavior as before.
    if (targetDir) {
        if (!fs.existsSync(targetDir) || !fs.statSync(targetDir).isDirectory()) {
            return res.status(400).json({ error: "That folder path doesn't exist on the server." });
        }
        try {
            const rawFindings = await runScan(targetDir);
            const allFindings = makeRelative(targetDir, rawFindings);
            return res.json(reportView.toJSON(targetDir, allFindings));
        } catch (err) {
            return res.status(500).json({ error: "Scan failed", details: err.message });
        }
    }

    // GitHub repo URL — clone into a temp folder, scan it, then always clean up.
    let tempDir;
    try {
        tempDir = await cloneRepo(repoUrl);
        const rawFindings = await runScan(tempDir);
        const allFindings = makeRelative(tempDir, rawFindings);
        return res.json(reportView.toJSON(repoUrl, allFindings));
    } catch (err) {
        return res.status(400).json({ error: err.message });
    } finally {
        cleanupClone(tempDir);
    }
}

async function scanUpload(req, res) {
    let tempDir;

    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                error: "No project files were uploaded."
            });
        }

        tempDir = path.join(
            os.tmpdir(),
            `auditor-upload-${crypto.randomUUID()}`
        );

        fs.mkdirSync(tempDir, { recursive: true });

        for (const file of req.files) {
            const relativePath = file.originalname;

            // Prevent paths from escaping the temporary directory.
            const safePath = path.normalize(relativePath);

            if (
                safePath.startsWith("..") ||
                path.isAbsolute(safePath)
            ) {
                continue;
            }

            const destination = path.join(tempDir, safePath);

            fs.mkdirSync(path.dirname(destination), {
                recursive: true
            });

            fs.writeFileSync(destination, file.buffer);
        }

        const rawFindings = await runScan(tempDir);
        const allFindings = makeRelative(tempDir, rawFindings);

        return res.json(
            reportView.toJSON("Uploaded project", allFindings)
        );

    } catch (err) {
        return res.status(500).json({
            error: "Upload scan failed",
            details: err.message
        });

    } finally {
        if (
            tempDir &&
            tempDir.startsWith(os.tmpdir()) &&
            fs.existsSync(tempDir)
        ) {
            fs.rmSync(tempDir, {
                recursive: true,
                force: true
            });
        }
    }
}

module.exports = { scan, scanUpload };