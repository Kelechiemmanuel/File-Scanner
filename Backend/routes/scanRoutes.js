const express = require("express");
const router = express.Router();
const scanController = require("../controllers/scanController");
const upload = require("../middleware/upload");

router.post("/scan", scanController.scan);

router.post(
    "/scan/upload",
    upload.array("files", 5000),
    scanController.scanUpload
);

module.exports = router;