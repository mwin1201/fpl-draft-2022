/*
Purpose of this cron job file is to run every night and check if there is data to
update in the Stat model in the database. This table contains all of the team's
stats for each game week.

Logic:
1. Is the current game week complete?
2. Is there data in the DB for this gameweek and league yet?

outcomes:
Yes;No = write stat data to the DB
Yes;Yes = do nothing
No;Yes = this is bad! troubleshooting will need to happen
No;No = do nothing
*/

const CronJob = require("cron").CronJob;
const fetch = require("node-fetch");
import seasonStats from "../fpl_app_frontend/src/data/GWStats";

// check if the current gameweek is complete
const checkGWStatus = async () => {
    const gameweekEndpoint = "https://draft.premierleague.com/api/game";
    const fetchOptions = {
        method: "GET"
    };
    const response = await fetch(gameweekEndpoint, fetchOptions);
    const jsonResponse = await response.json();
    return ({isGameweekComplete: jsonResponse.current_event_finished, currentGameweek: jsonResponse.current_event});
};

const calculateGWStats = async (gameweek) => {
    
};


const main = async () => {
    const {isGameweekComplete, currentGameweek} = await checkGWStatus();
    if (isGameweekComplete) {return;}
    checkStatDB(currentGameweek);
    
    console.log(isGameweekComplete);
};

const job = () => {
    new CronJob('*/5 * * * * *', function() {main()}, null, true);
};

module.exports = job();