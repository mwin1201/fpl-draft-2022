import React, { useState } from "react";
import LeagueAlert from "../alerts/LeagueAlert.js";

const Fixtures = () => {
    const [fixtureData, setFixtureData] = useState(JSON.parse(localStorage.getItem("matches")));
    const [filterTeam, setFilterTeam] = useState();

    //let fixtureData = JSON.parse(localStorage.getItem("matches"));
    let leagueTeams = JSON.parse(localStorage.getItem("league_entries"));

    const getTeamName = (teamId) => {
        let filterTeam = leagueTeams.filter((leagueTeam) => {
            return leagueTeam.id === teamId
        });
        return filterTeam[0].entry_name;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        let fixtureArr = JSON.parse(localStorage.getItem("matches"));
        let teamSelected = document.getElementById("leagueTeam").value;
        setFilterTeam(teamSelected);
        setFixtureData(fixtureArr.filter((fixture) => (fixture.league_entry_1 == teamSelected) || (fixture.league_entry_2 == teamSelected)));
    };

    const handleGameweekSubmit = async (event) => {
        event.preventDefault();
        let fixtureArr = JSON.parse(localStorage.getItem("matches"));
        let gameweek = document.getElementById("gameweek").value;
        setFixtureData(fixtureArr.filter((fixture) => (fixture.event == gameweek)));
    };

    const checkWinorLoss = (team, entry, score1, score2) => {
        if (team == filterTeam && entry === "1" && score1 > score2) {
            return "green-highlight";
        }
        else if (team == filterTeam && entry === "1" && score1 < score2) {
            return "red-highlight";
        }
        else if (team == filterTeam && entry === "2" && score2 < score1) {
            return "red-highlight";
        }
        else if (team == filterTeam && entry === "2" && score2 > score1) {
            return "green-highlight";
        }
        else {
            return "";
        }
    };

    return (
        <main>
            <LeagueAlert data={{user: JSON.parse(localStorage.getItem("current_user")), league: JSON.parse(localStorage.getItem("current_league")), leagueData: JSON.parse(localStorage.getItem("league_data"))}}/>
            <h3>Search Fixtures by League Team</h3>
            <div>
                <form id="teamFilters" onSubmit={handleSubmit}>
                    <label htmlFor="leagueTeam">Select team: </label>
                    <select name="leagueTeam" id="leagueTeam">
                        {leagueTeams.map((leagueTeam) => (
                            <option key={leagueTeam.entry_id} value={leagueTeam.id}>{leagueTeam.entry_name}</option>
                        ))}
                    </select>
                    <button type="submit">Submit</button>
                </form>
            </div>
            <div>
                <form id="gameweekFilter" onSubmit={handleGameweekSubmit}>
                    <label htmlFor="gameweek">Choose a gameweek:</label>
                    <input type="number" id="gameweek" name="gameweek" min="0" max="38" defaultValue="1"></input>
                    <button type="submit">Submit</button>
                </form>
            </div>
            <h1>Fixture History</h1>
            <section>
                <table className="table-data">
                    <thead>
                        <tr>
                            <th>GW</th>
                            <th>Team 1</th>
                            <th>Pts</th>
                            <th>Pts</th>
                            <th>Team 2</th>
                        </tr>
                    </thead>
                    <tbody>
                        {fixtureData.map((fixture,i) => (
                            <tr key={i}>
                                <td>{fixture.event}</td>
                                <td>{getTeamName(fixture.league_entry_1)}</td>
                                <td className={checkWinorLoss(fixture.league_entry_1, "1", fixture.league_entry_1_points, fixture.league_entry_2_points)}>{fixture.league_entry_1_points}</td>
                                <td className={checkWinorLoss(fixture.league_entry_2, "2", fixture.league_entry_1_points, fixture.league_entry_2_points)}>{fixture.league_entry_2_points}</td>
                                <td>{getTeamName(fixture.league_entry_2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>
        </main>
    );
};

export default Fixtures;