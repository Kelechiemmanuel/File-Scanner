/**
 * routes/scanRoutes.js
 * Maps HTTP routes to controller functions. No logic lives here.
 */

const express = require("express");
const router = express.Router();
const scanController = require("../controllers/scanController");

router.post("/scan", scanController.scan);

module.exports = router;