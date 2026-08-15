/**
 * models/RepoCloner.js
 * Clones a public GitHub repo into a temporary folder so it can be scanned
 * like any local project, then provides a way to clean that folder up afterward.
 */

const fs = require("fs");
const os = require("os");
const path = require("path");
const crypto = require("crypto");
const simpleGit = require("simple-git");

const GITHUB_URL_PATTERN = /^https:\/\/github\.com\/[\w.-]+\/[\w.-]+(\.git)?\/?$/;

function isValidGithubUrl(url) {
    return typeof url === "string" && GITHUB_URL_PATTERN.test(url.trim());
}

async function cloneRepo(repoUrl) {
    if (!isValidGithubUrl(repoUrl)) {
        throw new Error("That doesn't look like a valid public GitHub repo URL.");
    }

    const tempDir = path.join(os.tmpdir(), `auditor-${crypto.randomUUID()}`);
    // GIT_TERMINAL_PROMPT: 0 stops git from hanging indefinitely waiting for
    // credentials on a private/nonexistent repo — it fails immediately instead.
    const git = simpleGit().env({ GIT_TERMINAL_PROMPT: "0" });

    try {
        await git.clone(repoUrl, tempDir, ["--depth", "1"]);
    } catch (err) {
        throw new Error("Could not clone that repository. Check that the URL is correct and the repo is public.");
    }

    return tempDir;
}

function cleanupClone(tempDir) {
    // Only ever delete folders we created under the OS temp directory —
    // an extra safety check so this can never be pointed at a real project folder.
    if (tempDir && tempDir.startsWith(os.tmpdir()) && fs.existsSync(tempDir)) {
        fs.rmSync(tempDir, { recursive: true, force: true });
    }
}

module.exports = { isValidGithubUrl, cloneRepo, cleanupClone };