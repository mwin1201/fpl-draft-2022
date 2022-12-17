
const ManagerOfTheMonth = (gameweek) => {

    const getEventScores = (premEvent) => {
        const matches = JSON.parse(localStorage.getItem("matches"));
        let eventScores = matches.filter((match) => match.event === premEvent);

        return eventScores;
    };

    const createTeam1Array = (scores) => {
        let team1Arr = [];
        for (var i = 0; i < scores.length; i++) {
            let obj = {};
            obj.team = scores[i].league_entry_1;
            obj.points = scores[i].league_entry_1_points;
            team1Arr.push(obj);
        }
        return team1Arr;
    };

    const createTeam2Array = (scores) => {
        let team2Arr = [];
        for (var i = 0; i < scores.length; i++) {
            let obj = {};
            obj.team = scores[i].league_entry_2;
            obj.points = scores[i].league_entry_2_points;
            team2Arr.push(obj);
        }
        return team2Arr;
    };

    const mergeArrays = (final, team1, team2) => {
        if (final.length == 0) {
            final = team1.concat(team2).sort((a,b) => b.team - a.team);
            return final;
        } else {
            let tempArr = [];
            tempArr = team1.concat(team2).sort((a,b) => b.team - a.team);
            for (var i = 0; i < tempArr.length; i++) {
                final[i].points += tempArr[i].points;
            }
            return final;
        }
    };

    const getTopScorer = (allScores) => {
        allScores.sort((a,b) => b.points - a.points);
        return [allScores[0]];
    };

    const gameweekLoop = (currentGW) => {
        let finalArr = [];
        let start;
        
        if (currentGW > 3) {
            start = currentGW - 3;
        }
        else {
            start = 1;
        }

        for (var i = start; i <= currentGW; i++) {
            let eventData = getEventScores(i);
            let team1Arr = createTeam1Array(eventData);
            let team2Arr = createTeam2Array(eventData);
            finalArr = mergeArrays(finalArr, team1Arr, team2Arr);
        }
        let topManager = getTopScorer(finalArr);
        return topManager;
    };

    return gameweekLoop(gameweek);
};

export default ManagerOfTheMonth;