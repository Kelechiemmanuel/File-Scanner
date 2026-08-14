
function severityClass(severity) {
  return severity.toLowerCase();
}

export function exportReportAsHtml(result) {
  const { scannedFolder, summary, findings } = result;

  const rows = findings
    .map(
      (f) => `
      <tr class="sev-${severityClass(f.severity)}">
        <td>${f.severity}</td>
        <td>${f.rule}</td>
        <td>${f.file}:${f.line}</td>
        <td><code>${f.snippet.replace(/</g, "&lt;")}</code></td>
      </tr>`
    ).join("");

  const html = `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><title>Security Audit Report</title>
<style>
  body { font-family: sans-serif; margin: 24px; }
  h1 { font-size: 20px; }
  .summary { display: flex; gap: 12px; margin: 16px 0; }
  .summary div { background: #f4f4f4; border-radius: 8px; padding: 12px 16px; font-size: 13px; }
  table { border-collapse: collapse; width: 100%; margin-top: 16px; }
  th, td { border: 1px solid #ddd; padding: 8px; text-align: left; font-size: 13px; }
  th { background: #f4f4f4; }
  .sev-critical { background: #ffe1e1; }
  .sev-high { background: #fff1e0; }
  .sev-medium { background: #fffbe0; }
</style></head>
<body>
  <h1>Automated Code Security Auditor - Report</h1>
  <p>Scanned folder: ${scannedFolder}</p>
  <div class="summary">
    <div>Total: ${summary.total}</div>
    <div>Critical: ${summary.critical}</div>
    <div>High: ${summary.high}</div>
    <div>Medium: ${summary.medium}</div>
  </div>
  <table>
    <tr><th>Severity</th><th>Rule</th><th>Location</th><th>Snippet</th></tr>
    ${rows}
  </table>
</body></html>`;

  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "audit-report.html";
  link.click();
  URL.revokeObjectURL(url);
}