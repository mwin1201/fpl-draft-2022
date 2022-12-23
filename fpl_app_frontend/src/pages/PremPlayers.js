import React, { useState } from "react";

const PremPlayers = () => {
    const [filterPoints, setFilterPoints] = useState(0);
    const [filterTeam, setFilterTeam] = useState(0);
    const [filterOwner, setFilterOwner] = useState(0);
    const [players, setPlayers] = useState(JSON.parse(localStorage.getItem("elements")));
    const [formSubmit, setFormSubmit] = useState(0);
    const [plyerOwnership, setPlyerOwnership] = useState([]);

    let playerPositions = JSON.parse(localStorage.getItem("element_types"));
    let premTeams = JSON.parse(localStorage.getItem("teams"));
    let playerOwnership = JSON.parse(localStorage.getItem("player_ownership"));
    let leagueTeams = JSON.parse(localStorage.getItem("league_entries"));

    const handleSubmit = async (event) => {
        event.preventDefault();
        let points = document.getElementById("points").value;
        let teamId = document.getElementById("team").value;
        setFilterPoints(points);
        setFilterTeam(teamId);
        setFormSubmit(0);
    };

    const handleOwnerSubmit = async (event) => {
        event.preventDefault();
        let owner = document.getElementById("owner").value;
        createNewArray();
        setFilterOwner(owner);
        setFormSubmit(1);
    };

    const createNewArray = () => {
        let newPlayerArray = [];
        for (var i = 0; i < playerOwnership.length; i++) {
            let newObj = {};
            let playerData = getPlayerData(playerOwnership[i].element);
            newObj = {...playerData, ...playerOwnership[i]};
            newPlayerArray.push(newObj);
        }
        setPlyerOwnership(newPlayerArray);
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

    const getType = (type) => {
        let elementType = playerPositions.filter((pos) => (pos.id == type));
        let elementObj = elementType[0];
        return elementObj.singular_name_short;
    };

    const getPlayerData = (playerId) => {
        let singlePlayer = players.filter((player) => ( player.id === playerId));
        let playerObj = singlePlayer[0];
        playerObj.elementType = getType(playerObj.element_type);
        return playerObj;
    };


    return (
        <main>
            <section>
                <h2>Filter Prem Players by Points and Team</h2>
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
            </section>

            <section>
                <h2>Filter Players by League Teams</h2>
                <form id="ownerFilter" onSubmit={handleOwnerSubmit}>
                    <label htmlFor="owner">Team: </label>
                    <select name="owner" id="owner">
                        <option value="">No Team Selected</option>
                        {leagueTeams.map((team) => (
                            <option key={team.entry_id} value={team.entry_id}>{team.entry_name}</option>
                        ))}
                    </select>
                    <button type="submit">Submit</button>
                </form>
            </section>


            <h2>Filtered Players</h2>
            {formSubmit ?
                <div>
                    {plyerOwnership.filter((player) => (
                        player.owner == filterOwner
                    ))
                    .sort((a,b) => a.element_type - b.element_type)
                    .map((filteredPlayer,i) => (
                        <div key={filteredPlayer.element} className="player-list">
                            #{i+1}: <strong>{filteredPlayer.elementType}</strong> {filteredPlayer.first_name} {filteredPlayer.second_name} - {filteredPlayer.total_points} points
                        </div>
                    ))}
                </div> :
                <div>
                    {filterTeam ?
                        <div>
                            {players.filter(player =>
                                (player.total_points >= filterPoints) && (player.team == filterTeam)
                            )
                            .sort((a, b) => b.total_points - a.total_points)
                            .map((filteredPlayer,i) => (
                                <div key={filteredPlayer.id} className="player-list">
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
                                <div key={filteredPlayer.id} className="player-list">
                                #{i+1}: {filteredPlayer.first_name} {filteredPlayer.second_name} - {filteredPlayer.total_points} points ({getOwner(filteredPlayer.id)})
                                </div>
                            ))}
                        </div>
                    }
                </div>
            }
        </main>
    )
};

export default PremPlayers;