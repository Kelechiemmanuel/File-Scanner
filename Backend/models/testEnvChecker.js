const { checkEnvExclusion } = require('./EnvChecker');
const { walk } = require('./FileWalker');

const targetDir = 'C:\\Users\\USER\\OneDrive\\Desktop\\KelsBooking';
const files = walk(targetDir);
const result = checkEnvExclusion(targetDir, files);

console.log(result);