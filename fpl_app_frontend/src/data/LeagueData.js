const axios = require("axios").default;

const getLeagueData = async (leagueID) => {
    let currentOrigin = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_prodOrigin : "http://localhost:5000";
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
