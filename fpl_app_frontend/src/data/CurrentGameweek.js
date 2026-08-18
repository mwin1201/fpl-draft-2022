import apiClient from "../api/client";

// using this function on the Homepage to check if I need to update the data via API calls
// the logic is to check the currently stored gameweek to the current gameweek returned by this API call
const getGameweek = async () => {
    return apiClient.get(`/fpl/getGameweek`)
        .then((apiResponse) => {
            const currentGameweek = apiResponse.data.current_event;
            const currentGameweekStatus = apiResponse.data.current_event_finished;
            return [currentGameweek, currentGameweekStatus];
        })
};

export default getGameweek;
