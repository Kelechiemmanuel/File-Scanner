/**
 * controllers/scanController.js
 * Receives the request, calls the models in the right order, sends the response.
 * Equivalent role to LibraryManager in the SLCAS project — a coordinating facade,
 * not where the actual logic lives.
 */

const fs = require("fs");
const { walk } = require("../models/FileWalker");
const { checkEnvExclusion } = require("../models/EnvChecker");
const { scanAll } = require("../models/SecretScanner");
const { sortBySeverity } = require("../models/Finding");
const reportView = require("../views/reportView");

function scan(req, res) {
    const { targetDir } = req.body;

    if (!targetDir || typeof targetDir !== "string") {
        return res.status(400).json({ error: "targetDir is required in the request body." });
    }
    if (!fs.existsSync(targetDir) || !fs.statSync(targetDir).isDirectory()) {
        return res.status(400).json({ error: "That folder path doesn't exist on the server." });
    }

    try {
        const files = walk(targetDir);
        const envCheck = checkEnvExclusion(targetDir, files);
        const secretFindings = scanAll(files, envCheck.unexcludedEnvFiles);
        const allFindings = sortBySeverity([...secretFindings, ...envCheck.findings]);

        return res.json(reportView.toJSON(targetDir, allFindings));
    } catch (err) {
        return res.status(500).json({ error: "Scan failed", details: err.message });
    }
}

module.exports = { scan };