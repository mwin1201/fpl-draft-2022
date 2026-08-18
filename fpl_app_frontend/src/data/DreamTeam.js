import axios from "axios";

const getDreamteam = async (gw) => {
    let currentOrigin = import.meta.env.PROD ? import.meta.env.VITE_PROD_ORIGIN : "http://localhost:5000";
    return axios.get(`${currentOrigin}/fpl/getDreamteam/` + gw)
    .then((apiResponse) => {
        localStorage.setItem("dreamteam", JSON.stringify(apiResponse.data.elements));
    })
};

export default getDreamteam;