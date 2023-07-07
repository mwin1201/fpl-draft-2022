import React, { useEffect, useState } from "react";

const UpcomingFixtures = ({ owner_id }) => {
    const [currentGameweek, setCurrentGameweek] = useState(JSON.parse(localStorage.getItem("current_gameweek")));
    const [fixtureData, setFixtureData] = useState(JSON.parse(localStorage.getItem("matches")));
    const [filterTeam, setFilterTeam] = useState(owner_id);
    const [leagueTeams, setLeagueTeams] = useState(JSON.parse(localStorage.getItem("league_entries")));
    const [upcomingFixtures, setUpcomingFixtures] = useState([]);

    useEffect(() => {
        const start = () => {
            const gw = JSON.parse(localStorage.getItem("current_gameweek"));
            const matches = JSON.parse(localStorage.getItem("matches"));
            if (gw === 38) {
                setUpcomingFixtures([]);
            }
            else if (gw + 6 <= 38) {
                setUpcomingFixtures(matches.filter((fixture) => (fixture.event > gw + 1) && (fixture.event < gw + 6)));
            }
            else {
                setUpcomingFixtures(matches.filter((fixture) => (fixture.event > gw + 1) && (fixture.event < 39)));
            }
        };

        start();
    }, [])


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


    return (
        <main>
            <section>
                {upcomingFixtures.length ? 
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
                            {upcomingFixtures.map((fixture,i) => (
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
                :
                    <div>
                        <h2>No More Upcoming Fixtures</h2>
                    </div>
                }
            </section>
        </main>
    );

};

export default UpcomingFixtures;