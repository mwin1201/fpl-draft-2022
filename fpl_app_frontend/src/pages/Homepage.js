import React, { useEffect, useState } from "react";
const axios = require("axios").default;

const Homepage = () => {
    const [teamData, setTeamData] = useState([]);

    useEffect(() => {
        getTeamData();
    },[]);

    const getTeamData = () => {
        axios.get("http://localhost:5000/getTeams")
            .then((apiTeamResponse) => {
                setTeamData(apiTeamResponse.data.league_entries);
            })
    };

    return (
        <main>
            <div>
                <p>Hello!! FPL DRAFT</p>
            </div>
            <div>
                {teamData.map((team) => (
                    <div>{team.entry_name}</div>
                ))}
            </div>
        </main>
    )
};

export default Homepage;