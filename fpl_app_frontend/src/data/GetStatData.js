const axios = require('axios').default;

const getStatData = async (gw, leagueId) => {
  let currentOrigin = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_prodOrigin : "http://localhost:5000";
  return axios.get(`${currentOrigin}/api/stats/league/` + leagueId + "/gameweek/" + gw)
  .then((apiResponse) => {
      return apiResponse.data;
  })
};

export default getStatData;
