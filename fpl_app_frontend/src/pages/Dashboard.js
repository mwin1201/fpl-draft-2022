import React, { useState, useEffect } from "react";
import TeamStats from "../components/TeamStats";
import Standings from "../components/Standings";

const Dashboard = () => {

    // Dashboard is only accessible to those who login
    // User, aka Owner, will be able to see:
    // 1. Team Name on Top
    // 2. Full Stat Card - both season card and gameweek card
    // 3. Standings with their specific name highlighted
    // 4. Personal Team Fixture History
    // 5. Wallet Value
    // 6. Bet History
    // 7. Possible Place to Make Bets

    return (
        <section>
            <h2>[TEAM NAME]</h2>
            <TeamStats owner_id={217515}/>

            <h2>Standings</h2>
            <Standings 
                standings={JSON.parse(localStorage.getItem("standings"))}
                teams = {JSON.parse(localStorage.getItem("league_entries"))}
            />
        </section>
    )
};

export default Dashboard;