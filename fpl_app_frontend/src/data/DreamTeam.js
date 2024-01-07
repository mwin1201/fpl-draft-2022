const axios = require('axios').default;

const getDreamteam = async (gw) => {
    let currentOrigin = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_prodOrigin : "http://localhost:5000";
    return axios.get(`${currentOrigin}/fpl/getDreamteam/` + gw)
    .then((apiResponse) => {
        localStorage.setItem("dreamteam", JSON.stringify(apiResponse.data));
    })
};

export default getDreamteam;