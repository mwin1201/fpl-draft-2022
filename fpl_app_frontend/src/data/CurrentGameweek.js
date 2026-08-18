import axios from "axios";

// using this function on the Homepage to check if I need to update the data via API calls
// the logic is to check the currently stored gameweek to the current gameweek returned by this API call
const getGameweek = async () => {
    let currentOrigin = import.meta.env.PROD ? import.meta.env.VITE_PROD_ORIGIN : "http://localhost:5000";
    return axios.get(`${currentOrigin}/fpl/getGameweek`)
        .then((apiResponse) => {
            const currentGameweek = apiResponse.data.current_event;
            const currentGameweekStatus = apiResponse.data.current_event_finished;
            return [currentGameweek, currentGameweekStatus];
        })
};

export default getGameweek;