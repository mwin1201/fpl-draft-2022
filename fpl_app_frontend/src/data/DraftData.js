const axios = require("axios").default;

const getDraftData = () => {
    axios.get("https://fpldraftapp.onrender.com/getDraftData")
        .then((apiResponse) => {
            localStorage.setItem("draft_data", JSON.stringify(apiResponse.data.choices));
        });
};

export default getDraftData;