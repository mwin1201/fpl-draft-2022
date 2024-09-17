const fetch = require("node-fetch");

// Logic
// #1. Check if the gameweek is complete. Quit if False
// #2. Check if data has already been written to table for current gameweek. Quit if True
// #3. Search over gameweek matches and see if any UCL teams played each other.
// Quit if there are 0 results.
// #4. If results, make sure that teams have not played each other more than 4 times.
// Make sure to not write these fixtures to the table.

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

const getAllFixtures = async () => {
  let currentOrigin = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_prodOrigin : "http://localhost:5000";
  const endpoint = `${currentOrigin}/api/championsleaguefixtures`;
  const fetchOptions = {
    method: "GET"
  };
  const response = await fetch(endpoint, fetchOptions);
  const jsonResponse = await response.json();
  return jsonResponse;
};

const countTimesPlayed = (team1, team2, ucl_fixtures) => {
	return ucl_fixtures.filter((matchup) => (matchup.league_entry_1 === team1 && matchup.league_entry_2 === team2) || (matchup.league_entry_1 === team2 && matchup.league_entry_2 === team1)).length
}; 


const createCounterObject = (fixtures, teams) => {
  let counterObject = {};
  teams.forEach((team) => {
    let other_teams = teams.filter((t) => t !== team);
    counterObject[team.owner_id] = [
      {
        opponent: other_teams[0].team_name,
        played: countTimesPlayed(team.owner_id, other_teams[0].owner_id, fixtures),
        opponent_id: other_teams[0].owner_id
      },
      {
        opponent: other_teams[1].team_name,
        played: countTimesPlayed(team.owner_id, other_teams[1].owner_id, fixtures),
        opponent_id: other_teams[1].owner_id
      },
      {
        opponent: other_teams[2].team_name,
        played: countTimesPlayed(team.owner_id, other_teams[2].owner_id, fixtures),
        opponent_id: other_teams[2].owner_id
      }
    ]
  })
  return counterObject;
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
const checkUCLMatchup = (matches, teams, counter) => {
  let ucl_matchups = [];
  matches.forEach((match) => {
    if (teams.some(t => t.owner_id === match.league_entry_1) && teams.some(t => t.owner_id === match.league_entry_2)) {
      if (counter[match.league_entry_1].filter((t) => t.opponent_id === match.league_entry_2)[0].played < 4) {
        ucl_matchups.push(match);
      }
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
  const all_ucl_fixtures = await getAllFixtures();
  const counterObject = createCounterObject(all_ucl_fixtures, ucl_teams);
  const ucl_matchups = checkUCLMatchup(gameweek_matches, ucl_teams, counterObject);
  if (ucl_matchups.length > 0) {
    await write_to_db(ucl_matchups);
  }
};

start();
