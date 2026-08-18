import axios from "axios";

const getDraftData = async (leagueID) => {
    let currentOrigin = import.meta.env.PROD ? import.meta.env.VITE_PROD_ORIGIN : "http://localhost:5000";
    return axios.get(`${currentOrigin}/fpl/getDraftData/` + leagueID)
        .then((apiResponse) => {
            localStorage.setItem("draft_data", JSON.stringify(apiResponse.data.choices));
            localStorage.setItem("player_ownership", JSON.stringify(apiResponse.data.element_status));
        });
};

export default getDraftData;