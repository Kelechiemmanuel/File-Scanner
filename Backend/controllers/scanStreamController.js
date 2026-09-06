// controllers/scanStreamController.js
//
// Streams scan progress over Server-Sent Events instead of returning
// one big JSON response at the end. The frontend listens with
// EventSource and appends findings as they arrive.
//
// Adjust the imports below to match your actual model/service paths.

const FileWalker = require("../models/FileWalker");
const SecretScanner = require("../models/SecretScanner");
const EnvChecker = require("../models/EnvChecker");

function sendEvent(res, event, data) {
    res.write(`event: ${event}\n`);
    res.write(`data: ${JSON.stringify(data)}\n\n`);
}

async function scanStream(req, res) {
    const { targetPath } = req.query; // or wherever you resolve the repo/local path from

    res.writeHead(200, {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
        // If frontend is on a different origin, also set CORS headers here.
    });

    // Keep the connection alive through proxies that kill idle sockets.
    const heartbeat = setInterval(() => res.write(": ping\n\n"), 15000);

    req.on("close", () => {
        clearInterval(heartbeat);
    });

    try {
        const walker = new FileWalker(targetPath);
        const scanners = [new SecretScanner(), new EnvChecker()];

        let findingId = 0;

        for await (const file of walker.walk()) {
            sendEvent(res, "file", { path: file.relativePath });

            for (const scanner of scanners) {
                const results = await scanner.scan(file);

                for (const result of results) {
                    findingId += 1;
                    sendEvent(res, "finding", {
                        id: findingId,
                        file: file.relativePath,
                        severity: result.severity,
                        rule: result.rule,
                        line: result.line,
                        message: result.message,
                        snippet: result.snippet,
                    });
                }
            }
        }

        sendEvent(res, "done", { totalFiles: walker.fileCount });
    } catch (err) {
        sendEvent(res, "error", { message: err.message });
    } finally {
        clearInterval(heartbeat);
        res.end();
    }
}

module.exports = { scanStream };