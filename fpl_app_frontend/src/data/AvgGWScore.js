// Purpose of this file is to calculate the average gameweek score for a team
// given the league entry ID and the number of gameweeks back to count

const calculateAVGScore = (entry_id, number) => {
    let curGW = JSON.parse(localStorage.getItem("current_gameweek"));
    let totalScore = 0;
    for (var i = curGW - number; i < curGW; i++) {
        let curGWStats;
        curGWStats = JSON.parse(localStorage.getItem(`gw_${i}_stats`));
        totalScore += curGWStats.filter((team) => team.league_entry === entry_id)[0].total_points;
    }
    return Math.round(totalScore/5);
};

export default calculateAVGScore;