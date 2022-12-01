import React, { useState } from "react";
import {Link, useNavigate} from "react-router-dom"
const axios = require('axios').default;

const Lineups = () => {
    const [teamLineups, setTeamLineups] = useState([]);
    const [playerFilter, setPlayerFilter] = useState(65420);
    const [gameweekFilter, setGameweekFilter] = useState(1);

    let players = JSON.parse(localStorage.getItem("elements"));
    let leagueTeams = JSON.parse(localStorage.getItem("league_entries"));

    const navigate = useNavigate();
    const goToHomepage = () => {
        navigate("/");
    };

    const getLineups = (team, gameweek) => {
        let currentOrigin = process.env.prodOrigin ? process.env.NODE_ENV == 'production' : "http://localhost:5000"
        axios.get(`${currentOrigin}/getLineups/` + team + "/" + gameweek)
        .then((apiResponse) => {
            setTeamLineups(apiResponse.data.picks);
        })
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        let leaguePlayer = document.getElementById("person").value;
        let gameweek = document.getElementById("gameweek").value;
        setPlayerFilter(leaguePlayer);
        setGameweekFilter(gameweek);
        getLineups(leaguePlayer, gameweek);
    };

    return (
        <div>
            <div>
                <Link to="/"></Link>
                <button onClick={goToHomepage}>
                    Homepage
                </button>
            </div>
            <div>
                <h2>
                    Filters
                </h2>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="person">Choose a player:</label>
                    <select name="person" id="person">
                        {leagueTeams.map((team) => (
                            <option key={team.id} value={team.entry_id}>{team.entry_name}</option>
                        ))}
                    </select>
                    <label htmlFor="gameweek">Choose a gameweek:</label>
                    <input type="number" id="gameweek" name="gameweek" min="0" max="38"></input>
                    <button type="submit">Submit</button>
                </form>
            </div>
            <h1>
                Hello Lineups!
            </h1>
            <h3>
                Team: {leagueTeams.filter(team => (
                    team.entry_id == playerFilter
                ))
                .map((filteredTeam) => (
                    <span key={filteredTeam.id}>{filteredTeam.entry_name}</span>
                ))} Gameweek: {gameweekFilter}
            </h3>
                {players.filter((player) => (
                    teamLineups.find((plyer) => player.id === plyer.element)
                ))
                .sort((a, b) => b.total_points - a.total_points)
                .map((filteredPlayer,i) => (
                    <div key={filteredPlayer.id}>
                        {filteredPlayer.first_name} {filteredPlayer.second_name} {filteredPlayer.total_points}
                    </div>
                ))}
        </div>
    )

};

export default Lineups;