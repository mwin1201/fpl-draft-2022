import React, { useState } from "react";
const axios = require('axios').default;

const Lineups = () => {
    const [teamLineups, setTeamLineups] = useState([]);
    const [playerFilter, setPlayerFilter] = useState(65420);
    const [gameweekFilter, setGameweekFilter] = useState(1);

    let players = JSON.parse(localStorage.getItem("elements"));
    let leagueTeams = JSON.parse(localStorage.getItem("league_entries"));

    const getLineups = (team, gameweek) => {
        let currentOrigin = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_prodOrigin : "http://localhost:5000";
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
        <main>
            <section>
                <h2>Find League Team Lineup for any Gameweek</h2>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="person">Choose a Team:</label>
                    <select name="person" id="person">
                        {leagueTeams.map((team) => (
                            <option key={team.id} value={team.entry_id}>{team.entry_name}</option>
                        ))}
                    </select>
                    <label htmlFor="gameweek">Choose a gameweek:</label>
                    <input type="number" id="gameweek" name="gameweek" min="0" max="38" defaultValue="1"></input>
                    <button type="submit">Submit</button>
                </form>
            </section>

            <h3>
                Team: {leagueTeams.filter(team => (
                    team.entry_id == playerFilter
                ))
                .map((filteredTeam) => (
                    <span key={filteredTeam.id}>{filteredTeam.entry_name}</span>
                ))} Gameweek: {gameweekFilter}
            </h3>

            <section>
                {players.filter((player) => (
                    teamLineups.find((plyer) => player.id === plyer.element)
                ))
                .sort((a, b) => b.total_points - a.total_points)
                .map((filteredPlayer,i) => (
                    <div key={filteredPlayer.id}>
                        {filteredPlayer.first_name} {filteredPlayer.second_name} {filteredPlayer.total_points}pts
                    </div>
                ))}
            </section>
        </main>
    )

};

export default Lineups;