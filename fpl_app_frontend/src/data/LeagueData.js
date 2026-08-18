import apiClient from "../api/client";

const getLeagueData = async (leagueID) => {
    return apiClient.get(`/fpl/getTeams/` + leagueID)
        .then((apiTeamResponse) => {
            localStorage.setItem("league_data", JSON.stringify(apiTeamResponse.data.league));
            localStorage.setItem("standings", JSON.stringify(apiTeamResponse.data.standings));
            localStorage.setItem("matches", JSON.stringify(apiTeamResponse.data.matches));

            let owners = apiTeamResponse.data.league_entries;

            localStorage.setItem("league_entries", JSON.stringify(owners));
        })
};

export default getLeagueData;
