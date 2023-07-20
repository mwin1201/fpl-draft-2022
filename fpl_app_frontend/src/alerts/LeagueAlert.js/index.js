import Alert from 'react-bootstrap/Alert';
import React, { useEffect, useState } from "react";

const LeagueAlert = ({ data }) => {
    useEffect(() => {
        const { primary_league_id } = data.user;
        let alert = document.getElementById("league-alert");
        if (primary_league_id === data.league) {
            alert.classList.add("hide-alert");
        } else {
            alert.classList.remove("hide-alert");
        }
    }, [data]);

    return (
        <div id='league-alert'>
            <Alert variant='info'>You are currently viewing data for secondary League: {data.leagueData.name} </Alert>
        </div>
    );
};

export default LeagueAlert;