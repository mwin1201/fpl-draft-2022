import React, { Suspense } from "react";
import { useParams } from "react-router-dom";
import FixtureHistory from "../components/FixtureHistory";
import UpcomingFixtures from "../components/UpcomingFixtures";
import Lineup from "../components/Lineup";
import TeamStats from "../components/TeamStats";
import TeamForm from "../components/TeamForm";
import ErrorState from "../components/ErrorState";

const Profile = () => {
    let { id } = useParams();
    const ownerId = parseInt(id, 10);

    const leagueEntries = JSON.parse(localStorage.getItem("league_entries")) || [];
    const owner = leagueEntries.find((team) => team.id === ownerId);

    if (!owner) {
        return (
            <ErrorState
                title="Team not found"
                message="This team is not part of the currently selected league."
            />
        );
    }

    return (
        <main>
            <section>
                <h1>Profile for {owner.entry_name}</h1>
                <h3>{owner.player_first_name} {owner.player_last_name}</h3>

                <TeamStats owner_entry_id={owner.entry_id} />

                <Suspense fallback={<div>Loading...</div>}>
                    <TeamForm team_id={owner.id} />
                </Suspense>

                <Lineup owner_id={owner.entry_id} />

                <h2>Past Fixtures</h2>
                <FixtureHistory owner_id={owner.id}/>

                <h2>Upcoming Fixtures</h2>
                <UpcomingFixtures owner_id={owner.id} />
            </section>
        </main>
    );
};

export default Profile;
