// Purpose of this file is to calculate the W-D-L record over a span of X gameweeks for an entry ID

const getRecord = (entry_id, number, gameweek) => {
  let matches = JSON.parse(localStorage.getItem("matches"));
  let curGW = gameweek; //JSON.parse(localStorage.getItem("current_gameweek"));
  const curGWStatus = JSON.parse(
    localStorage.getItem("current_gameweek_complete")
  );
  let specificGames;

  if (curGWStatus) {
    specificGames = matches.filter(
      (match) =>
        match.event <= curGW &&
        match.event > curGW - number &&
        (match.league_entry_1 === entry_id || match.league_entry_2 === entry_id)
    );
  } else {
    specificGames = matches.filter(
      (match) =>
        match.event < curGW &&
        match.event >= curGW - number &&
        (match.league_entry_1 === entry_id || match.league_entry_2 === entry_id)
    );
  }

  let wins = 0,
    draws = 0,
    losses = 0;

  for (var i = 0; i < specificGames.length; i++) {
    if (
      specificGames[i].league_entry_1 === entry_id &&
      specificGames[i].league_entry_1_points >
        specificGames[i].league_entry_2_points
    ) {
      wins += 1;
    } else if (
      specificGames[i].league_entry_1 === entry_id &&
      specificGames[i].league_entry_1_points <
        specificGames[i].league_entry_2_points
    ) {
      losses += 1;
    } else if (
      specificGames[i].league_entry_1 === entry_id &&
      specificGames[i].league_entry_1_points ===
        specificGames[i].league_entry_2_points
    ) {
      draws += 1;
    } else if (
      specificGames[i].league_entry_2 === entry_id &&
      specificGames[i].league_entry_1_points >
        specificGames[i].league_entry_2_points
    ) {
      losses += 1;
    } else if (
      specificGames[i].league_entry_2 === entry_id &&
      specificGames[i].league_entry_1_points <
        specificGames[i].league_entry_2_points
    ) {
      wins += 1;
    } else if (
      specificGames[i].league_entry_2 === entry_id &&
      specificGames[i].league_entry_1_points ===
        specificGames[i].league_entry_2_points
    ) {
      draws += 1;
    }
  }

  return `${wins}-${draws}-${losses}`;
};

export default getRecord;
