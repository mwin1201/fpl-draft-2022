import React, { useState, useEffect } from "react";
const axios = require('axios').default;

const PremFixtures = () => {
    const [displayArr, setDisplayArr] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [sortStat, setSortStat] = useState("");
    const [currentFixtures, setCurrentFixtures] = useState([]);

    useEffect(() => {
        setIsLoading(true);

        const getFixtureData = async (event) => {
            let currentOrigin = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_prodOrigin : "http://localhost:5000";
            return axios.get(`${currentOrigin}/getFixtureData/` + event)
            .then((apiResponse) => {
                return apiResponse.data;
            })
        };

        const breakdownStats = (stats, homeOrAway) => {
            let statArr = [];
            const statList = [
                "goals_scored",
                "assists",
                "own_goals",
                "penalties_saved",
                "penalties_missed",
                "yellow_cards",
                "red_cards",
                "saves",
                "bonus",
                "bps"
            ];

            for (var i = 0; i < statList.length; i++) {
                let statCount = 0;
                let obj = {};
                let singleStat = stats.filter((stat) => stat.identifier === statList[i]);

                if (homeOrAway === "a") {
    
                    if (singleStat[0].a.length > 0) {
                        for (var y = 0; y < singleStat[0].a.length; y++) {
                            statCount += singleStat[0].a[y].value;
                        }
                    }
                } else {
                    if (singleStat[0].h.length > 0) {
                        for (var y = 0; y < singleStat[0].h.length; y++) {
                            statCount += singleStat[0].h[y].value;
                        }
                    }
                }
                let key = singleStat[0].identifier;
                obj[key] = statCount;

                statArr.push(obj);
            }
            return statArr;
        };

        const createAwayArr = (fixtureData) => {
            let awayArr = [];
            for (var y = 0; y < fixtureData.length; y++) {
                let obj = {};
                obj.teamId = fixtureData[y].team_a;
                obj.goalsScored = fixtureData[y].team_a_score;
                obj.goalsAgainst = fixtureData[y].team_h_score;
                obj.stats = breakdownStats(fixtureData[y].stats,"a");
                awayArr.push(obj);
            }
            return awayArr;
        };

        const createHomeArr = (fixtureData) => {
            let homeArr = [];
            for (var y = 0; y < fixtureData.length; y++) {
                let obj = {};
                obj.teamId = fixtureData[y].team_h;
                obj.goalsScored = fixtureData[y].team_h_score;
                obj.goalsAgainst = fixtureData[y].team_a_score;
                obj.stats = breakdownStats(fixtureData[y].stats,"h");
                homeArr.push(obj);
            }
            return homeArr;
        };

        const mergeArrays = (final, away, home) => {
            if (final.length == 0) {
                final = away.concat(home).sort((a,b) => a.teamId - b.teamId);
                return final;
            } else {
                let tempArr = [];
                tempArr = away.concat(home).sort((a,b) => a.teamId - b.teamId);
                for (var i = 0; i < tempArr.length; i++) {
                    final[i].goalsScored += tempArr[i].goalsScored;
                    final[i].goalsAgainst += tempArr[i].goalsAgainst;
                    final[i].stats[0].goals_scored += tempArr[i].stats[0].goals_scored;
                    final[i].stats[1].assists += tempArr[i].stats[1].assists;
                    final[i].stats[2].own_goals += tempArr[i].stats[2].own_goals;
                    final[i].stats[3].penalties_saved += tempArr[i].stats[3].penalties_saved;
                    final[i].stats[4].penalties_missed += tempArr[i].stats[4].penalties_missed;
                    final[i].stats[5].yellow_cards += tempArr[i].stats[5].yellow_cards;
                    final[i].stats[6].red_cards += tempArr[i].stats[6].red_cards;
                    final[i].stats[7].saves += tempArr[i].stats[7].saves;
                    final[i].stats[8].bonus += tempArr[i].stats[8].bonus;
                    final[i].stats[9].bps += tempArr[i].stats[9].bps;
                }
                return final;
            }
        };

        const modifyArr = (premTeamStats) => {
            let newArr = [];
            for (var i = 0; i < premTeamStats.length; i++) {
                let statObj = {};
                for (var y = 0; y < premTeamStats[i].stats.length; y++) {
                    Object.assign(statObj,premTeamStats[i].stats[y]);
                }
                statObj.teamId = premTeamStats[i].teamId;
                statObj.goalsAgainst = premTeamStats[i].goalsAgainst;
                newArr.push(statObj);
            }
            return newArr;
        };

        const getCurrentFixtures = async (event) => {
            return await getFixtureData(event);
        };

        const getGWHistory = async () => {
            let finalArr = [];
            const currentGW = JSON.parse(localStorage.getItem("current_gameweek"));
            let start;

            if (currentGW > 3) {
                start = currentGW - 3;
            }
            else {
                start = 1;
            }

            for (var i = start; i <= currentGW; i++) {
                let data = await getFixtureData(i);
                let awayArr = createAwayArr(data);
                let homeArr = createHomeArr(data);
                finalArr = mergeArrays(finalArr, awayArr, homeArr);
            }
            finalArr = (modifyArr(finalArr));
            const upcomingFixtures = await getCurrentFixtures(currentGW + 1);
            setCurrentFixtures(upcomingFixtures);
            setDisplayArr(finalArr);
            setIsLoading(false);
        };

        getGWHistory();

    },[]);

    const getTeamName = (teamId) => {
        const teams = JSON.parse(localStorage.getItem("teams"));
        let singleTeam = teams.filter((team) => team.id === teamId);
        return(singleTeam[0].name);
    };

    const sortByKey = (array, key) => {
        return array.sort((a,b) => {
            var x = a[key];
            var y = b[key];
            return (key==="teamId" ? (x - y) : (y - x));
        })
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const stat = document.getElementById("stats").value;
        let sortedArr = [...displayArr];
        sortedArr = sortByKey(sortedArr,stat);
        setDisplayArr(sortedArr);
    };

    if (isLoading) {
        return (
            <div>Loading...</div>
        );
    }


    return (
        <section>
            <h2>
                Upcoming Gameweek Fixtures
            </h2>
            <div>
                <u><strong>AWAY vs HOME</strong></u>
                {currentFixtures.map((fixture) => (
                    <div key={fixture.id}>
                        {getTeamName(fixture.team_a)} vs {getTeamName(fixture.team_h)}
                    </div>
                ))}
            </div>
            <h2>
                Prem Team Data from past 4 Gameweeks
            </h2>
            <form id="statSort" onSubmit={handleSubmit}>
                <label htmlFor="stats">Stats: </label>
                <select name="stats" id="stats">
                    <option value="teamId">Alphabetical</option>
                    <option value="goals_scored">Goals Scored</option>
                    <option value="goalsAgainst">Goals Against</option>
                    <option value="assists">Assists</option>
                    <option value="bonus">Bonus</option>
                    <option value="saves">Saves</option>
                    <option value="bps">BPS</option>
                    <option value="own_goals">Own Goals</option>
                    <option value="penalties_saved">Penalties Saved</option>
                    <option value="penalties_missed">Penalties Missed</option>
                    <option value="red_cards">Red Cards</option>
                    <option value="yellow_cards">Yellow Cards</option>
                </select>
                <button type="submit">Submit</button>
            </form>
            <div>
                {displayArr.map((team) => (
                    <div key={team.teamId}>
                        <h3>{getTeamName(team.teamId)}</h3>
                        <div>Goals Scored: {team.goals_scored}</div>
                        <div>Goals Against: {team.goalsAgainst}</div>
                        <div>Assists: {team.assists}</div>
                        <div>Own Goals: {team.own_goals}</div>
                        <div>Penalties Saved: {team.penalties_saved}</div>
                        <div>Penalties Missed: {team.penalties_missed}</div>
                        <div>Saves: {team.saves}</div>
                        <div>Yellow Cards: {team.yellow_cards}</div>
                        <div>Bonus: {team.bonus}</div>
                        <div>BPS: {team.bps}</div>
                    </div>
                ))}
            </div>
        </section>
    )

};

export default PremFixtures;
