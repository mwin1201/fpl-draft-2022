// purpose of the file is to return the specific player Premier League Team

const PlayerTeam = (team_id) => {
  let premTeams = JSON.parse(localStorage.getItem("teams"));
  let singleTeam = premTeams.filter((team) => team.id === team_id);
  let teamObj = singleTeam[0];
  return teamObj.short_name;
};

export default PlayerTeam;
