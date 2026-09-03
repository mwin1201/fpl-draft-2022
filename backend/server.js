const path = require("path");
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const PORT = process.env.PORT || 5000;
const app = express();
const inProduction = process.env.NODE_ENV === "production";

// Stateless FPL API proxy. No database, no sessions, no auth. The frontend is a
// static site; this server exists only to relay requests to the official FPL
// API, which does not send CORS headers and so cannot be called from a browser.
const corsOptions = {
    origin: inProduction ? process.env.REACT_APP_prodOrigin : "http://localhost:3000"
};

if (inProduction) {
    // Trust a TLS-terminating proxy when hosted behind one.
    app.set("trust proxy", 1);
}

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(require("./controllers"));

// Optionally serve the built static frontend when co-hosted with this proxy.
if (inProduction) {
    app.use(express.static(path.join(__dirname, "../fpl_app_frontend/build")));

    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../fpl_app_frontend/build/index.html"));
    });
}

app.listen(PORT, "0.0.0.0", (err) => {
    if (err) throw err;
    console.log(`FPL proxy listening at port: ${PORT}`);
});

module.exports = app;
