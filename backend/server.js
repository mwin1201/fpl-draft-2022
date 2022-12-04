const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");
const bodyParser = require("body-parser");

const PORT = process.env.PORT || 5000;
const app = express();

app.use(bodyParser.json());
app.use(cors());
// const corsOptions = {
//     origin: process.env.prodOrigin ? process.env.NODE_ENV == 'production' : "http://localhost:3000"
// };

// this section is the endpoint to gather the team names and players in the FPL Draft league
const leagueDetailsEndpoint = "https://draft.premierleague.com/api/league/18161/details";

app.get('/getTeams', async (req, res) => {
    const fetchOptions = {
        method: "GET"
    };
    console.log("i am in API call");
    const response = await fetch(leagueDetailsEndpoint, fetchOptions);
    const jsonResponse = await response.json();
    res.json(jsonResponse);
});

// this section is the endpoint to get all the players in the Premier League
const premPlayersEndpoint = "https://draft.premierleague.com/api/bootstrap-static";

app.get('/getPremPlayers', async (req, res) => {
    const fetchOptions = {
        method: "GET"
    };
    const response = await fetch(premPlayersEndpoint, fetchOptions);
    const jsonResponse = await response.json();
    res.json(jsonResponse);
});

// this section is the endpoint to grab each of the FPL league player team lineups

app.get('/getLineups/:team/:event', async (req, res) => {
    const fetchOptions = {
        method: "GET"
    };
    const response = await fetch("https://draft.premierleague.com/api/entry/"+ req.params.team +"/event/"+ req.params.event)
    const jsonResponse = await response.json();
    res.json(jsonResponse);

});

// this section is the endpoint for draft data
const draftDataEndpoint = "https://draft.premierleague.com/api/draft/18161/choices";

app.get('/getDraftData', async (req, res) => {
    const fetchOptions = {
        method: "GET"
    };
    const response = await fetch(draftDataEndpoint, fetchOptions);
    const jsonResponse = await response.json();
    res.json(jsonResponse);
});

// this section is the endpoint for player stats each gameweek
app.get("/getStats/:event", async (req, res) => {
    const fetchOptions = {
        method: "GET"
    };
    const response = await fetch("https://draft.premierleague.com/api/event/" + req.params.event + "/live");
    const jsonResponse = await response.json();
    res.json(jsonResponse);
});

// this section is the endpoint to get the current gameweek
const gameweekEndpoint = "https://draft.premierleague.com/api/game";

app.get("/getGameweek", async (req, res) => {
    const fetchOptions = {
        method: "GET"
    };
    const response = await fetch(gameweekEndpoint, fetchOptions);
    const jsonResponse = await response.json();
    res.json(jsonResponse);
});

app.listen(PORT, '0.0.0.0', (err) => {
    if (err) throw err;
    console.log(`FPL app listening at port: ${PORT}`);
});