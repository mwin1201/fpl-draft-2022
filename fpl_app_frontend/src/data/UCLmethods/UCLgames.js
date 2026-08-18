import axios from "axios";

const getUCLGames = async () => {
  let currentOrigin = import.meta.env.PROD ? import.meta.env.VITE_PROD_ORIGIN : "http://localhost:5000";
  return axios.get(`${currentOrigin}/api/championsleaguefixtures`)
  .then((apiResponse) => {
      return apiResponse.data;
  })
};

export default getUCLGames;
