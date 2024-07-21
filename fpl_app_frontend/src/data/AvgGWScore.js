// Purpose of this file is to calculate the average gameweek score for a team
// given the league entry ID and the number of gameweeks back to count

import getStatData from "./GetStatData";

const calculateAVGScore = async (entry_id, number) => {
  let curGW = JSON.parse(localStorage.getItem("current_gameweek"));
  const curGWStatus = JSON.parse(
    localStorage.getItem("current_gameweek_complete")
  );
  const currentLeague = JSON.parse(localStorage.getItem("current_league"));
  let totalScore = 0;
  if (curGWStatus) {
    for (var i = curGW - (number - 1); i <= curGW; i++) {
      let curGWStats;
      curGWStats = await getStatData(i, currentLeague);
      totalScore += curGWStats.filter((team) => team.owner_id === entry_id)[0]
        .total_points;
    }
  } else {
    for (var y = curGW - number; y < curGW; y++) {
      let curGWStats;
      curGWStats = await getStatData(y, currentLeague);
      totalScore += curGWStats.filter((team) => team.owner_id === entry_id)[0]
        .total_points;
    }
  }
  return Math.round(totalScore / number);
};

export default calculateAVGScore;
