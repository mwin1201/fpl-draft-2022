const axios = require("axios").default;

const getDraftData = () => {
    axios.get("http://localhost:5000/getDraftData")
        .then((apiResponse) => {
            localStorage.setItem("draft_data", JSON.stringify(apiResponse.data.choices));
        });
};

export default getDraftData;