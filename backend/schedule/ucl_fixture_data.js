const fetch = require("node-fetch");

// Logic
// #1. Check if the gameweek is complete. Quit if False
// #2. Check if data has already been written to table for current gameweek. Quit if True
// #3. Search over gameweek matches and see if any UCL teams played each other.
// Quit if there are 0 results.

const getGameweek = async () => {
  const endpoint = "https://draft.premierleague.com/api/game";
  const fetchOptions = {
    method: "GET"
  };
  const response = await fetch(endpoint, fetchOptions);
  const jsonResponse = await response.json();
  return {gameweek: jsonResponse.current_event, gameweekStatus: jsonResponse.current_event_finished};
};

const checkIfDataExists = async (gameweek) => {
  let currentOrigin = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_prodOrigin : "http://localhost:5000";
  const endpoint = `${currentOrigin}/api/championsleaguefixtures/gameweek/${gameweek}`;
  const fetchOptions = {
    method: "GET"
  };
  const response = await fetch(endpoint, fetchOptions);
  const jsonResponse = await response.json();
  return jsonResponse.length > 0;
};

const getMatches = async (gw) => {
  const premiership_league_id = "13098";
  const fetchOptions = {
    method: "GET"
  };
  const endpoint = `https://draft.premierleague.com/api/league/${premiership_league_id}/details`
  const response = await fetch(endpoint, fetchOptions);
  const jsonResponse = await response.json();
  console.log("matches",jsonResponse.matches.filter((match) => match.event === gw));
  return (jsonResponse.matches.filter((match) => match.event === gw));
};

const getUCLTeams = async () => {
  let currentOrigin = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_prodOrigin : "http://localhost:5000";
  const endpoint = `${currentOrigin}/api/championsleague`;
  const fetchOptions = {
    method: "GET"
  };
  const response = await fetch(endpoint, fetchOptions);
  const jsonResponse = await response.json();
  console.log("ucl teams",jsonResponse);
  return jsonResponse;
};

// we will either have 0, 1, or 2 UCL matchups per gameweek
const checkUCLMatchup = (matches, teams) => {
  let ucl_matchups = [];
  matches.forEach((match) => {
    if (teams.some(t => t.owner_id === match.league_entry_1) && teams.some(t => t.owner_id === match.league_entry_2)) {
      ucl_matchups.push(match);
    }
  });
  return ucl_matchups;
};

const write_to_db = async (ucl_matchups) => {
  console.log("entering write to DB!!");
  let currentOrigin = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_prodOrigin : "http://localhost:5000";
  ucl_matchups.forEach(async (match) => {
    const data = {
      "gameweek": match.event,
      "league_entry_1": match.league_entry_1,
      "league_entry_1_points": match.league_entry_1_points,
      "league_entry_2": match.league_entry_2,
      "league_entry_2_points": match.league_entry_2_points
    };
    const fetchOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    };
    const endpoint = `${currentOrigin}/api/championsleaguefixtures`;
    await fetch(endpoint, fetchOptions)
    .then((response) => {
      if (!response.ok) {
        console.log("Error writing to server");
      }
      else {
        console.log("Success writing to server!");
      }
    })
  });
};

const start = async () => {
  const { gameweek, gameweekStatus } = await getGameweek();
  if (!gameweekStatus || await checkIfDataExists(gameweek)) {
    console.log("Gameweek is not complete or data already exists. Exiting...");
    return;
  }

  const gameweek_matches = await getMatches(gameweek);
  const ucl_teams = await getUCLTeams();
  const ucl_matchups = checkUCLMatchup(gameweek_matches, ucl_teams);
  if (ucl_matchups.length > 0) {
    await write_to_db(ucl_matchups);
  }
};

start();