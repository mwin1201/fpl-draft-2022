const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

const PORT = 5000;
const app = express();

app.use(cors());
const corsOptions = {
    origin: "http://localhost:3000"
};

const requestEndpoint = "https://draft.premierleague.com/api/league/18161/details";

app.get('/getTeams', cors(corsOptions), async (req, res) => {
    const fetchOptions = {
        method: "GET"
    }
    const response = await fetch(requestEndpoint, fetchOptions);
    const jsonResponse = await response.json();
    res.json(jsonResponse);
});

app.listen(PORT, () => {
    console.log(`FPL app listening at http://localhost:${PORT}`);
});