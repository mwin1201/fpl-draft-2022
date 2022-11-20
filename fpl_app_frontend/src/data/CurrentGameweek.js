const axios = require("axios").default;

const getGameweek = () => {
    axios.get("http://localhost:5000/getGameweek")
        .then((apiResponse) => {
            localStorage.setItem("current_gameweek", JSON.stringify(apiResponse.data.current_event));
        })
};

export default getGameweek;