const router = require("express").Router();
const fetch = require("node-fetch");

// this section is the endpoint to gather the team names and players in the FPL Draft league
router.get('/getTeams/:leagueID', async (req, res) => {
    const fetchOptions = {
        method: "GET"
    };
    //const leagueDetailsEndpoint = "https://draft.premierleague.com/api/league/18161/details";
    const response = await fetch("https://draft.premierleague.com/api/league/" + req.params.leagueID + "/details", fetchOptions);
    const jsonResponse = await response.json();
    res.json(jsonResponse);
});

// this section is the endpoint to get all the players in the Premier League
const premPlayersEndpoint = "https://draft.premierleague.com/api/bootstrap-static";

router.get('/getPremPlayers', async (req, res) => {
    const fetchOptions = {
        method: "GET"
    };
    const response = await fetch(premPlayersEndpoint, fetchOptions);
    const jsonResponse = await response.json();
    res.json(jsonResponse);
});

// this section is the endpoint to grab each of the FPL league player team lineups
router.get('/getLineups/:team/:event', async (req, res) => {
    const fetchOptions = {
        method: "GET"
    };
    let response;
    try {
        response = await fetch("https://draft.premierleague.com/api/entry/"+ req.params.team +"/event/"+ req.params.event, fetchOptions);
    } catch (error) {
        console.log("Error: ", error);
    }

    if (response?.ok) {
        const jsonResponse = await response.json();
        res.json(jsonResponse);
    } else {
        console.log(`Response code: ${response?.status}`);
        const response = fetchRetry("https://draft.premierleague.com/api/entry/"+ req.params.team +"/event/"+ req.params.event, fetchOptions);
        res.json(response);
    }

});

// this section is the endpoint for draft data
//const draftDataEndpoint = "https://draft.premierleague.com/api/draft/18161/choices";

router.get('/getDraftData/:leagueID', async (req, res) => {
    const fetchOptions = {
        method: "GET"
    };
    const response = await fetch("https://draft.premierleague.com/api/draft/" + req.params.leagueID + "/choices", fetchOptions);
    const jsonResponse = await response.json();
    res.json(jsonResponse);
});

// this section is the endpoint for player stats and fixture data each gameweek
router.get("/getStats/:event", async (req, res) => {
    const fetchOptions = {
        method: "GET"
    };
    const response = await fetch("https://draft.premierleague.com/api/event/" + req.params.event + "/live", fetchOptions);
    const jsonResponse = await response.json();
    res.json(jsonResponse);
});

// this section is the endpoint to get the current gameweek
const gameweekEndpoint = "https://draft.premierleague.com/api/game";

router.get("/getGameweek", async (req, res) => {
    const fetchOptions = {
        method: "GET"
    };
    const response = await fetch(gameweekEndpoint, fetchOptions);
    const jsonResponse = await response.json();
    res.json(jsonResponse);
});

// this section is the endpoint to get the gameweek fixture outcomes
router.get("/getFixtureData/:event", async (req, res) => {
    const fetchOptions = {
        method: "GET"
    };
    // Using fantasy endpoint instead of draft endpoint because we get fixture difficulty ratings this way
    const response = await fetch("https://fantasy.premierleague.com/api/fixtures/?event=" + req.params.event, fetchOptions);
    const jsonResponse = await response.json();
    res.json(jsonResponse);
});

// this section is the endpoint to get team transaction stats
router.get("/getTransactions/:teamId", async (req, res) => {
    const fetchOptions = {
        method: "GET"
    };
    const response = await fetch("https://draft.premierleague.com/api/entry/" + req.params.teamId + "/public", fetchOptions);
    const jsonResponse = await response.json();
    res.json(jsonResponse);
});

// this section is the endpoint to grab the weekly dream team
router.get("/getDreamteam/:event", async (req, res) => {
    const fetchOptions = {
        method: "GET"
    };
    const response = await fetch("https://draft.premierleague.com/api/dreamteam/" + req.params.event, fetchOptions);
    const jsonResponse = await response.json();
    res.json(jsonResponse);
});

module.exports = router;
