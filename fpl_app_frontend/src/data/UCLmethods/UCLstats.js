
const getUCLTeamStats = (team_id, games) => {
  let teamGames = games.filter((game) => game.league_entry_1 === team_id || game.league_entry_2 === team_id);
  let wins = 0, draws = 0, losses = 0, pointsFor = 0, pointsAgainst = 0, pointsDiff = 0, leaguePoints = 0;
  for (var i = 0; i < teamGames.length; i++) {
    if (teamGames[i].league_entry_1 === team_id) {
      pointsFor += teamGames[i].league_entry_1_points;
      pointsAgainst += teamGames[i].league_entry_2_points;
      if (teamGames[i].league_entry_1_points > teamGames[i].league_entry_2_points) {
        wins++;
        leaguePoints += 3;
      } else if (teamGames[i].league_entry_1_points < teamGames[i].league_entry_2_points) {
        losses++;
      } else {
        draws++;
        leaguePoints++;
      }
    }
    else {
      pointsFor += teamGames[i].league_entry_2_points;
      pointsAgainst += teamGames[i].league_entry_1_points;
      if (teamGames[i].league_entry_2_points > teamGames[i].league_entry_1_points) {
        wins++;
        leaguePoints += 3;
      } else if (teamGames[i].league_entry_2_points < teamGames[i].league_entry_1_points) {
        losses++;
      } else {
        draws++;
        leaguePoints++;
      }
    }
  }

  pointsDiff = pointsFor - pointsAgainst;

  return {
    wins: wins,
    draws: draws,
    losses: losses,
    pointsFor: pointsFor,
    pointsAgainst: pointsAgainst,
    pointsDiff: pointsDiff,
    leaguePoints: leaguePoints,
  };
};

export default getUCLTeamStats;
