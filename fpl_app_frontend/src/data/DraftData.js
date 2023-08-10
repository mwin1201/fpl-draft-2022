const axios = require("axios").default;

const getDraftData = async (leagueID) => {
    let currentOrigin = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_prodOrigin : "http://localhost:5001";
    return axios.get(`${currentOrigin}/fpl/getDraftData/` + leagueID)
        .then((apiResponse) => {
            localStorage.setItem("draft_data", JSON.stringify(apiResponse.data.choices));
            localStorage.setItem("player_ownership", JSON.stringify(apiResponse.data.element_status));
        });
};

export default getDraftData;