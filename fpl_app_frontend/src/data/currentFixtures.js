import apiClient from "../api/client";

const currentFixtures = (gameweek) => {

    const getFixtureData = async (event) => {
        return apiClient.get(`/fpl/getFixtureData/` + event)
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
