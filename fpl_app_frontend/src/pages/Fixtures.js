import React, { useState } from "react";
import {Link, useNavigate} from "react-router-dom"

const Fixtures = () => {
    const [filterTeam, setFilterTeam] = useState(0);

    let fixtureData = JSON.parse(localStorage.getItem("matches"));
    let leagueTeams = JSON.parse(localStorage.getItem("league_entries"));

    const getTeamName = (teamId) => {
        let filterTeam = leagueTeams.filter((leagueTeam) => {
            return leagueTeam.id === teamId
        });
        return filterTeam[0].entry_name;
    };
    

    const navigate = useNavigate();
    const goToHomepage = () => {
        navigate("/");
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        let teamSelected = document.getElementById("leagueTeam").value;
        setFilterTeam(teamSelected);

    };

    return (
        <div>
            <div>
                <Link to="/"></Link>
                <button onClick={goToHomepage}>
                    Homepage
                </button>
            </div>
            <h3>Filters</h3>
            <div>
                <form id="filters" onSubmit={handleSubmit}>
                    <label htmlFor="leagueTeam">Select team: </label>
                    <select name="leagueTeam" id="leagueTeam">
                        {leagueTeams.map((leagueTeam) => (
                            <option key={leagueTeam.entry_id} value={leagueTeam.id}>{leagueTeam.entry_name}</option>
                        ))}
                    </select>
                    <button type="submit">Submit</button>
                </form>
            </div>
            <h1>Fixture History</h1>
            {!filterTeam ?
                <div>
                {fixtureData.map((fixture,i) => (
                    <div key={i}>
                        <h3>Week {fixture.event}</h3>
                        {getTeamName(fixture.league_entry_1)}: {fixture.league_entry_1_points}pts vs {getTeamName(fixture.league_entry_2)}: {fixture.league_entry_2_points}pts
                    </div>
                ))}
                </div>
                :
                <div>
                    <h1>YOOOOOO wtf {filterTeam}</h1>
                {fixtureData.filter((fixture) => ((fixture.league_entry_1 === filterTeam) || (fixture.league_entry_2 === filterTeam)))
                .map((filteredFixture,i) => (
                    <div key={i}>
                        <h3>Week {filteredFixture.event}</h3>
                        {getTeamName(filteredFixture.league_entry_1)}: {filteredFixture.league_entry_1_points}pts vs {getTeamName(filteredFixture.league_entry_2)}: {filteredFixture.league_entry_2_points}pts
                    </div>
                ))}
                </div>
            }
        </div>
    );

};

export default Fixtures;