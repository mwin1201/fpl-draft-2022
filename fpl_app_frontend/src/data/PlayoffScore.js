// purpose of this file is to return the specific team's playoff applicable score

const PlayoffScore = (entry_id) => {
    const currentGW = JSON.parse(localStorage.getItem("current_gameweek"));
    const curGWStatus = JSON.parse(
        localStorage.getItem("current_gameweek_complete")
      );
    
    let scores = [];
    let totalScore = 0;
    if (currentGW >= 36 && currentGW < 38) {
        let gw36Stats = JSON.parse(localStorage.getItem(`gw_36_stats`));
        let gw37Stats = JSON.parse(localStorage.getItem(`gw_37_stats`));
        if (gw36Stats) {
            totalScore = gw36Stats.filter((team) => team.league_entry === entry_id)[0].total_points;
            scores.push({gw: 36, score: totalScore});
        }
        if (gw37Stats) {
            totalScore = gw37Stats.filter((team) => team.league_entry === entry_id)[0].total_points;
            scores.push({gw: 37, score: totalScore});
        }
    }
    else if (currentGW === 37 && curGWStatus) {
        scores.push({gw: 38, score: 0});
    }
    else if (currentGW === 38) {
        let gw38Stats = JSON.parse(localStorage.getItem(`gw_38_stats`));
        totalScore = gw38Stats.filter((team) => team.league_entry === entry_id)[0].total_points;
        scores.push({gw:38, score: totalScore});
    }
    // this section was created for tracking purposes leading up to the playoff gameweeks 36,37, and 38
    else {
        if (curGWStatus) {
            for (var i = currentGW - 1; i <= currentGW; i++) {
                let curGWStats;
                curGWStats = JSON.parse(localStorage.getItem(`gw_${i}_stats`));
                totalScore = curGWStats.filter((team) => team.league_entry === entry_id)[0]
                  .total_points;
                scores.push({gw: i, score: totalScore})
            }
        } else {
            for (var y = currentGW - 2; y < currentGW; y++) {
                let curGWStats;
                curGWStats = JSON.parse(localStorage.getItem(`gw_${y}_stats`));
                totalScore = curGWStats.filter((team) => team.league_entry === entry_id)[0]
                  .total_points;
                scores.push({gw: y, score: totalScore});
            }
        }
    }

    return scores;
};

export default PlayoffScore;
