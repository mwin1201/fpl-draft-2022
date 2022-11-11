import React, { useEffect } from "react";
import {Link, useNavigate} from "react-router-dom"
import getLeagueData from "../data/ApiCalls";
import getPlayers from "../data/Players";


const Homepage = () => {

    useEffect(() => {
        localStorage.clear();
        getLeagueData();
        getPlayers();
    },[]);

    let teamData = JSON.parse(localStorage.getItem("league_entries"));
    let leagueData = JSON.parse(localStorage.getItem("league_data"));
    let standingsData = JSON.parse(localStorage.getItem("standings"));

    const navigate = useNavigate();
    const goToFixtures = () => {
        navigate("/fixtureHistory");
    };

    const goToPremPlayers = () => {
        navigate("/premPlayers");
    };

    const goToLineups = () => {
        navigate("/Lineups");
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
                <Link to="/fixtureHistory"></Link>
                <button onClick={goToFixtures}>
                        Fixture History
                </button>
            </div>
            <div>
                <Link to="/premPlayers"></Link>
                <button onClick={goToPremPlayers}>
                    See Players
                </button>
            </div>
            <div>
                <Link to="/Lineups"></Link>
                <button onClick={goToLineups}>
                    See Team Lineups
                </button>
            </div>
        </main>
    )
};

export default Homepage;