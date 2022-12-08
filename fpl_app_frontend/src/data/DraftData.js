const axios = require("axios").default;

const getDraftData = async () => {
    let currentOrigin = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_prodOrigin : "http://localhost:5000";
    return axios.get(`${currentOrigin}/getDraftData`)
        .then((apiResponse) => {
            localStorage.setItem("draft_data", JSON.stringify(apiResponse.data.choices));
        });
};

export default getDraftData;