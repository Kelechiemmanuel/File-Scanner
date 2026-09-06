const express = require("express");
const router = express.Router();
const scanController = require("../controllers/scanController");
const { scanStream } = require("../controllers/scanStreamController");
const upload = require("../middleware/upload");

router.post("/scan", scanController.scan);

router.post(
    "/scan/upload",
    upload.array("files", 5000),
    scanController.scanUpload
);

router.get("/scan/stream", scanStream);

module.exports = router;