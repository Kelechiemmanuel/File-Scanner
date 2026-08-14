
//Entry point. Sets up Express, wires in the routes, starts listening.

const express = require("express");
const cors = require("cors");
const scanRoutes = require("./routes/scanRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use("/api", scanRoutes);

app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
});

app.listen(PORT, () => {
    console.log(`Security auditor backend running on http://localhost:${PORT}`);
});