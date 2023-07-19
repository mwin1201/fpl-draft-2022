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

// // this section is the endpoint to gather the team names and players in the FPL Draft league
// app.get('/getTeams/:leagueID', async (req, res) => {
//     const fetchOptions = {
//         method: "GET"
//     };
//     //const leagueDetailsEndpoint = "https://draft.premierleague.com/api/league/18161/details";
//     const response = await fetch("https://draft.premierleague.com/api/league/" + req.params.leagueID + "/details", fetchOptions);
//     const jsonResponse = await response.json();
//     res.json(jsonResponse);
// });

// // this section is the endpoint to get all the players in the Premier League
// const premPlayersEndpoint = "https://draft.premierleague.com/api/bootstrap-static";

// app.get('/getPremPlayers', async (req, res) => {
//     const fetchOptions = {
//         method: "GET"
//     };
//     const response = await fetch(premPlayersEndpoint, fetchOptions);
//     const jsonResponse = await response.json();
//     res.json(jsonResponse);
// });

// // this section is the endpoint to grab each of the FPL league player team lineups

// app.get('/getLineups/:team/:event', async (req, res) => {
//     const fetchOptions = {
//         method: "GET"
//     };
//     let response;
//     try {
//         response = await fetch("https://draft.premierleague.com/api/entry/"+ req.params.team +"/event/"+ req.params.event, fetchOptions);
//     } catch (error) {
//         console.log("Error: ", error);
//     }

//     if (response?.ok) {
//         const jsonResponse = await response.json();
//         res.json(jsonResponse);
//     } else {
//         console.log(`Response code: ${response?.status}`);
//         const response = fetchRetry("https://draft.premierleague.com/api/entry/"+ req.params.team +"/event/"+ req.params.event, fetchOptions);
//         res.json(response);
//     }

// });

// // this section is the endpoint for draft data
// const draftDataEndpoint = "https://draft.premierleague.com/api/draft/18161/choices";

// app.get('/getDraftData', async (req, res) => {
//     const fetchOptions = {
//         method: "GET"
//     };
//     const response = await fetch(draftDataEndpoint, fetchOptions);
//     const jsonResponse = await response.json();
//     res.json(jsonResponse);
// });

// // this section is the endpoint for player stats and fixture data each gameweek
// app.get("/getStats/:event", async (req, res) => {
//     const fetchOptions = {
//         method: "GET"
//     };
//     const response = await fetch("https://draft.premierleague.com/api/event/" + req.params.event + "/live", fetchOptions);
//     const jsonResponse = await response.json();
//     res.json(jsonResponse);
// });

// // this section is the endpoint to get the current gameweek
// const gameweekEndpoint = "https://draft.premierleague.com/api/game";

// app.get("/getGameweek", async (req, res) => {
//     const fetchOptions = {
//         method: "GET"
//     };
//     const response = await fetch(gameweekEndpoint, fetchOptions);
//     const jsonResponse = await response.json();
//     res.json(jsonResponse);
// });

// // this section is the endpoint to get the gameweek fixture outcomes
// app.get("/getFixtureData/:event", async (req, res) => {
//     const fetchOptions = {
//         method: "GET"
//     };
//     const response = await fetch("https://fantasy.premierleague.com/api/fixtures/?event=" + req.params.event, fetchOptions);
//     const jsonResponse = await response.json();
//     res.json(jsonResponse);
// });

// // this section is the endpoint to get team transaction stats
// app.get("/getTransactions/:teamId", async (req, res) => {
//     const fetchOptions = {
//         method: "GET"
//     };
//     const response = await fetch("https://draft.premierleague.com/api/entry/" + req.params.teamId + "/public", fetchOptions);
//     const jsonResponse = await response.json();
//     res.json(jsonResponse);
// });

app.listen(PORT, '0.0.0.0', (err) => {
    if (err) throw err;
    console.log(`FPL app listening at port: ${PORT}`);
});