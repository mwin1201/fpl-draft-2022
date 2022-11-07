import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
const axios = require('axios').default;

const Lineups = () => {

    const location = useLocation();
    console.log(location.state.data);

    useEffect(() => {
        getLineups(173696,15);
    })

    const getLineups = (team, gameweek) => {
        axios.get("http://localhost:5000/getLineups/" + team + "/" + gameweek)
        .then((apiResponse) => {
            console.log("response",apiResponse);
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
            <div>
                {location.state.data.map((team) => (
                        <div key={team.id}>
                            {team.entry_name}
                        </div>
                    ))}
            </div>
        </div>
    )

};

export default Lineups;