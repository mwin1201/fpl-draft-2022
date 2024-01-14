// purpose of this file is to return the specific team's playoff applicable score

const PlayoffScore = (entry_id) => {
    const currentGW = JSON.parse(localStorage.getItem("current_gameweek"));
    const curGWStatus = JSON.parse(
        localStorage.getItem("current_gameweek_complete")
      );
    let totalScore = 0;
    if (currentGW >= 36 && currentGW < 38) {
        let gw36Stats = JSON.parse(localStorage.getItem(`gw_36_stats`));
        let gw37Stats = JSON.parse(localStorage.getItem(`gw_37_stats`));
        if (gw36Stats) {
            totalScore += gw36Stats.filter((team) => team.league_entry === entry_id)[0].total_points;
        }
        if (gw37Stats) {
            totalScore += gw37Stats.filter((team) => team.league_entry === entry_id)[0].total_points;
        }
    }
    else {
        if (curGWStatus) {
            for (var i = currentGW - 1; i <= currentGW; i++) {
                let curGWStats;
                curGWStats = JSON.parse(localStorage.getItem(`gw_${i}_stats`));
                totalScore += curGWStats.filter((team) => team.league_entry === entry_id)[0]
                  .total_points;
            }
        } else {
            for (var y = currentGW - 2; y < currentGW; y++) {
                let curGWStats;
                curGWStats = JSON.parse(localStorage.getItem(`gw_${y}_stats`));
                totalScore += curGWStats.filter((team) => team.league_entry === entry_id)[0]
                  .total_points;
            }
        }
    }

    return totalScore;
};

export default PlayoffScore;