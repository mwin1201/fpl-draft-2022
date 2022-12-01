const axios = require("axios").default;

const getGameweek = () => {
    let currentOrigin = process.env.prodOrigin ? process.env.NODE_ENV == 'production' : "http://localhost:5000"
    axios.get(`${currentOrigin}/getGameweek`)
        .then((apiResponse) => {
            localStorage.setItem("current_gameweek", JSON.stringify(apiResponse.data.current_event));
        })
};

export default getGameweek;