import React, { useEffect, useState } from "react";
const axios = require('axios').default;

const PremPlayers = () => {
    const [playerPositions, setPlayerPositions] = useState([]);
    const [players, setPlayers] = useState([]);
    const [premTeams, setPremTeams] = useState([]);

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
                    {team.name}
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