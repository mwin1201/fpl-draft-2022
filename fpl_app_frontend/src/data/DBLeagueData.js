import axios from "axios";

const getDBLeagueData = async () => {
    let currentOrigin = import.meta.env.PROD ? import.meta.env.VITE_PROD_ORIGIN : "http://localhost:5000";
    return axios.get(`${currentOrigin}/api/owners`)
        .then((apiLeagueResponse) => {
            localStorage.setItem("db_league_data", JSON.stringify(apiLeagueResponse.data));
        })
};

export default getDBLeagueData;
