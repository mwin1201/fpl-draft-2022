const axios = require("axios").default;

const getLeagueData = () => {
    axios.get("http://localhost:5000/getTeams")
        .then((apiTeamResponse) => {
            console.log(apiTeamResponse);
            localStorage.setItem("league_data", JSON.stringify(apiTeamResponse.data.league));
            localStorage.setItem("standings", JSON.stringify(apiTeamResponse.data.standings));
            localStorage.setItem("matches", JSON.stringify(apiTeamResponse.data.matches));
            localStorage.setItem("league_entries", JSON.stringify(apiTeamResponse.data.league_entries));
        })
};

export default getLeagueData;
