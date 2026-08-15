const multer = require("multer");

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        files: 5000,
        fileSize: 10 * 1024 * 1024
    }
});

module.exports = upload;