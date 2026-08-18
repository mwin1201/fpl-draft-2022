import apiClient from "../api/client";

const getDreamteam = async (gw) => {
    return apiClient.get(`/fpl/getDreamteam/` + gw)
    .then((apiResponse) => {
        localStorage.setItem("dreamteam", JSON.stringify(apiResponse.data.elements));
    })
};

export default getDreamteam;
