
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
const { sortBySeverity } = require("../models/Finding");
const { cloneRepo, cleanupClone } = require("../models/RepoCloner");
const reportView = require("../views/reportView");

async function runScan(dirToScan) {
    const files = walk(dirToScan);
    const envCheck = checkEnvExclusion(dirToScan, files);
    const secretFindings = scanAll(files, envCheck.unexcludedEnvFiles);
    return sortBySeverity([...secretFindings, ...envCheck.findings]);
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
            const allFindings = await runScan(targetDir);
            return res.json(reportView.toJSON(targetDir, allFindings));
        } catch (err) {
            return res.status(500).json({ error: "Scan failed", details: err.message });
        }
    }

    // GitHub repo URL — clone into a temp folder, scan it, then always clean up.
    let tempDir;
    try {
        tempDir = await cloneRepo(repoUrl);
        const allFindings = await runScan(tempDir);
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

        const allFindings = await runScan(tempDir);

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