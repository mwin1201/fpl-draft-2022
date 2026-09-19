const router = require("express").Router();
const fetch = require("node-fetch");

const fetchOptions = {
    method: "GET",
    headers: {
        // Some FPL endpoints return an HTML error page (instead of JSON) when
        // the request looks like a bare bot, so send a browser-like UA.
        "User-Agent": "Mozilla/5.0",
    },
};

// Fetch a URL and safely parse it as JSON. Throws a descriptive error when the
// upstream responds with a non-OK status or a non-JSON body (e.g. the FPL API
// returns a `<!doctype html>` 404 page for unknown/undefined resources).
// Optionally retries a few times before giving up.
const fetchJson = async (url, { retries = 0, retryDelayMs = 300 } = {}) => {
    let lastError;
    for (let attempt = 0; attempt <= retries; attempt++) {
        try {
            const response = await fetch(url, fetchOptions);

            if (!response.ok) {
                throw new Error(`Upstream responded ${response.status} for ${url}`);
            }

            const text = await response.text();
            try {
                return JSON.parse(text);
            } catch (parseError) {
                throw new Error(
                    `Upstream returned non-JSON body for ${url}: ${text.slice(0, 80)}`
                );
            }
        } catch (error) {
            lastError = error;
            if (attempt < retries) {
                await new Promise((resolve) => setTimeout(resolve, retryDelayMs));
            }
        }
    }
    throw lastError;
};

// Wraps an async route handler so any thrown/rejected error is turned into a
// 502 JSON response instead of an unhandled promise rejection that crashes the
// whole Node process.
const handle = (fn) => async (req, res) => {
    try {
        const data = await fn(req);
        res.json(data);
    } catch (error) {
        console.error(`FPL proxy error on ${req.originalUrl}:`, error.message);
        res.status(502).json({ error: "Failed to fetch data from FPL API" });
    }
};

// this section is the endpoint to gather the team names and players in the FPL Draft league
router.get('/getTeams/:leagueID', handle((req) =>
    fetchJson(`https://draft.premierleague.com/api/league/${req.params.leagueID}/details`)
));

// this section is the endpoint to get all the players in the Premier League
router.get('/getPremPlayers', handle(() =>
    fetchJson("https://draft.premierleague.com/api/bootstrap-static")
));

// this section is the endpoint to grab each of the FPL league player team lineups
router.get('/getLineups/:team/:event', handle((req) =>
    fetchJson(
        `https://draft.premierleague.com/api/entry/${req.params.team}/event/${req.params.event}`,
        { retries: 2 }
    )
));

// this section is the endpoint for draft data
router.get('/getDraftData/:leagueID', handle((req) =>
    fetchJson(`https://draft.premierleague.com/api/draft/${req.params.leagueID}/choices`)
));

// this section is the endpoint for player stats and fixture data each gameweek
router.get("/getStats/:event", handle((req) =>
    fetchJson(`https://draft.premierleague.com/api/event/${req.params.event}/live`)
));

// this section is the endpoint to get the current gameweek
router.get("/getGameweek", handle(() =>
    fetchJson("https://draft.premierleague.com/api/game")
));

// this section is the endpoint to get the gameweek fixture outcomes
router.get("/getFixtureData/:event", handle((req) =>
    // Using fantasy endpoint instead of draft endpoint because we get fixture difficulty ratings this way
    fetchJson(`https://fantasy.premierleague.com/api/fixtures/?event=${req.params.event}`)
));

// this section is the endpoint to get team transaction stats
router.get("/getTransactions/:teamId", handle((req) =>
    fetchJson(`https://draft.premierleague.com/api/entry/${req.params.teamId}/public`)
));

// this section is the endpoint to grab the weekly dream team
router.get("/getDreamteam/:event", handle((req) =>
    fetchJson(`https://draft.premierleague.com/api/dreamteam/${req.params.event}`)
));

module.exports = router;
