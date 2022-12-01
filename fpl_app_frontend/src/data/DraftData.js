const axios = require("axios").default;

const getDraftData = () => {
    let currentOrigin = process.env.prodOrigin ? process.env.NODE_ENV == 'production' : "http://localhost:5000"
    axios.get(`${currentOrigin}/getDraftData`)
        .then((apiResponse) => {
            localStorage.setItem("draft_data", JSON.stringify(apiResponse.data.choices));
        });
};

export default getDraftData;