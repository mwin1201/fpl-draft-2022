const axios = require("axios").default;

const getLeagueData = () => {
    let currentOrigin = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_prodOrigin : "http://localhost:5000";
    axios.get(`${currentOrigin}/getTeams`)
        .then((apiTeamResponse) => {
            console.log(apiTeamResponse);
            localStorage.setItem("league_data", JSON.stringify(apiTeamResponse.data.league));
            localStorage.setItem("standings", JSON.stringify(apiTeamResponse.data.standings));
            localStorage.setItem("matches", JSON.stringify(apiTeamResponse.data.matches));
            localStorage.setItem("league_entries", JSON.stringify(apiTeamResponse.data.league_entries));
        })
    
    console.log(currentOrigin);
};

export default getLeagueData;
