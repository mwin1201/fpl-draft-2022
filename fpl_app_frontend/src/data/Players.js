const axios = require("axios").default;

const getPlayers = async () => {
    let currentOrigin = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_prodOrigin : "http://localhost:5001";
    return axios.get(`${currentOrigin}/fpl/getPremPlayers`)
        .then((apiResponse) => {
            localStorage.setItem("element_types", JSON.stringify(apiResponse.data.element_types));
            localStorage.setItem("elements", JSON.stringify(apiResponse.data.elements));
            localStorage.setItem("teams", JSON.stringify(apiResponse.data.teams));
        })
};

export default getPlayers;