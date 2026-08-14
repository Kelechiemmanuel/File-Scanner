const { createFinding, sortBySeverity } = require('./Finding');

const a = createFinding({ file: 'test.js', line: 3, rule: 'Debug mode enabled', severity: 'MEDIUM', snippet: 'debug: true' });
const b = createFinding({ file: 'test.js', line: 5, rule: 'AWS Access Key', severity: 'CRITICAL', snippet: 'AKIA...' });
const c = createFinding({ file: 'test.js', line: 8, rule: 'Generic API key', severity: 'HIGH', snippet: 'apiKey = ...' });

console.log(sortBySeverity([a, b, c]));