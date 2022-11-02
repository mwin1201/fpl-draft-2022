import React, { useEffect, useState } from "react";
import {Link, useNavigate} from "react-router-dom"
const axios = require("axios").default;


const Homepage = () => {
    const [teamData, setTeamData] = useState([]);
    const [leagueData, setLeagueData] = useState("");
    const [standingsData, setStandingsData] = useState([]);
    const [fixtureData, setFixtureData] = useState([]);

    useEffect(() => {
        getData();
    },[]);

    const getData = () => {
        axios.get("http://localhost:5000/getTeams")
            .then((apiTeamResponse) => {
                console.log(apiTeamResponse);
                setLeagueData(apiTeamResponse.data.league);
                setStandingsData(apiTeamResponse.data.standings);
                setFixtureData(apiTeamResponse.data.matches);
                setTeamData(apiTeamResponse.data.league_entries);
            })
    };

    const navigate = useNavigate();
    const goToFixtures = () => {
        navigate("/fixtureHistory", {
            state: {
                data: fixtureData
            }
        });
    };

    const getEntryName = (entry_id) => {
        let oneTeam = teamData.filter((team) => {
            return team.id === entry_id;
        });
        return oneTeam[0].entry_name;
    };


    return (
        <main>
            <div>
                <h1>FPL DRAFT 2022/23</h1>
                <h2>{leagueData.name}</h2>
            </div>
            <div>
                <h3>The participants</h3>
                {teamData.map((team) => (
                    <div key={team.id}>{team.player_first_name} {team.player_last_name} - {team.entry_name}</div>
                ))}
            </div>
            <div>
                <h3>League Standings</h3>
                <div>Player ID - Wins - Draws - Losses - Pts For - Pts Against - Total Table Pts</div>
                {standingsData.map((player) => (
                    <div key={player.league_entry}>
                        {getEntryName(player.league_entry)} - {player.matches_won} - {player.matches_drawn} - 
                        {player.matches_lost} - {player.points_for} - {player.points_against} - {player.total}
                    </div>
                ))}
            </div>
            <div>
                <Link
                    to="/fixtureHistory"
                    state={{data: fixtureData}}
                >
                </Link>
                <button onClick={goToFixtures}>
                        Fixture History
                </button>
            </div>
        </main>
    )
};

export default Homepage;