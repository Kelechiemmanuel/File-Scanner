
//Entry point. Sets up Express, wires in the routes, starts listening.

const express = require("express");
const cors = require("cors");
const scanRoutes = require("./routes/scanRoutes");

const app = express();
const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "https://file-scanner-dun.vercel.app"
];

const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());
app.use("/api", scanRoutes);

app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Security auditor backend running on http://localhost:${PORT}`);
});