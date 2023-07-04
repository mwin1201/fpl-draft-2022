import React, { useState, useEffect } from "react";
import TeamStats from "../components/TeamStats";

const Dashboard = () => {

    // Dashboard is only accessible to those who login
    // User, aka Owner, will be able to see:
    // 1. Team Name on Top
    // 2. Full Stat Card
    // 3. Standings with their specific name highlighted
    // 4. Personal Team Fixture History
    // 5. Wallet Value
    // 6. Bet History
    // 7. Possible Place to Make Bets

    return (
        <section>
            <h2>[TEAM NAME]</h2>
            <TeamStats owner_id={217515}/>
        </section>
    )
};

export default Dashboard;