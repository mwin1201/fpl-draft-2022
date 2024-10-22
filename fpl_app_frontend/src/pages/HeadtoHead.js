import React, {useState, useEffect} from "react";
import LeagueAlert from "../alerts/LeagueAlert.js";
import Spinner from 'react-bootstrap/Spinner';
const axios = require('axios').default;

const HeadtoHead = () => {
    const [currentGameweek, setCurrentGameweek] = useState(JSON.parse(localStorage.getItem("current_gameweek")));
    const [selectedGameweek, setSelectedGameweek] = useState(JSON.parse(localStorage.getItem("current_gameweek")));
    const [isLoading, setIsLoading] = useState(true);
    const [matchupData, setMatchupData] = useState();

    useEffect(() => {
        setIsLoading(true);

        const getGameweekStats = async (curGW) => {
            let currentOrigin = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_prodOrigin : "http://localhost:5000";
            return axios.get(`${currentOrigin}/fpl/getStats/` + curGW)
            .then((apiResponse) => {
                return [apiResponse.data.elements, apiResponse.data.fixtures];
            })
        };

        const getLineups = async (team, gameweek, stats, premFixtures) => {
            let currentOrigin = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_prodOrigin : "http://localhost:5000";
            return axios.get(`${currentOrigin}/fpl/getLineups/` + team + "/" + gameweek)
            .then((apiResponse) => {
                return getLineupStats(apiResponse.data.picks, stats, premFixtures);
            })
        };

        const getPlayerName = (playerId) => {
            const allPlayers = JSON.parse(localStorage.getItem("elements"));
            const singlePlayer = allPlayers.filter((player) => player.id === playerId);
            return singlePlayer[0].first_name + " " + singlePlayer[0].second_name;
        };

        const checkForMoreGames = (playerStatArray, fixtures) => {
            const arrayLength = playerStatArray.length;
            for (var i = 0; i < arrayLength; i++) {
                let singleFixture = fixtures.filter((fixture) => fixture.id === playerStatArray[i][1]);
                if (singleFixture[0].finished === false) {
                    return "False";
                }
            }
            return "True";
        };

        const getTeamId = (element, fixtures) => {
            const allPlayers = JSON.parse(localStorage.getItem("elements"));
            const singlePlayer = allPlayers.filter((player) => player.id === element);
            return getSingleFixture(singlePlayer[0].team, fixtures, element);
        };

        const getSingleFixture = (team, fixtures, element) => {
            const singleFixture = fixtures.filter((fixture) => fixture.team_a === team || fixture.team_h === team);
            if (singleFixture[0].started === false) {
                return "-";
            }
            return getBPSdata(singleFixture[0], element);
        };

        const getBPSdata = (fixture, element) => {
            const bps_stats = fixture.stats.filter((stat) => stat["s"] === "bps");
            const home_data = bps_stats[0]["h"];
            const away_data = bps_stats[0]["a"];
            const all_data = home_data.concat(away_data);
            const sorted_data = all_data.sort((a, b) => b.value - a.value);
            return topThreeBPS(sorted_data, element);
        };

        const topThreeBPS = (sortedData, element) => {
            const indexOfElement = sortedData.findIndex((data) => data.element === element);
            if (indexOfElement === -1) {
                return "-";
            }
            const bpsValue = sortedData[indexOfElement].value;
            if (indexOfElement === 0) {
                return 3;
            } else if (indexOfElement === 1 && bpsValue === sortedData[0].value) {
                return 3;
            } else if (indexOfElement === 1 && bpsValue !== sortedData[0].value) {
                return 2;
            } else if (indexOfElement === 2 && bpsValue === sortedData[1].value && bpsValue === sortedData[0].value) {
                return 3;
            } else if (indexOfElement === 2 && bpsValue === sortedData[1].value) {
                return 2;
            } else if (indexOfElement === 2 && bpsValue !== sortedData[1].value) {
                return 1;
            } else {
                return "-";
            }
        };

        const getLineupStats = (lineup, allStats, games) => {
            let finalArr = [];
            for (var i = 0; i < lineup.length; i++) {
                let playerObj = {}
                playerObj["id"] = lineup[i].element;
                playerObj["position"] = lineup[i].position;
                playerObj["name"] = getPlayerName(lineup[i].element);
                playerObj["points"] = allStats[lineup[i].element].stats["total_points"];
                playerObj["bonus"] = getTeamId(lineup[i].element, games);
                playerObj["minutes"] = allStats[lineup[i].element].stats["minutes"];
                playerObj["gameweek_complete"] = checkForMoreGames(allStats[lineup[i].element].explain, games)
                finalArr.push(playerObj);
            }
            return finalArr;
        };

        const createFinalArr = async (teams, fixtures, stats, gameweek, premFixtures) => {
            let finalArr = [];
            for (var i = 0; i < fixtures.length; i++) {
                let matchupObj = {};
                matchupObj["team1_id"] = fixtures[i].league_entry_1;
                matchupObj["team1_entry_id"] = teams.filter((team) => team.id === fixtures[i].league_entry_1)[0].entry_id;
                matchupObj["team1_name"] = teams.filter((team) => team.id === fixtures[i].league_entry_1)[0].entry_name;
                matchupObj["team1_points"] = fixtures[i].league_entry_1_points;
                matchupObj["team2_id"] = fixtures[i].league_entry_2;
                matchupObj["team2_entry_id"] = teams.filter((team) => team.id === fixtures[i].league_entry_2)[0].entry_id;
                matchupObj["team2_name"] = teams.filter((team) => team.id === fixtures[i].league_entry_2)[0].entry_name;
                matchupObj["team2_points"] = fixtures[i].league_entry_2_points;
                matchupObj["team1_lineup"] = await getLineups(teams.filter((team) => team.id === fixtures[i].league_entry_1)[0].entry_id, gameweek, stats, premFixtures);
                matchupObj["team2_lineup"] = await getLineups(teams.filter((team) => team.id === fixtures[i].league_entry_2)[0].entry_id, gameweek, stats, premFixtures);
                finalArr.push(matchupObj);
            }
            return finalArr;
        };

        const start = async () => {
            let currentGW = selectedGameweek;
            let entries = JSON.parse(localStorage.getItem("league_entries"));
            let currentFixtures = JSON.parse(localStorage.getItem("matches")).filter((fixture) => fixture.event == currentGW);
            let [gwStats, premFixtures] = await getGameweekStats(currentGW);
            let matchupArray = await createFinalArr(entries, currentFixtures, gwStats, currentGW, premFixtures);
            setMatchupData(matchupArray);
            setIsLoading(false);
        };

        start();
    },[selectedGameweek])

    const handleGameweekSubmit = async (event) => {
        event.preventDefault();
        let gameweek = document.getElementById("gameweek").value;
        setSelectedGameweek(gameweek);
    };

    const checkSubstitution = (minutes, finished, position) => {
        if (minutes === 0 && finished === "True" && position < 12) {
            return "yellow-highlight";
        }
        else {
            return "";
        }
    };

    const calcPtsForStarters = (lineup) => {
        let total = 0;
        for (var i = 0; i < 11; i++) {
            total += lineup[i].points;
        }
        return total;
    };

    if (currentGameweek === 1 && JSON.parse(localStorage.getItem(`gw_${currentGameweek}_stats`)) === null) {
        return (
            <main>
                <h2>Still waiting for the start of the 2023 season!</h2>
            </main>
        );
    }

    if (isLoading) {
        return(
            <main>
                <span>Loading...<Spinner animation="border" variant="success" /></span>
            </main>
        )
    }

    return (
        <main>
            <LeagueAlert data={{user: JSON.parse(localStorage.getItem("current_user")), league: JSON.parse(localStorage.getItem("current_league")), leagueData: JSON.parse(localStorage.getItem("league_data"))}}/>
            <section>
                <form id="gameweekFilter" onSubmit={handleGameweekSubmit}>
                    <label htmlFor="gameweek">Choose a gameweek:</label>
                    <input type="number" id="gameweek" name="gameweek" min="1" max={currentGameweek} defaultValue={selectedGameweek}></input>
                    <button type="submit">Submit</button>
                </form>
            </section>

            <section>
                {matchupData.map((matchup) => (
                    <div key={matchup.team1_id} className="flex-table">
                        <h2 className="table-item">{matchup.team1_name} {calcPtsForStarters(matchup.team1_lineup)}pts vs {matchup.team2_name} {calcPtsForStarters(matchup.team2_lineup)}pts</h2>
                        <table className="table-data table-item">
                            <thead>
                                <tr>
                                    <th>Pos</th>
                                    <th>Player</th>
                                    <th>Pts</th>
                                    <th>Bonus</th>
                                    <th>Min</th>
                                    <th>Done</th>
                                </tr>
                            </thead>
                        {matchup.team1_lineup.map((player) => (
                            <tbody key={player.id}>
                                <tr className={player.position > 11 ? "grey-highlight" : ""}>
                                    <td>{player.position}</td>
                                    <td>{player.name}</td>
                                    <td>{player.points}</td>
                                    <td>{player.bonus}</td>
                                    <td className={checkSubstitution(player.minutes, player.gameweek_complete, player.position)}>{player.minutes}</td>
                                    <td className={player.gameweek_complete === "True" ? "red-highlight" : "green-highlight"}>{player.gameweek_complete}</td>
                                </tr>
                            </tbody>
                        ))}
                        </table>
                        <table className="table-data table-item">
                            <thead>
                                    <tr>
                                        <th>Pos</th>
                                        <th>Player</th>
                                        <th>Pts</th>
                                        <th>Bonus</th>
                                        <th>Min</th>
                                        <th>Done</th>
                                    </tr>
                                </thead>
                            {matchup.team2_lineup.map((player) => (
                                <tbody key={player.id}>
                                    <tr className={player.position > 11 ? "grey-highlight" : ""}>
                                        <td>{player.position}</td>
                                        <td>{player.name}</td>
                                        <td>{player.points}</td>
                                        <td>{player.bonus}</td>
                                        <td className={checkSubstitution(player.minutes, player.gameweek_complete, player.position)}>{player.minutes}</td>
                                        <td className={player.gameweek_complete === "True" ? "red-highlight" : "green-highlight"}>{player.gameweek_complete}</td>
                                    </tr>
                                </tbody>
                            ))}
                        </table>
                    </div>
                ))}
            </section>
        </main>
    )

}

export default HeadtoHead;
