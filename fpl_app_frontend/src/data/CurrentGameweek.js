const axios = require("axios").default;

const getGameweek = () => {
    axios.get("https://fpldraftapp.onrender.com/getGameweek")
        .then((apiResponse) => {
            localStorage.setItem("current_gameweek", JSON.stringify(apiResponse.data.current_event));
        })
};

export default getGameweek;