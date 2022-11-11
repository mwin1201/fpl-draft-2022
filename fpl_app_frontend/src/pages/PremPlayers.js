import React, { useState } from "react";
import {Link, useNavigate} from "react-router-dom"

// there are issues with the filtering functionality i need to fix

const PremPlayers = () => {
    const [filterPoints, setFilterPoints] = useState(0);
    const [filterTeam, setFilterTeam] = useState(1);

    let playerPositions = JSON.parse(localStorage.getItem("element_types"));
    let players = JSON.parse(localStorage.getItem("elements"));
    let premTeams = JSON.parse(localStorage.getItem("teams"));
  
    const navigate = useNavigate();
    const goToHomepage = () => {
        navigate("/");
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        let points = document.getElementById("points").value;
        let teamId = document.getElementById("team").value;
        setFilterPoints(points);
        setFilterTeam(teamId);
    };


    return (
        <div>
            <div>
                <Link to="/"></Link>
                <button onClick={goToHomepage}>
                    Homepage
                </button>
            </div>
            <h3>Player Positions</h3>
            {playerPositions.map((position) => (
                <div key={position.id}>
                    {position.singular_name} - {position.element_count} FPL players
                </div>
            ))}

            <h3>Premier Teams</h3>
            {premTeams.map((team) => (
                <div key={team.id}>
                    ID:{team.id} - {team.name}
                </div>
            ))}

            <h3>Filters</h3>
            <div>
                <form id="filters" onSubmit={handleSubmit}>
                    <label htmlFor="points">Points: </label>
                    <input type="number" id="points" name="points" min="0"></input>
                    <label htmlFor="team">Prem Team: </label>
                    <select name="team" id="team">
                        {premTeams.map((team) => (
                            <option key={team.id} value={team.id}>{team.name}</option>
                        ))}
                    </select>
                    <button type="submit">Submit</button>
                </form>
            </div>


            <h3>Filtered Players</h3>
            {players.filter(player =>
                (player.total_points >= filterPoints) && (player.team == filterTeam)
            )
            .sort((a, b) => b.total_points - a.total_points)
            .map((filteredPlayer,i) => (
                <div key={filteredPlayer.id}>
                   #{i}: {filteredPlayer.first_name} {filteredPlayer.second_name} - {filteredPlayer.total_points} points
                </div>
            ))}

        </div>
    )

};

export default PremPlayers;