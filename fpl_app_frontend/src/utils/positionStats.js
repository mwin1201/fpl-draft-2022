

// goal of this helper function is to restructure the gameweek stats arrays stored in local storage in a 
// way that allows for position stats to appear in a nice way when rendered on the page in react
// example:
// {
//     "minutes": 847,
//     "position_minutes": [
//         "GKP_minutes": 90,
//         "DEF_minutes": 157,
//         "MID_minutes": 341,
//         "FWD_minutes": 259
//     ],
//     "goals_scored": 6,
//     "position_goals_scored": [
//         "GKP_goals_scored": 0,
//         "DEF_goals_scored": 0,
//         "MID_goals_scored": 2,
//         "FWD_goals_scored": 4,
//     ],
//     "assists": 5,
//     "position_assists": [
//         "GKP_assists": 0,
//         "DEF_assists": 0,
//         "MID_assists": 4,
//         "FWD_assists": 1,
//     ],
//     "clean_sheets": 4,
//     "position_clean_sheets": [
//         "GKP_clean_sheets": 0,
//         "DEF_clean_sheets": 0,
//         "MID_clean_sheets": 2,
//         "FWD_clean_sheets": 2,
//     ],
//     "goals_conceded": 10,
//     "position_goals_conceded": [
//         "GKP_goals_conceded": 2,
//         "DEF_goals_conceded": 3,
//         "MID_goals_conceded": 3,
//         "FWD_goals_conceded": 2,
//     ],
//     "yellow_cards": 1,
//     "position_yellow_cards": [
//         "GKP_yellow_cards": 0,
//         "DEF_yellow_cards": 1,
//         "MID_yellow_cards": 0,
//         "FWD_yellow_cards": 0,
//     ],
//     "red_cards": 0,
//     "position_red_cards": [
//         "GKP_red_cards": 0,
//         "DEF_red_cards": 0,
//         "MID_red_cards": 0,
//         "FWD_red_cards": 0,
//     ],
//     "bonus": 10,
//     "position_bonus": [
//         "GKP_bonus": 0,
//         "DEF_bonus": 0,
//         "MID_bonus": 6,
//         "FWD_bonus": 4,
//     ],
//     "total_points": 71,
//     "position_total_points": [
//         "GKP_total_points": 1,
//         "DEF_total_points": 3,
//         "MID_total_points": 38,
//         "FWD_total_points": 29,
//     ]
//     "teamId": 82391,
//     "person": "Mo Money Mo Problems",
//     "league_entry": 82627
// }
const positionStats = (totalStatsArr) => {

    console.log("stats ", totalStatsArr);


    const createPositionArrays = (position, curTeamObj, positionStats) => {
        let positionAbbreviation;
        if (position === 1) {
            positionAbbreviation = "GKP";
        }
        else if (position === 2) {
            positionAbbreviation = "DEF";
        }
        else if (position === 3) {
            positionAbbreviation = "MID";
        }
        else {
            positionAbbreviation = "FWD";
        }
        const statList = ["minutes", "goals_scored", "assists", "clean_sheets", "goals_conceded", "yellow_cards", "red_cards", "bonus", "total_points"];
        for (var y = 0; y < statList.length; y++) {
            let curStat = statList[y];
            let individualStat = positionStats[positionAbbreviation + "_" + curStat];
            let key = "position_" + statList[y];
            let positionObjKey = positionAbbreviation + "_" + curStat;
            curTeamObj[key][0][positionObjKey] = individualStat;
        }

        return curTeamObj;
    };

    const startBuilding = (totalStatsArr) => {
        let buildArr = [];
        console.log("build ", totalStatsArr[0].minutes)
        for (var i = 0; i < totalStatsArr.length; i++) {
            let team = {};
            // enter in the total stats first
            team.minutes = totalStatsArr[i].minutes;
            team.goals_scored = totalStatsArr[i].goals_scored;
            team.assists = totalStatsArr[i].assists;
            team.clean_sheets = totalStatsArr[i].clean_sheets;
            team.goals_conceded = totalStatsArr[i].goals_conceded;
            team.yellow_cards = totalStatsArr[i].yellow_cards;
            team.red_cards = totalStatsArr[i].red_cards;
            team.bonus = totalStatsArr[i].bonus;
            team.total_points = totalStatsArr[i].total_points;
            team.teamId = totalStatsArr[i].teamId;
            team.person = totalStatsArr[i].person;
            team.league_entry = totalStatsArr[i].league_entry;
            team.position_minutes = [{}];
            team.position_goals_scored = [{}];
            team.position_assists = [{}];
            team.position_clean_sheets = [{}];
            team.position_goals_conceded = [{}];
            team.position_yellow_cards = [{}];
            team.position_red_cards = [{}];
            team.position_bonus = [{}];
            team.position_total_points = [{}];
            team.teamId = totalStatsArr[i].teamId;
            team.person = totalStatsArr[i].person;
            team.league_entry = totalStatsArr[i].league_entry;
            // GKP stats array
            let GKPstats = Object.fromEntries(Object.entries(totalStatsArr[i]).filter(([key]) => key.includes("GKP")));
            team = createPositionArrays(1, team, GKPstats);
            // DEF stats array
            let DEFstats = Object.fromEntries(Object.entries(totalStatsArr[i]).filter(([key]) => key.includes("DEF")));
            team = createPositionArrays(2, team, DEFstats);
            // MID stats array
            let MIDstats = Object.fromEntries(Object.entries(totalStatsArr[i]).filter(([key]) => key.includes("MID")));
            team = createPositionArrays(3, team, MIDstats);
            // FWD stats array
            let FWDstats = Object.fromEntries(Object.entries(totalStatsArr[i]).filter(([key]) => key.includes("FWD")));
            team = createPositionArrays(4, team, FWDstats);
            
            buildArr.push(team);
    
        }
        return buildArr;
    };

    return startBuilding(totalStatsArr);

};

export default positionStats;