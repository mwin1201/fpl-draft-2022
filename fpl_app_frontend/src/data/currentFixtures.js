import axios from "axios";

const currentFixtures = (gameweek) => {

    const getFixtureData = async (event) => {
        let currentOrigin = import.meta.env.PROD ? import.meta.env.VITE_PROD_ORIGIN : "http://localhost:5000";
        return axios.get(`${currentOrigin}/fpl/getFixtureData/` + event)
        .then((apiResponse) => {
            return apiResponse.data;
        })
    };

    const getCurrentFixtures = async (event) => {
        const fixtureArr = await getFixtureData(event);
        localStorage.setItem("current_fixtures", JSON.stringify(fixtureArr));
        return true;
    };

    return getCurrentFixtures(gameweek);
};

export default currentFixtures;