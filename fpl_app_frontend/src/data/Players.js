import apiClient from "../api/client";

const getPlayers = async () => {
    return apiClient.get(`/fpl/getPremPlayers`)
        .then((apiResponse) => {
            localStorage.setItem("element_types", JSON.stringify(apiResponse.data.element_types));
            localStorage.setItem("elements", JSON.stringify(apiResponse.data.elements));
            localStorage.setItem("teams", JSON.stringify(apiResponse.data.teams));
        })
};

export default getPlayers;
