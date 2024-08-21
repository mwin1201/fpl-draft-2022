const CronJob = require('cron').CronJob;
const fetch = require("node-fetch");

// Logic
// #1. Check if the gameweek is complete. Quit if False
// #2. Check if data has already been written to table for current gameweek. Quit if True
// #3. Loop through both leagues:
// #3 a. Premiership & Championship
// #4. Get league entries; calculate eligible stats for each owner, using timeout method post to DB

const getGameweek = async () => {
  const endpoint = "https://draft.premierleague.com/api/game";
  const fetchOptions = {
    method: "GET"
  };
  const response = await fetch(endpoint, fetchOptions);
  const jsonResponse = await response.json();
  return {gameweek: jsonResponse.current_event, gameweekStatus: jsonResponse.current_event_finished};
};

const checkIfDataExists = async (league, gameweek) => {
  let currentOrigin = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_prodOrigin : "http://localhost:5000";
  const endpoint = `${currentOrigin}/api/stats/league/${league}/gameweek/${gameweek}`;
  const fetchOptions = {
    method: "GET"
  };
  const response = await fetch(endpoint, fetchOptions);
  const jsonResponse = await response.json();
  return jsonResponse.length > 0;
};

const getLeagueEntries = async (league) => {
  const fetchOptions = {
    method: "GET"
  };
  const endpoint = `https://draft.premierleague.com/api/league/${league}/details`
  const response = await fetch(endpoint, fetchOptions);
  const jsonResponse = await response.json();
  return jsonResponse.league_entries;
};

// ## start of stat calculation section ##
const createLineupArr = async (entry_id, owner_id, person, league_id, gameweek) => {
  let fullLineupArr = [{"entry_id": entry_id, "owner_id": owner_id, "person": person, "league_id": league_id, "gameweek": gameweek, "lineup": await Promise.all([getLineups(entry_id, gameweek), apiTimeout(100)]).then((values) => values[0])}];
  return createStatArr(fullLineupArr, entry_id, owner_id, person, league_id, gameweek);
};

const createStatArr = async (allLineups, entry_id, owner_id, person, league_id, gameweek) => {
  let fullStatArr = [{"entry_id": entry_id, "owner_id": owner_id, "person": person, "league_id": league_id, "gameweek": gameweek, "stats": await getPlayerStats(allLineups[0].lineup, gameweek)}];
  return modifyArr(fullStatArr);
};

const modifyArr = (allStatArr) => {
  let statObj = {};
  for (var y = 0; y < allStatArr[0].stats.length; y++) {
      Object.assign(statObj,allStatArr[0].stats[y]);
  }
  statObj.entry_id = allStatArr[0].entry_id;
  statObj.owner_id = allStatArr[0].owner_id;
  statObj.person = allStatArr[0].person;
  statObj.league_id = allStatArr[0].league_id;
  statObj.gameweek = allStatArr[0].gameweek;
  return statObj;
};

const getPlayerStats = async (teamPlayers, gameweek) => {
  const statList = ["minutes", "goals_scored", "assists", "clean_sheets", "goals_conceded", "yellow_cards", "red_cards", "bonus", "total_points"];
  let statArr = [];
  const allPlayerStats = await Promise.all([getStats(gameweek), apiTimeout(100)]).then((values) => values[0]);
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
  return new Promise(resolve => setTimeout(resolve, ms));
};

// need to get team lineups per gameweek
const getLineups = async (team,gameweek) => {
  let currentOrigin = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_prodOrigin : "http://localhost:5000";
  const endpoint = `${currentOrigin}/fpl/getLineups/` + team + "/" + gameweek;
  const fetchOptions = {
    method: "GET"
  };
  const response = await fetch(endpoint, fetchOptions);
  const jsonResponse = await response.json();
  return jsonResponse.picks;
};

// need to pull player stats per gameweek
const getStats = async (gameweek) => {
  let currentOrigin = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_prodOrigin : "http://localhost:5000";
  const endpoint = `${currentOrigin}/fpl/getStats/` + gameweek;
  const fetchOptions = {
    method: "GET"
  };
  const response = await fetch(endpoint, fetchOptions);
  const jsonResponse = await response.json();
  return jsonResponse.elements;
};

const statLoop = async (entry_id, owner_id, person, league_id, gameweek) => {
  let gameweekStats = await createLineupArr(entry_id, owner_id, person, league_id, gameweek);
  return gameweekStats;
};

// ## end of stat calculation section ##

const write_to_db = async (allStats) => {
  let currentOrigin = process.env.NODE_ENV === "production" ? process.env.REACT_APP_prodOrigin : "http://localhost:5000";
  const fetchOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(allStats)
  }
  const endpoint = `${currentOrigin}/api/stats`;
  await fetch(endpoint, fetchOptions)
  .then((response) => {
    if (!response.ok) {
      console.log("Error writing to server");
    }
    else {
      console.log("Success writing to server!");
    }
  })
};

const start = async () => {
  const { gameweek, gameweekStatus } = await getGameweek();
  if (!gameweekStatus) {
    console.log("Gameweek is not complete. Exiting...");
    return;
  }
  const leagues = ["13098", "29556"];
  const allOwners = [];
  for (let i = 0; i < leagues.length; i++) {
    const dataExists = await checkIfDataExists(leagues[i], gameweek);
    if (dataExists) {
      console.log(`Data already exists for league ${leagues[i]} and gameweek ${gameweek}. Exiting...`);
      return;
    }
    const league_entries = await getLeagueEntries(leagues[i]);
    league_entries.forEach((entry) => {
      allOwners.push(
        {
          owner_id: entry.id,
          entry_id: entry.entry_id,
          person: entry.player_first_name + " " + entry.player_last_name,
          league_id: leagues[i],
          gameweek: gameweek
        }
      );
    })
  }
  allStats = [];
  allOwners.forEach(async (owner) => {
    const statObj = await statLoop(owner.entry_id, owner.owner_id, owner.person, owner.league_id, owner.gameweek);
    allStats.push(statObj);
  })

  setTimeout(() => {
    write_to_db(allStats);
  }, 5000);
};

const get_stat_data = () => {
  new CronJob(`15 31 23 * * *`,
    function() {
      start();
    },
    null,
    true,
    'America/Chicago'
  );
};

module.exports = get_stat_data();
