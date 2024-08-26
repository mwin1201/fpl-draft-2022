const axios = require("axios").default;

const getDBLeagueData = async () => {
    let currentOrigin = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_prodOrigin : "http://localhost:5000";
    return axios.get(`${currentOrigin}/api/owners`)
        .then((apiLeagueResponse) => {
            localStorage.setItem("db_league_data", JSON.stringify(apiLeagueResponse.data));
        })
};

export default getDBLeagueData;
