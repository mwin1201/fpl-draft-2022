import React from "react";
import { useQuery } from "@tanstack/react-query";
import TeamStats from "../components/TeamStats";
import Standings from "../components/Standings";
import FixtureHistory from "../components/FixtureHistory";
import UpcomingFixtures from "../components/UpcomingFixtures";
import PersonalBets from "../components/Bets";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSackDollar } from '@fortawesome/free-solid-svg-icons';
import TeamForm from "../components/TeamForm";
import Loading from "../components/Loading";
import ErrorState from "../components/ErrorState";
import apiClient from "../api/client";
import { useCurrentUser } from "../context/CurrentUserContext";
import useLeagueData from "../hooks/useLeagueData";

const Dashboard = () => {
    // User + selected league now come from context instead of localStorage reads.
    const { currentUser, currentLeagueId, setCurrentLeagueId } = useCurrentUser();

    // React Query owns the load lifecycle for the selected league. Changing the
    // league id (via the toggle below) re-keys the query and triggers a reload.
    const { isLoading, isError, isFetching } = useLeagueData(currentLeagueId);

    const fpl_id = currentUser?.fpl_id;
    const entry_id = currentUser?.entry_id;
    const team_name = currentUser?.team_name;
    const primary_league_id = currentUser?.primary_league_id;
    const secondary_league_id = currentUser?.secondary_league_id;

    const { data: walletValue } = useQuery({
        queryKey: ["wallet", fpl_id],
        queryFn: () =>
            apiClient
                .get(`/api/wallets/owner/${fpl_id}`)
                .then((apiResponse) => apiResponse.data.total),
        enabled: fpl_id !== undefined && fpl_id !== null,
    });

    // Dashboard is only accessible to those who login
    // User, aka Owner, will be able to see:
    // 1. Team Name on Top
    // 2. Full Stat Card - both season card and gameweek card
    // 3. Standings with their specific name highlighted
    // 4. Personal Team Fixture History
    // 5. Wallet Value
    // 6. Bet History
    // 7. Possible Place to Make Bets

    const handleLeagueToggle = (event) => {
        event.preventDefault();
        const nextLeague =
            currentLeagueId === primary_league_id ? secondary_league_id : primary_league_id;
        setCurrentLeagueId(nextLeague);
    };

    if (!currentUser) {
        return (
            <ErrorState
                title="You're not logged in"
                message="Please log in to view your dashboard."
            />
        );
    }

    // While loading (initial) or refetching (after a league toggle) we hold the
    // full-screen loader so the child components never read half-updated data
    // out of localStorage.
    if (isLoading || isFetching) {
        return <Loading message="Loading all gameweek data..." />;
    }

    if (isError) {
        return <ErrorState />;
    }

    return (
        <main>
            {currentLeagueId === primary_league_id
                ?
                <section>
                    <div>
                        <h4>Quick Actions</h4>
                        <button onClick={handleLeagueToggle}>Toggle Leagues</button>
                    </div>

                    <h1>{ team_name }</h1>
                    <TeamStats owner_entry_id={entry_id}/>

                    <TeamForm
                        team_id={fpl_id}
                    />

                    <Standings 
                        standings={JSON.parse(localStorage.getItem("standings"))}
                        teams = {JSON.parse(localStorage.getItem("league_entries"))}
                    />

                    <h2>Past Fixtures</h2>
                    <FixtureHistory owner_id={fpl_id}/>

                    <h2>Upcoming Fixtures</h2>
                    <UpcomingFixtures owner_id={fpl_id} />

                    <div className="wallet-info">
                        <FontAwesomeIcon icon={faSackDollar} size="2xl"  /> <h3><span>{walletValue}</span></h3>
                    </div>
                    <PersonalBets owner_id={fpl_id}/>
                </section>
                :
                <section>
                    <div>
                        <h4>Quick Actions</h4>
                        <button onClick={handleLeagueToggle}>Toggle Leagues</button>
                    </div>

                    <Standings 
                        standings={JSON.parse(localStorage.getItem("standings"))}
                        teams = {JSON.parse(localStorage.getItem("league_entries"))}
                    />
                </section>
            }
            
        </main>
    )
};

export default Dashboard;
