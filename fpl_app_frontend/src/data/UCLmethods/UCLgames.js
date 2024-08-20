const axios = require('axios').default;

const getUCLGames = async () => {
  let currentOrigin = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_prodOrigin : "http://localhost:5000";
  return axios.get(`${currentOrigin}/api/championsleaguefixtures`)
  .then((apiResponse) => {
      return apiResponse.data;
  })
};

export default getUCLGames;
