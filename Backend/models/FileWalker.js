/**
 * models/FileWalker.js
 * Walks a project directory and returns the list of files worth scanning.
 */

const fs = require("fs");
const path = require("path");

const SCAN_EXTENSIONS = [".js", ".ts", ".env", ".json"];
const SKIP_DIRS = new Set(["node_modules", ".git", "dist", "build"]);

function walk(dir, files = []) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        if (entry.isDirectory()) {
            if (!SKIP_DIRS.has(entry.name)) walk(path.join(dir, entry.name), files);
        } else if (SCAN_EXTENSIONS.includes(path.extname(entry.name)) || entry.name === ".env") {
            files.push(path.join(dir, entry.name));
        }
    }
    return files;
}

module.exports = { walk };