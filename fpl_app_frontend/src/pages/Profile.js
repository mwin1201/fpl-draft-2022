import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import FixtureHistory from "../components/FixtureHistory";
import UpcomingFixtures from "../components/UpcomingFixtures";
import PersonalBets from "../components/Bets";
import Lineup from "../components/Lineup";
import TeamStats from "../components/TeamStats";
import WalletValue from "../components/WalletValue";
import TeamForm from "../components/TeamForm";

const Profile = () => {
    let { id: fpl_id} = useParams();
    fpl_id = parseInt(fpl_id);
    const ownerProfile = JSON.parse(localStorage.getItem("league_entries")).filter((team) => team.id === fpl_id);

    return (
        <main>
            <section>
                <h1>Profile for {ownerProfile[0].entry_name}</h1>
                <img className="avatar" src={ownerProfile[0].avatar} alt="Owner avatar"></img>

                <TeamStats owner_entry_id={ownerProfile[0].entry_id} />

                <TeamForm
                    team_id={ownerProfile[0].id} 
                    number={10}
                />

                <Lineup owner_id={ownerProfile[0].entry_id} />

                <h2>Past Fixtures</h2>
                <FixtureHistory owner_id={fpl_id}/>

                <h2>Upcoming Fixtures</h2>
                <UpcomingFixtures owner_id={fpl_id} />

                <WalletValue owner_id={fpl_id} />
                <PersonalBets owner_id={fpl_id}/>
            </section>
        </main>
    );
};

export default Profile;