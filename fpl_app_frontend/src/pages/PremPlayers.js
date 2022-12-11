import React, { useState } from "react";
import {Link, useNavigate} from "react-router-dom"

const PremPlayers = () => {
    const [filterPoints, setFilterPoints] = useState(0);
    const [filterTeam, setFilterTeam] = useState(0);
    const [players, setPlayers] = useState(JSON.parse(localStorage.getItem("elements")));

    let playerPositions = JSON.parse(localStorage.getItem("element_types"));
    let premTeams = JSON.parse(localStorage.getItem("teams"));
    let playerOwnership = JSON.parse(localStorage.getItem("player_ownership"));
    let leagueTeams = JSON.parse(localStorage.getItem("league_entries"));
  
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

    const getOwner = (playerId) => {
        let singlePlayer = playerOwnership.filter((player) => player.element === playerId);
        if (singlePlayer[0].owner) {
            let team = leagueTeams.filter((team) => team.entry_id === singlePlayer[0].owner);
            return (
                <em>Owned by {team[0].entry_name}</em>
            );
        }
        else {
            return (
                <mark>Available!</mark>
            );
        }
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
                        <option value="">All Teams</option>
                        {premTeams.map((team) => (
                            <option key={team.id} value={team.id}>{team.name}</option>
                        ))}
                    </select>
                    <button type="submit">Submit</button>
                </form>
            </div>


            <h3>Filtered Players</h3>
            {filterTeam ?
                <div>
                    {players.filter(player =>
                        (player.total_points >= filterPoints) && (player.team == filterTeam)
                    )
                    .sort((a, b) => b.total_points - a.total_points)
                    .map((filteredPlayer,i) => (
                        <div key={filteredPlayer.id}>
                        #{i+1}: {filteredPlayer.first_name} {filteredPlayer.second_name} - {filteredPlayer.total_points} points ({getOwner(filteredPlayer.id)})
                        </div>
                    ))}
                </div> :
                <div>
                    {players.filter(player =>
                        (player.total_points >= filterPoints)
                    )
                    .sort((a, b) => b.total_points - a.total_points)
                    .map((filteredPlayer,i) => (
                        <div key={filteredPlayer.id}>
                        #{i+1}: {filteredPlayer.first_name} {filteredPlayer.second_name} - {filteredPlayer.total_points} points ({getOwner(filteredPlayer.id)})
                        </div>
                    ))}
                </div>
            }

        </div>
    )

};

export default PremPlayers;