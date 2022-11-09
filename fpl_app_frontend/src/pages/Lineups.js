import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
const axios = require('axios').default;

const Lineups = () => {

    const [teamLineups, setTeamLineups] = useState([]);
    const [players, setPlayers] = useState([]);


    const location = useLocation();
    const leagueTeams = location.state.data;

    useEffect(() => {
        getLineups(173696,15);
        getPlayers();
    },[])

    const getLineups = (team, gameweek) => {
        axios.get("http://localhost:5000/getLineups/" + team + "/" + gameweek)
        .then((apiResponse) => {
            setTeamLineups(apiResponse.data.picks);
        })
    };

    const getPlayers = () => {
        axios.get("http://localhost:5000/getPremPlayers")
            .then((apiResponse) => {
                console.log(apiResponse.data.elements);
                setPlayers(apiResponse.data.elements);
            })
    };

    return (
        <div>
            <h1>
                Hello Lineups!
            </h1>
            <h3>
                Max's Teams
            </h3>
                {players.filter((player) => (
                    teamLineups.find((plyer) => player.id === plyer.element)
                ))
                .map((filteredPlayer,i) => (
                    <div key={filteredPlayer.id}>
                        {filteredPlayer.first_name} {filteredPlayer.second_name} {filteredPlayer.total_points}
                    </div>
                ))}
                <h3>
                    Teams
                </h3>
                <div>
                    {leagueTeams.map((team) => (
                        <div key={team.entry_id}>
                            {team.entry_name}
                        </div>
                    ))}
                </div>

        </div>
    )

};

export default Lineups;