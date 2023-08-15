import React, { useEffect, useState } from "react";

const UpcomingFixtures = ({ owner_id }) => {
    const [currentGameweek, setCurrentGameweek] = useState(JSON.parse(localStorage.getItem("current_gameweek")));
    const [fixtureData, setFixtureData] = useState(JSON.parse(localStorage.getItem("matches")));
    const [filterTeam, setFilterTeam] = useState(owner_id);
    const [leagueTeams, setLeagueTeams] = useState(JSON.parse(localStorage.getItem("league_entries")));
    const [upcomingFixtures, setUpcomingFixtures] = useState(() => {
        if (currentGameweek === 38) {
            return [];
        }
        else if (currentGameweek + 6 <= 38) {
            return fixtureData.filter((fixture) => (fixture.event > currentGameweek) && (fixture.event < currentGameweek + 6)).filter((fixture) => fixture.league_entry_1 === filterTeam || fixture.league_entry_2 === filterTeam);
        }
        else {
            return fixtureData.filter((fixture) => (fixture.event > currentGameweek) && (fixture.event < 39)).filter((fixture) => fixture.league_entry_1 === filterTeam || fixture.league_entry_2 === filterTeam);
        }
    });

    const getTeamName = (teamId) => {
        let filterTeam = leagueTeams.filter((leagueTeam) => {
            return leagueTeam.id === teamId
        });
        return filterTeam[0].entry_name;
    };


    return (
        <main>
            <section>
                {upcomingFixtures.length > 0 ?
                    <table className="table-data">
                        <thead>
                            <tr>
                                <th>GW</th>
                                <th>Team 1</th>
                                <th>vs</th>
                                <th>Team 2</th>
                            </tr>
                        </thead>
                        <tbody>
                            {upcomingFixtures.map((fixture,i) => (
                                <tr key={i}>
                                    <td>{fixture.event}</td>
                                    <td>{getTeamName(fixture.league_entry_1)}</td>
                                    <td>vs.</td>
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