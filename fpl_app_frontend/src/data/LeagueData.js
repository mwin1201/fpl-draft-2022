import axios from "axios";

const getLeagueData = async (leagueID) => {
    let currentOrigin = import.meta.env.PROD ? import.meta.env.VITE_PROD_ORIGIN : "http://localhost:5000";
    return axios.get(`${currentOrigin}/fpl/getTeams/` + leagueID)
        .then((apiTeamResponse) => {
            localStorage.setItem("league_data", JSON.stringify(apiTeamResponse.data.league));
            localStorage.setItem("standings", JSON.stringify(apiTeamResponse.data.standings));
            localStorage.setItem("matches", JSON.stringify(apiTeamResponse.data.matches));

            let owners = apiTeamResponse.data.league_entries;

            localStorage.setItem("league_entries", JSON.stringify(owners));
        })
};

export default getLeagueData;
