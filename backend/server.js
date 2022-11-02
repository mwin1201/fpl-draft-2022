const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

const PORT = 5000;
const app = express();

app.use(cors());
const corsOptions = {
    origin: "http://localhost:3000"
};

// this section is the endpoint to gather the team names and players in the FPL Draft league
const leagueDetailsEndpoint = "https://draft.premierleague.com/api/league/18161/details";

app.get('/getTeams', cors(corsOptions), async (req, res) => {
    const fetchOptions = {
        method: "GET"
    }
    const response = await fetch(leagueDetailsEndpoint, fetchOptions);
    const jsonResponse = await response.json();
    res.json(jsonResponse);
});

// this section is the endpoint to get all the players in the Premier League
const premPlayersEndpoint = "https://draft.premierleague.com/api/bootstrap-static";

app.get('/getPremPlayers', cors(corsOptions), async (req, res) => {
    const fetchOptions = {
        method: "GET"
    }
    const response = await fetch(premPlayersEndpoint, fetchOptions);
    const jsonResponse = await response.json();
    res.json(jsonResponse);
})


app.listen(PORT, () => {
    console.log(`FPL app listening at http://localhost:${PORT}`);
});