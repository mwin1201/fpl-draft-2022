import axios from "axios";

const getStatData = async (gw, leagueId) => {
  let currentOrigin = import.meta.env.PROD ? import.meta.env.VITE_PROD_ORIGIN : "http://localhost:5000";
  return axios.get(`${currentOrigin}/api/stats/league/` + leagueId + "/gameweek/" + gw)
  .then((apiResponse) => {
      return apiResponse.data;
  })
};

export default getStatData;
