import React, { useState } from "react";

const FixtureHistory = ({ owner_id }) => {
    const [currentGameweek, setCurrentGameweek] = useState(JSON.parse(localStorage.getItem("current_gameweek")));
    const [fixtureData, setFixtureData] = useState(JSON.parse(localStorage.getItem("matches")));
    const [filterTeam, setFilterTeam] = useState(owner_id);
    const [recentFixtures, setRecentFixtures] = useState(fixtureData ? fixtureData.filter((fixture) => (fixture.event >= currentGameweek - 6)).filter((fixture) => (fixture.league_entry_1 == filterTeam) || (fixture.league_entry_2 == filterTeam)) : "");


    let leagueTeams = JSON.parse(localStorage.getItem("league_entries"));

    const getTeamName = (teamId) => {
        let filterTeam = leagueTeams.filter((leagueTeam) => {
            return leagueTeam.id === teamId
        });
        return filterTeam[0].entry_name;
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

    if (!(recentFixtures)) {
        return (
            <main>
                <section>
                    <h3>There is no fixture data to show.</h3>
                </section>
            </main>
        );
    };

    return (
        <main>
            <section>
                <table className="table-data">
                    <thead>
                        <tr>
                            <th>Gameweek</th>
                            <th>Team 1</th>
                            <th>Points</th>
                            <th>Points</th>
                            <th>Team 2</th>
                        </tr>
                    </thead>
                    <tbody>
                        {recentFixtures.map((fixture,i) => (
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

export default FixtureHistory;