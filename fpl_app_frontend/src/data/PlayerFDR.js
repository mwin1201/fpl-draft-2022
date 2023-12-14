// purpose of file is to return the upcoming Fixture Difficulty Rating for specific player

const PlayerFDR = (team_id) => {
  let premFixtures = JSON.parse(localStorage.getItem("current_fixtures"));
  team_id = parseInt(team_id);
  let homeTeams = premFixtures.filter(
    (fixture) => parseInt(fixture.team_h) === team_id
  );
  let awayTeams = premFixtures.filter(
    (fixture) => parseInt(fixture.team_a) === team_id
  );
  let fixtureDifficulty;

  if (homeTeams.length > 0) {
    fixtureDifficulty = homeTeams[0].team_h_difficulty;
  } else {
    fixtureDifficulty = awayTeams[0].team_a_difficulty;
  }

  return fixtureDifficulty;
};

export default PlayerFDR;
