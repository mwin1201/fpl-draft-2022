const axios = require('axios').default;

const seasonStats = async (index) => {
    const createLineupArr = async (currentGameweek) => {
        const leagueTeams = JSON.parse(localStorage.getItem("league_entries"));
        let fullLineupArr = [];
        for (var i = 0; i < leagueTeams.length; i++) {
            fullLineupArr.push({"teamId": leagueTeams[i].entry_id, "person": leagueTeams[i].entry_name, "league_entry": leagueTeams[i].id, "lineup": await Promise.all([getLineups(leagueTeams[i].entry_id, currentGameweek), apiTimeout(100)]).then((values) => values[0])});
        }
        return createStatArr(fullLineupArr, currentGameweek);
    };

    const createStatArr = async (allLineups, currentGameweek) => {
        let fullStatArr = [];
        for (var i = 0; i < allLineups.length; i++) {
            fullStatArr.push({"teamId": allLineups[i].teamId, "person": allLineups[i].person, "league_entry": allLineups[i].league_entry, "stats": await getPlayerStats(allLineups[i].lineup, currentGameweek)});
        }
        return modifyArr(fullStatArr, currentGameweek);
    };

    const modifyArr = (allStatArr, currentGameweek) => {
        let newArr = [];
        for (var i = 0; i < allStatArr.length; i++) {
            let statObj = {};
            for (var y = 0; y < allStatArr[i].stats.length; y++) {
                Object.assign(statObj,allStatArr[i].stats[y]);
            }
            statObj.teamId = allStatArr[i].teamId;
            statObj.person = allStatArr[i].person;
            statObj.league_entry = allStatArr[i].league_entry;
            newArr.push(statObj);
        }
        return newArr;
    };

    const getPlayerStats = async (teamPlayers, gameweek) => {
        const statList = ["minutes", "goals_scored", "assists", "clean_sheets", "goals_conceded", "yellow_cards", "red_cards", "bonus", "total_points"];
        let statArr = [];
        const allPlayerStats = await Promise.all([getStats(gameweek), apiTimeout(100)]).then((values) => values[0]);
        for (var y = 0; y < statList.length; y++) {
            let statCounter = 0;
            for (var i = 0; i < 11; i++) {
                statCounter += allPlayerStats[teamPlayers[i].element].stats[statList[y]];
            }
            let key = statList[y];
            let obj = {};
            obj[key] = statCounter;
            statArr.push(obj);
        }
        return statArr;
    };

    // timeout function to prevent overwhelming the FPL API
    const apiTimeout = (ms) => {
        return new Promise(resolve => setTimeout(resolve, ms));
    };

    // need to get team lineups per gameweek
    const getLineups = async (team,gameweek) => {
        let currentOrigin = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_prodOrigin : "http://localhost:5000";
        return axios.get(`${currentOrigin}/fpl/getLineups/` + team + "/" + gameweek)
        .then((apiResponse) => {
           return apiResponse.data.picks;
        })
    };

    // need to pull player stats per gameweek
    const getStats = async (gameweek) => {
        let currentOrigin = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_prodOrigin : "http://localhost:5000";
        return axios.get(`${currentOrigin}/fpl/getStats/` + gameweek)
            .then((apiResponse) => {
                return apiResponse.data.elements;
            })
    };

    const statLoop = async (index) => {
        let gameweekStats = await createLineupArr(index);
        localStorage.setItem(`gw_${index}_stats`, JSON.stringify(gameweekStats));
        return index;
    };

    return statLoop(index);
};

export default seasonStats;