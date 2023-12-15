// Purpose of this file is to calculate the average gameweek score for a team
// given the league entry ID and the number of gameweeks back to count

const calculateAVGScore = (entry_id, number) => {
  let curGW = JSON.parse(localStorage.getItem("current_gameweek"));
  const curGWStatus = JSON.parse(
    localStorage.getItem("current_gameweek_complete")
  );
  let totalScore = 0;
  if (curGWStatus) {
    for (var i = curGW - (number - 1); i <= curGW; i++) {
      let curGWStats;
      curGWStats = JSON.parse(localStorage.getItem(`gw_${i}_stats`));
      totalScore += curGWStats.filter((team) => team.league_entry === entry_id)[0]
        .total_points;
    }
  } else {
    for (var y = curGW - number; y < curGW; y++) {
      let curGWStats;
      curGWStats = JSON.parse(localStorage.getItem(`gw_${y}_stats`));
      totalScore += curGWStats.filter((team) => team.league_entry === entry_id)[0]
        .total_points;
    }
  }
  return Math.round(totalScore / number);
};

export default calculateAVGScore;
