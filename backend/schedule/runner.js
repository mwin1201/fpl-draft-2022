const CronJob = require('cron').CronJob;
const fetch = require("node-fetch");

const get_name = async () => {
  // 2024/25 Premiership League ID
  const leagueID = "13098";
  const fetchOptions = {
    method: "GET"
  };
  const endpoint = `https://draft.premierleague.com/api/league/${leagueID}/details`
  const response = await fetch(endpoint, fetchOptions);
  const jsonResponse = await response.json();
  return jsonResponse.league_entries[0].entry_name;
};

const write_to_db = async (matches) => {
  let currentOrigin = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_prodOrigin : "http://localhost:5000";
  matches.forEach(async (match) => {
    const data = {
      "gameweek": match.gameweek,
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
    });
  })
};

const start = async () => {
  let name = await get_name();
  if (name === "Minnesota Max") {
    matches = [
      {
        "gameweek": 11,
        "league_entry_1": 83210,
        "league_entry_1_points": 39,
        "league_entry_2": 70583,
        "league_entry_2_points": 47
        },
        {
        "gameweek": 11,
        "league_entry_1": 82627,
        "league_entry_1_points": 61,
        "league_entry_2": 70583,
        "league_entry_2_points": 45
      }
    ];
    await write_to_db(matches);
  }
};

const start_cron_jobs = () => {
  new CronJob(`15 04 14 * * *`,
    function () {
      start();
    },
    null,
    true,
    'America/Chicago'
  );
};

module.exports = start_cron_jobs();
