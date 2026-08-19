const path = require("path");
const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");
const dotenv = require("dotenv").config();
const sequelize = require("./config/connection");

const PORT = process.env.PORT || 5000;
const app = express();
const inProduction = process.env.NODE_ENV === "production";

app.use(cors());
const corsOptions = {
    origin: inProduction ? process.env.REACT_APP_prodOrigin : "http://localhost:3000"
};

const session = require("express-session");
const SequelizeStore = require("connect-session-sequelize")(session.Store);

const sess = {
    secret: process.env.SESSION_SECRET || "FPL Secret",
    cookie: {
        httpOnly: true,
        // Only mark the cookie "secure" (HTTPS-only) in production, otherwise
        // it would never be set over http://localhost during development.
        secure: inProduction,
        sameSite: "lax",
    },
    resave: false,
    saveUninitialized: true,
    store: new SequelizeStore({
        db: sequelize
    })
};

if (inProduction) {
    // Trust the hosting provider's TLS-terminating proxy so that `secure`
    // session cookies are set correctly behind it.
    app.set("trust proxy", 1);
}

app.use(session(sess));
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(require("./controllers"));

const db = require("./models");
sequelize.sync();

const fetchRetry = (url, options, retries = 3, backoff = 300) => {
    const retryCodes = [502];
    return fetch (url, options)
        .then(response => {
            if (response.ok) {
                const jsonResponse = response.json();
                return jsonResponse;
            }
            if (retries > 0 && retryCodes.includes(response.status)) {
                setTimeout(() => {
                    return fetchRetry(url, options, retries - 1, backoff * 2)
                }, backoff)
            } else {
                throw new Error(response);
            }
        })
        .catch(console.error);
};

// Only serve the built React SPA in production. In development the frontend is
// served separately by Vite (http://localhost:3000), so there is no build to
// serve here and this catch-all would otherwise 500 on a missing index.html.
if (inProduction) {
    app.use(express.static(path.join(__dirname, "../fpl_app_frontend/build")));

    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../fpl_app_frontend/build/index.html"));
    });
}

app.listen(PORT, '0.0.0.0', (err) => {
    if (err) throw err;
    console.log(`FPL app listening at port: ${PORT}`);
});
