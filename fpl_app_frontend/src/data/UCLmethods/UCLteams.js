const axios = require('axios').default;

const getUCLTeams = async () => {
  let currentOrigin = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_prodOrigin : "http://localhost:5000";
  return axios.get(`${currentOrigin}/api/championsleague`)
  .then((apiResponse) => {
      return apiResponse.data;
  })
};

export default getUCLTeams;
