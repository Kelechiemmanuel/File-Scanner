/**
 * models/FileWalker.js
 * Optimized Native Asynchronous Implementation
 */

const fs = require("fs/promises");
const path = require("path");

const SCAN_EXTENSIONS = new Set([".js", ".ts", ".env", ".json"]);
const SKIP_DIRS = new Set(["node_modules", ".git", "dist", "build"]);
const SKIP_FILES = new Set(["package-lock.json", "yarn.lock", "pnpm-lock.yaml"]);
const MAX_FILE_SIZE = 500 * 1024; // 500KB

async function walk(dir) {
    let files = [];

    try {
        const entries = await fs.readdir(dir, { withFileTypes: true });

        const tasks = entries.map(async (entry) => {
            const fullPath = path.join(dir, entry.name);

            if (entry.isDirectory()) {
                if (!SKIP_DIRS.has(entry.name)) {
                    return await walk(fullPath);
                }
                return [];
            }

            const ext = path.extname(entry.name);
            const isMatch = SCAN_EXTENSIONS.has(ext) || entry.name === ".env";

            if (isMatch && !SKIP_FILES.has(entry.name)) {
                // Stat asynchronously
                const stats = await fs.stat(fullPath);
                if (stats.size <= MAX_FILE_SIZE) {
                    return [fullPath];
                }
            }

            return [];
        });

        const results = await Promise.all(tasks);
        files = results.flat();
    } catch (err) {
        // Handle unreadable directories gracefully
    }

    return files;
}

module.exports = { walk };