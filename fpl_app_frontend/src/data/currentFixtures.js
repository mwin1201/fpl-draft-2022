const axios = require('axios').default;

const currentFixtures = (gameweek) => {

    const getFixtureData = async (event) => {
        let currentOrigin = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_prodOrigin : "http://localhost:5000";
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