// purpose of this file is to return the specific team's playoff applicable score
const axios = require('axios').default;

const PlayoffScore = async (entry_id) => {

    console.log("ID: ", entry_id);

    const getStatData = async (gw, leagueId) => {
        let currentOrigin = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_prodOrigin : "http://localhost:5000";
        return axios.get(`${currentOrigin}/api/stats/league/` + leagueId + "/gameweek/" + gw)
        .then((apiResponse) => {
            return apiResponse.data;
        })
    };

    const currentGW = JSON.parse(localStorage.getItem("current_gameweek"));
    const curGWStatus = JSON.parse(
        localStorage.getItem("current_gameweek_complete")
      );
    const currentLeague = JSON.parse(localStorage.getItem("current_league"));
    
    let scores = [];
    let totalScore = 0;
    if (currentGW >= 36 && currentGW < 38) {
        let gw36Stats = await getStatData(36, currentLeague);
        console.log("gw 36 stats: ", gw36Stats);
        let gw37Stats = await getStatData(37, currentLeague);
        if (gw36Stats) {
            totalScore = gw36Stats.filter((team) => team.owner_id === entry_id)[0].total_points;
            scores.push({gw: 36, score: totalScore});
        }
        if (gw37Stats) {
            totalScore = gw37Stats.filter((team) => team.owner_id === entry_id)[0].total_points;
            scores.push({gw: 37, score: totalScore});
        }
    }
    else if (currentGW === 37 && curGWStatus) {
        scores.push({gw: 38, score: 0});
    }
    else if (currentGW === 38) {
        let gw38Stats = await getStatData(38, currentLeague);
        totalScore = gw38Stats.filter((team) => team.owner_id === entry_id)[0].total_points;
        scores.push({gw:38, score: totalScore});
    }
    // this section was created for tracking purposes leading up to the playoff gameweeks 36,37, and 38
    else {
        if (curGWStatus) {
            for (var i = currentGW - 1; i <= currentGW; i++) {
                let curGWStats;
                curGWStats = await getStatData(i, currentLeague);
                totalScore = curGWStats.filter((team) => team.owner_id === entry_id)[0]
                  .total_points;
                scores.push({gw: i, score: totalScore})
            }
        } else {
            for (var y = currentGW - 2; y < currentGW; y++) {
                let curGWStats;
                curGWStats = await getStatData(y, currentLeague);
                totalScore = curGWStats.filter((team) => team.owner_id === entry_id)[0]
                  .total_points;
                scores.push({gw: y, score: totalScore});
            }
        }
    }

    return scores;
};

export default PlayoffScore;
