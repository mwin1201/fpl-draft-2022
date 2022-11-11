const axios = require("axios").default;

const getPlayers = () => {
    axios.get("http://localhost:5000/getPremPlayers")
        .then((apiResponse) => {
            console.log(apiResponse);
            localStorage.setItem("element_types", JSON.stringify(apiResponse.data.element_types));
            localStorage.setItem("elements", JSON.stringify(apiResponse.data.elements));
            localStorage.setItem("teams", JSON.stringify(apiResponse.data.teams));
        })
};

export default getPlayers;