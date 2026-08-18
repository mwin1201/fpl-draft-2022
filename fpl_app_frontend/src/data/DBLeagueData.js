import apiClient from "../api/client";

const getDBLeagueData = async () => {
    return apiClient.get(`/api/owners`)
        .then((apiLeagueResponse) => {
            localStorage.setItem("db_league_data", JSON.stringify(apiLeagueResponse.data));
        })
};

export default getDBLeagueData;
