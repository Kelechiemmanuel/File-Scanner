
// controllers/scanController.js
// Receives the request, calls the models in the right order, sends the response.
// Accepts EITHER a local folder path (targetDir) — used for local/defense demos —
// OR a public GitHub repo URL (repoUrl) — used for the public-facing version.


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

module.exports = { scan };