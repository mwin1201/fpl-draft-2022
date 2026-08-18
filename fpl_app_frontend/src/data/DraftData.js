import apiClient from "../api/client";

const getDraftData = async (leagueID) => {
    return apiClient.get(`/fpl/getDraftData/` + leagueID)
        .then((apiResponse) => {
            localStorage.setItem("draft_data", JSON.stringify(apiResponse.data.choices));
            localStorage.setItem("player_ownership", JSON.stringify(apiResponse.data.element_status));
        });
};

export default getDraftData;
