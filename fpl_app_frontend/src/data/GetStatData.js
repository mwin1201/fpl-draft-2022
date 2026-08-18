import apiClient from "../api/client";

const getStatData = async (gw, leagueId) => {
  return apiClient.get(`/api/stats/league/` + leagueId + "/gameweek/" + gw)
  .then((apiResponse) => {
      return apiResponse.data;
  })
};

export default getStatData;
