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

// check if the current gameweek is complete
const checkGWStatus = async () => {
  const gameweekEndpoint = "https://draft.premierleague.com/api/game";
  const fetchOptions = {
    method: "GET",
  };
  const response = await fetch(gameweekEndpoint, fetchOptions);
  const jsonResponse = await response.json();
  return {
    isGameweekComplete: jsonResponse.current_event_finished,
    currentGameweek: jsonResponse.current_event,
  };
};

const getLeagueData = async (gameweek) => {
  const leagueIDs = ["24003", "20667"];
  let currentOrigin =
    process.env.NODE_ENV === "production"
      ? process.env.REACT_APP_devOrigin
      : "http://localhost:5000";
  let endpoint = `${currentOrigin}/fpl/getTeams/`;
  let allEntries = [];
  const fetchOptions = {
    method: "GET",
  };
  for (var i = 0; i < leagueIDs.length; i++) {
    const response = await fetch(endpoint + leagueIDs[i], fetchOptions);
    const jsonResponse = await response.json();
    for (var y = 0; y < jsonResponse.league_entries.length; y++) {
      allEntries.push({
        entry_id: jsonResponse.league_entries[y].entry_id,
        gameweek: gameweek,
        league_id: parseInt(leagueIDs[i]),
        person: jsonResponse.league_entries[y].entry_name,
        owner_id: jsonResponse.league_entries[y].id,
        lineup: await Promise.all([
          getLineups(jsonResponse.league_entries[y].entry_id, gameweek),
          apiTimeout(100),
        ]).then((values) => values[0]),
      });
    }
  }

  return createStatArr(allEntries, gameweek);
  //console.log(allEntries);
};

const createStatArr = async (allEntries, gameweek) => {
  let fullStatArr = [];
  for (var i = 0; i < allEntries.length; i++) {
    fullStatArr.push({
      entry_id: allEntries[i].entry_id,
      gameweek: allEntries[i].gameweek,
      league_id: allEntries[i].league_id,
      person: allEntries[i].person,
      owner_id: allEntries[i].owner_id,
      stats: await getPlayerStats(allEntries[i].lineup, gameweek),
    });
  }

  return modifyArr(fullStatArr);
};

const modifyArr = (allStatArr) => {
  let finalArr = [];
  for (var i = 0; i < allStatArr.length; i++) {
    let statObj = {};
    for (var y = 0; y < allStatArr[i].stats.length; y++) {
      Object.assign(statObj, allStatArr[i].stats[y]);
    }
    statObj.entry_id = allStatArr[i].entry_id;
    statObj.gameweek = allStatArr[i].gameweek;
    statObj.league_id = allStatArr[i].league_id;
    statObj.person = allStatArr[i].person;
    statObj.owner_id = allStatArr[i].owner_id;
    finalArr.push(statObj);
  }

  return finalArr;
};

const getPlayerStats = async (teamPlayers, gameweek) => {
  const statList = [
    "minutes",
    "goals_scored",
    "assists",
    "clean_sheets",
    "goals_conceded",
    "yellow_cards",
    "red_cards",
    "bonus",
    "total_points",
  ];
  let statArr = [];
  const allPlayerStats = await Promise.all([
    getStats(gameweek),
    apiTimeout(100),
  ]).then((values) => values[0]);
  for (var y = 0; y < statList.length; y++) {
    let statCounter = 0;
    for (var i = 0; i < 11; i++) {
      statCounter += allPlayerStats[teamPlayers[i].element].stats[statList[y]];
    }
    let key = statList[y];
    let obj = {};
    obj[key] = statCounter;
    statArr.push(obj);
  }
  return statArr;
};

// timeout function to prevent overwhelming the FPL API
const apiTimeout = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const getLineups = async (team, gameweek) => {
  let currentOrigin =
    process.env.NODE_ENV === "production"
      ? process.env.REACT_APP_devOrigin
      : "http://localhost:5000";
  const endpoint = `${currentOrigin}/fpl/getLineups/` + team + "/" + gameweek;
  const fetchOptions = {
    method: "GET",
  };
  const response = await fetch(endpoint, fetchOptions);
  const jsonResponse = await response.json();
  return jsonResponse.picks;
};

const getStats = async (gameweek) => {
  let currentOrigin =
    process.env.NODE_ENV === "production"
      ? process.env.REACT_APP_devOrigin
      : "http://localhost:5000";
  const endpoint = `${currentOrigin}/fpl/getStats/${gameweek}`;
  const fetchOptions = {
    method: "GET",
  };
  const response = await fetch(endpoint, fetchOptions);
  const jsonResponse = await response.json();
  return jsonResponse.elements;
};

const checkStats = async (gameweek) => {
  let currentOrigin =
    process.env.NODE_ENV === "production"
      ? process.env.REACT_APP_devOrigin
      : "http://localhost:5000";
  const endpoint = `${currentOrigin}/api/stats/league/24003/gameweek/${gameweek}`;
  const fetchOptions = {
    method: "GET",
  };
  const response = await fetch(endpoint, fetchOptions);
  const jsonResponse = await response.json();
  if (jsonResponse.length === 0) {
    return false;
  } else {
    return true;
  }
};

const writeStatToDB = async (stat) => {
  let currentOrigin =
    process.env.NODE_ENV === "production"
      ? process.env.REACT_APP_devOrigin
      : "http://localhost:5000";
  const endpoint = `${currentOrigin}/api/stats/`;
  const fetchOptions = {
    method: "POST",
    body: JSON.stringify(stat),
    headers: { "Content-Type": "application/json" },
  };
  const response = await fetch(endpoint, fetchOptions);
  if (response.ok) {
    console.log("success");
  }
};

const main = async () => {
  const { isGameweekComplete, currentGameweek } = await checkGWStatus();
  const doGWStatsExist = await checkStats(currentGameweek);

  if (isGameweekComplete === true && doGWStatsExist === false) {
    const finalArray = await getLeagueData(currentGameweek);
    for (var i = 0; finalArray.length; i++) {
      await writeStatToDB(finalArray[i]);
    }
    console.log("data written to DB");
    return "done";
  } else {
    console.log("no data written to DB");
    return "done";
  }
};

const job = () => {
  new CronJob(
    "*/1 * * * *",
    function () {
      main();
    },
    null,
    true
  );
};

module.exports = job();
