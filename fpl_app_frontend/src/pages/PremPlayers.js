import React, { useEffect, useState } from "react";
const axios = require('axios').default;

// there are issues with the filtering functionality i need to fix

const PremPlayers = () => {
    const [playerPositions, setPlayerPositions] = useState([]);
    const [players, setPlayers] = useState([]);
    const [premTeams, setPremTeams] = useState([]);
    const [filterPoints, setFilterPoints] = useState(0);
    //const [filterTeam, setFilterTeam] = useState(0);

    useEffect(() => {
        getPlayers();
    },[])
  
    const getPlayers = () => {
        axios.get("http://localhost:5000/getPremPlayers")
            .then((apiResponse) => {
                console.log(apiResponse);
                setPlayerPositions(apiResponse.data.element_types);
                setPlayers(apiResponse.data.elements);
                setPremTeams(apiResponse.data.teams);
            })
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