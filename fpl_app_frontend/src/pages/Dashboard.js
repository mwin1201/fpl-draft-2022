import React, { useState, useEffect } from "react";
import TeamStats from "../components/TeamStats";
import Standings from "../components/Standings";
import FixtureHistory from "../components/FixtureHistory";
import UpcomingFixtures from "../components/UpcomingFixtures";

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
            <TeamStats owner_entry_id={217515}/>

            <h2>Standings</h2>
            <Standings 
                standings={JSON.parse(localStorage.getItem("standings"))}
                teams = {JSON.parse(localStorage.getItem("league_entries"))}
            />

            <h2>Recent Fixtures</h2>
            <FixtureHistory owner_id={217931}/>

            <h2>Upcoming Fixtures</h2>
            <UpcomingFixtures owner_id={217931} />
        </section>
    )
};

export default Dashboard;