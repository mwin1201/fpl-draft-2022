import React, { useState } from "react";
import {Link, useNavigate} from "react-router-dom"

// there are issues with the filtering functionality i need to fix

const PremPlayers = () => {
    const [filterPoints, setFilterPoints] = useState(0);

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
        //let team = document.getElementById("team").value;
        //console.log("points ", points);
        //console.log("team ", team);
        setFilterPoints(points);
        //setFilterTeam(team);
        //console.log(filterPoints, filterTeam);
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
                    <button type="submit">Submit</button>
                </form>
            </div>


            <h3>Filtered Players</h3>
            {players.filter(player =>
                (player.total_points >= filterPoints)
            )
            .sort((a, b) => b.total_points - a.total_points)
            .map((filteredPlayer,i) => (
                <div key={filteredPlayer.id}>
                   #{i}: {filteredPlayer.first_name} {filteredPlayer.second_name} - {filteredPlayer.total_points} points
                </div>
            ))}

            <h3>Players</h3>
            {players.map((player) => (
                <div key={player.id}>
                    {player.first_name} {player.second_name} - {player.total_points} points
                </div>
            ))}

        </div>
    )

};

export default PremPlayers;