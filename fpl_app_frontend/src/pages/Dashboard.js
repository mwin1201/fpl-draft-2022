import React, { useState, useEffect } from "react";
import TeamStats from "../components/TeamStats";
import Standings from "../components/Standings";
import FixtureHistory from "../components/FixtureHistory";
import UpcomingFixtures from "../components/UpcomingFixtures";
import DataLoad from "../data/DataLoad";
import Spinner from 'react-bootstrap/Spinner';

const Dashboard = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    // Dashboard is only accessible to those who login
    // User, aka Owner, will be able to see:
    // 1. Team Name on Top
    // 2. Full Stat Card - both season card and gameweek card
    // 3. Standings with their specific name highlighted
    // 4. Personal Team Fixture History
    // 5. Wallet Value
    // 6. Bet History
    // 7. Possible Place to Make Bets

    const { fpl_id, entry_id, team_name } = JSON.parse(localStorage.getItem("current_user"));

    useEffect(() => {
        const getData = async () => {
            const { primary_league_id } = JSON.parse(localStorage.getItem("current_user"));
            const currentLeague = JSON.parse(localStorage.getItem("current_league"));
            if (currentLeague) {
                const currentLeagueData = new Promise( async (resolve, reject) => {
                    const load = await DataLoad(currentLeague);
                    if (load) {
                        resolve("Data has loaded");
                    } else {
                        reject("Data did not load");
                    }
                });
                currentLeagueData.then(() => setIsLoading(false)).catch(() => setIsError(true));
            } else {
                const primaryLeagueData = new Promise( async (resolve, reject) => {
                    const primaryLoad = await DataLoad(primary_league_id);
                    if (primaryLoad) {
                        resolve("Data has loaded");
                    } else {
                        reject("Data did not load");
                    }
                });
                primaryLeagueData.then(() => setIsLoading(false)).catch(() => setIsError(true));
            }
        };

        getData();
    }, []);

    const handleLeagueToggle = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        const { primary_league_id, secondary_league_id } = JSON.parse(localStorage.getItem("current_user"));
        let currentLeague = JSON.parse(localStorage.getItem("current_league"));

        if (currentLeague === primary_league_id) {
            localStorage.setItem("current_league", secondary_league_id);
            await Promise.allSettled([
                DataLoad(secondary_league_id)
            ]).then(() => {
                setIsLoading(false);
            }).catch(() => setIsError(true));
        } else {
            localStorage.setItem("current_league", primary_league_id);
            await Promise.allSettled([
                DataLoad(primary_league_id)
            ]).then(() => {
                setIsLoading(false);
            }).catch(() => setIsError(true));
        }

    };

    if (isLoading) {
        return (
            <main>
                <span>Loading...<Spinner animation="border" variant="success" /></span>
            </main>
        );
    }

    if (isError) {
        return (
            <main>
                <h2>There is an error. Please try refreshing your screen.</h2>
            </main>
        );
    }

    return (
        <section>
            <div>
                <h3>Quick Actions</h3>
                <button onClick={handleLeagueToggle}>Toggle Leagues [viewing {JSON.parse(localStorage.getItem("current_league"))}]</button>
                {isLoading ? <span>Refreshing data...<Spinner animation="border" variant="success" /></span> : ""}
            </div>

            <h2 style={{textAlign:'center', fontWeight:600, fontSize: 40}}>{ team_name }</h2>
            <TeamStats owner_entry_id={entry_id}/>

            {/* <h2 style={{textAlign:'center'}}>Standings</h2> */}
            <Standings 
                standings={JSON.parse(localStorage.getItem("standings"))}
                teams = {JSON.parse(localStorage.getItem("league_entries"))}
            />

            <h2 style={{textAlign:'center', paddingTop:10}}>Recent Fixtures</h2>
            <FixtureHistory owner_id={fpl_id}/>

            <h2 style={{textAlign:'center', paddingTop:10}}>Upcoming Fixtures</h2>
            <UpcomingFixtures owner_id={fpl_id} />
        </section>
    )
};

export default Dashboard;