const path = require("path");
const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");
const dotenv = require("dotenv").config();
const sequelize = require("./config/connection");
//const bodyParser = require("body-parser");

const PORT = process.env.PORT || 5001;
const app = express();

//app.use(bodyParser.json());
app.use(cors());
const corsOptions = {
    origin: process.env.NODE_ENV == 'production' ? process.env.REACT_APP_prodOrigin : "http://localhost:3000"
};

const session = require("express-session");
const SequelizeStore = require("connect-session-sequelize")(session.Store);

const sess = {
    secret: "FPL Secret",
    cookie: {},
    resave: false,
    saveUninitialized: true,
    store: new SequelizeStore({
        db: sequelize
    })
};

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

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname,"../fpl_app_frontend/build")));
}

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../fpl_app_frontend/build/index.html"));
});

app.listen(PORT, '0.0.0.0', (err) => {
    if (err) throw err;
    console.log(`FPL app listening at port: ${PORT}`);
});