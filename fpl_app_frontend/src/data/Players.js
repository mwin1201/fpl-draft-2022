const axios = require("axios").default;

const getPlayers = () => {
    let currentOrigin = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_prodOrigin : "http://localhost:5000";
    axios.get(`${currentOrigin}/getPremPlayers`)
        .then((apiResponse) => {
            console.log(apiResponse);
            localStorage.setItem("element_types", JSON.stringify(apiResponse.data.element_types));
            localStorage.setItem("elements", JSON.stringify(apiResponse.data.elements));
            localStorage.setItem("teams", JSON.stringify(apiResponse.data.teams));
        })
};

export default getPlayers;