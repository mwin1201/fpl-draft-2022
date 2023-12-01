// Purpose of this file is to retrieve the team name for a given entry ID

const getTeamName = (entry_id) => {
    let leagueTeams = JSON.parse(localStorage.getItem("league_entries"));
    return leagueTeams.filter((team) => team.id === entry_id)[0].entry_name;
};

export default getTeamName;