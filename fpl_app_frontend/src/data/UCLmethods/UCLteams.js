import axios from "axios";

const getUCLTeams = async () => {
  let currentOrigin = import.meta.env.PROD ? import.meta.env.VITE_PROD_ORIGIN : "http://localhost:5000";
  return axios.get(`${currentOrigin}/api/championsleague`)
  .then((apiResponse) => {
      return apiResponse.data;
  })
};

export default getUCLTeams;
