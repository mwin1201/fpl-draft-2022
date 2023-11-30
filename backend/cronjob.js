// Purpose of this cron job is to run Monday and Thursday nights to see if the current gameweek is completed or not.
// IF complete, then calculate the team game week stats and push to database (NEED TO DO FOR BOTH LEAGUES)
// ELSE don't do anything
// Need to check if Database has gameweek stats for 


const CronJob = require('cron').CronJob;
const fetch = require("node-fetch");

const testing = async () => {
    const gameweekEndpoint = "https://draft.premierleague.com/api/game";
    const fetchOptions = {
        method: "GET"
    };
    const response = await fetch(gameweekEndpoint, fetchOptions);
    const jsonResponse = await response.json();
    console.log(jsonResponse);
};

const job = () => {
    new CronJob('*/5 * * * * *', function() {testing()}, null, true);
}

module.exports = job();

