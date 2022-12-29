import React, { useState } from "react";

const Fixtures = () => {
    const [fixtureData, setFixtureData] = useState(JSON.parse(localStorage.getItem("matches")));

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
        setFixtureData(fixtureArr.filter((fixture) => (fixture.league_entry_1 == teamSelected) || (fixture.league_entry_2 == teamSelected)));
    };

    const handleGameweekSubmit = async (event) => {
        event.preventDefault();
        let fixtureArr = JSON.parse(localStorage.getItem("matches"));
        let gameweek = document.getElementById("gameweek").value;
        setFixtureData(fixtureArr.filter((fixture) => (fixture.event == gameweek)));
    };

    return (
        <main>
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
            <div>
            {fixtureData.map((fixture,i) => (
                <div key={i}>
                    <h3>Week {fixture.event}</h3>
                    {getTeamName(fixture.league_entry_1)}: {fixture.league_entry_1_points}pts vs {getTeamName(fixture.league_entry_2)}: {fixture.league_entry_2_points}pts
                </div>
            ))}
            </div>
        </main>
    );
};

export default Fixtures;