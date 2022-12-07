const axios = require('axios').default;

const seasonStats = async (currentGW, getDataBool) => {
    const createLineupArr = async (currentGameweek) => {
        const leagueTeams = JSON.parse(localStorage.getItem("league_entries"));
        let fullLineupArr = [];
        for (var i = 0; i < leagueTeams.length; i++) {
            fullLineupArr.push({"teamId": leagueTeams[i].entry_id, "person": leagueTeams[i].entry_name, "lineup": await getLineups(leagueTeams[i].entry_id, currentGameweek)});
        }
        return createStatArr(fullLineupArr, currentGameweek);
    };

    const createStatArr = async (allLineups, currentGameweek) => {
        let fullStatArr = [];
        for (var i = 0; i < allLineups.length; i++) {
            fullStatArr.push({"teamId": allLineups[i].teamId, "person": allLineups[i].person, "stats": await getPlayerStats(allLineups[i].lineup, currentGameweek)})
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
            newArr.push(statObj);
        }
        return newArr;
    };

    const getPlayerStats = async (teamPlayers, gameweek) => {
        const statList = ["minutes", "goals_scored", "assists", "clean_sheets", "goals_conceded", "yellow_cards", "red_cards", "bonus"];
        let statArr = [];
        const allPlayerStats = await getStats(gameweek);
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

    // need to get team lineups per gameweek
    const getLineups = async (team,gameweek) => {
        let currentOrigin = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_prodOrigin : "http://localhost:5000";
        return axios.get(`${currentOrigin}/getLineups/` + team + "/" + gameweek)
        .then((apiResponse) => {
           return apiResponse.data.picks;
        })
    };

    // need to pull player stats per gameweek
    const getStats = async (gameweek) => {
        let currentOrigin = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_prodOrigin : "http://localhost:5000";
        return axios.get(`${currentOrigin}/getStats/` + gameweek)
            .then((apiResponse) => {
                return apiResponse.data.elements;
            })
    };

    const statLoop = async (gameweek, dataBool) => {
        let start;
        if (dataBool) {
            start = 1
        }
        else {
            start = gameweek - 1
        }
        for (var i = start; i <= gameweek; i++) {
            let gameweekStats = await createLineupArr(i);
            localStorage.setItem(`gw_${i}_stats`, JSON.stringify(gameweekStats));
            if (i == gameweek) {
                return true;
            }
        }
    };

    const myPromise = new Promise((resolve, reject) => {
        const writeData = statLoop(currentGW, getDataBool);
        if (writeData) {
            resolve("Data written in storage");
        }
        else {
            reject("Something failed");
        }
    });

    return myPromise;
};

export default seasonStats;