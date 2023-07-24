import React, {useState, useEffect} from "react";
import LeagueAlert from "../alerts/LeagueAlert.js";
const axios = require('axios').default;

const HeadtoHead = () => {
    const [currentGameweek, setCurrentGameweek] = useState(JSON.parse(localStorage.getItem("current_gameweek")));
    const [isLoading, setIsLoading] = useState(true);
    const [matchupData, setMatchupData] = useState();

    useEffect(() => {
        setIsLoading(true);

        const getGameweekStats = async (curGW) => {
            let currentOrigin = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_prodOrigin : "http://localhost:5000";
            return axios.get(`${currentOrigin}/getStats/` + curGW)
            .then((apiResponse) => {
                return [apiResponse.data.elements, apiResponse.data.fixtures];
            })
        };

        const getLineups = async (team, gameweek, stats, premFixtures) => {
            let currentOrigin = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_prodOrigin : "http://localhost:5000";
            return axios.get(`${currentOrigin}/getLineups/` + team + "/" + gameweek)
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

        const getLineupStats = (lineup, allStats, games) => {
            let finalArr = [];
            for (var i = 0; i < lineup.length; i++) {
                let playerObj = {}
                playerObj["id"] = lineup[i].element;
                playerObj["position"] = lineup[i].position;
                playerObj["name"] = getPlayerName(lineup[i].element);
                playerObj["points"] = allStats[lineup[i].element].stats["total_points"];
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
            let currentGW = currentGameweek;
            let entries = JSON.parse(localStorage.getItem("league_entries"));
            let currentFixtures = JSON.parse(localStorage.getItem("matches")).filter((fixture) => fixture.event == currentGW);
            let [gwStats, premFixtures] = await getGameweekStats(currentGW);
            let matchupArray = await createFinalArr(entries, currentFixtures, gwStats, currentGW, premFixtures);
            setMatchupData(matchupArray);
            setIsLoading(false);
        };

        start();
    },[currentGameweek])

    const handleGameweekSubmit = async (event) => {
        event.preventDefault();
        let gameweek = document.getElementById("gameweek").value;
        setCurrentGameweek(gameweek);
    };

    const checkSubstitution = (minutes, finished, position) => {
        if (minutes == 0 && finished == "True" && position < 12) {
            return "yellow-highlight";
        }
        else {
            return "";
        }
    };

    if (isLoading) {
        return(
            <main>
                <p>Loading data...</p>
            </main>
        )
    }

    return (
        <main>
            <LeagueAlert data={{user: JSON.parse(localStorage.getItem("current_user")), league: JSON.parse(localStorage.getItem("current_league")), leagueData: JSON.parse(localStorage.getItem("league_data"))}}/>
            <section>
                <form id="gameweekFilter" onSubmit={handleGameweekSubmit}>
                    <label htmlFor="gameweek">Choose a gameweek:</label>
                    <input type="number" id="gameweek" name="gameweek" min="0" max="38" defaultValue={currentGameweek}></input>
                    <button type="submit">Submit</button>
                </form>
            </section>

            <section>
                {matchupData.map((matchup) => (
                    <div key={matchup.team1_id} className="flex-table">
                        <h2 className="table-item">{matchup.team1_name} {matchup.team1_points}pts vs {matchup.team2_name} {matchup.team2_points}pts</h2>
                        <table className="table-data table-item">
                            <thead>
                                <tr>
                                    <th>Position</th>
                                    <th>Player</th>
                                    <th>Points</th>
                                    <th>Minutes</th>
                                    <th>Finished</th>
                                </tr>
                            </thead>
                        {matchup.team1_lineup.map((player) => (
                            <tbody key={player.id}>
                                <tr className={player.position > 11 ? "grey-highlight" : ""}>
                                    <td>{player.position}</td>
                                    <td>{player.name}</td>
                                    <td>{player.points}</td>
                                    <td className={checkSubstitution(player.minutes, player.gameweek_complete, player.position)}>{player.minutes}</td>
                                    <td className={player.gameweek_complete === "True" ? "red-highlight" : "green-highlight"}>{player.gameweek_complete}</td>
                                </tr>
                            </tbody>
                        ))}
                        </table>
                        <table className="table-data table-item">
                            <thead>
                                    <tr>
                                        <th>Position</th>
                                        <th>Player</th>
                                        <th>Points</th>
                                        <th>Minutes</th>
                                        <th>Finished</th>
                                    </tr>
                                </thead>
                            {matchup.team2_lineup.map((player) => (
                                <tbody key={player.id}>
                                    <tr className={player.position > 11 ? "grey-highlight" : ""}>
                                        <td>{player.position}</td>
                                        <td>{player.name}</td>
                                        <td>{player.points}</td>
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