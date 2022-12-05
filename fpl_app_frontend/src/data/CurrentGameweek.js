const axios = require("axios").default;

// using this function on the Homepage to check if I need to update the data via API calls
// the logic is to check the currently stored gameweek to the current gameweek returned by this API call
const getGameweek = async () => {
    let currentOrigin = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_prodOrigin : "http://localhost:5000";
    return axios.get(`${currentOrigin}/getGameweek`)
        .then((apiResponse) => {
            //localStorage.setItem("current_gameweek", JSON.stringify(apiResponse.data.current_event));
            return apiResponse.data.current_event;
        })
};

export default getGameweek;