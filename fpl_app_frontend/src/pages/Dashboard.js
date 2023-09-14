import React, { useState, useEffect } from "react";
import TeamStats from "../components/TeamStats";
import Standings from "../components/Standings";
import FixtureHistory from "../components/FixtureHistory";
import UpcomingFixtures from "../components/UpcomingFixtures";
import PersonalBets from "../components/Bets";
import DataLoad from "../data/DataLoad";
import Spinner from 'react-bootstrap/Spinner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSackDollar } from '@fortawesome/free-solid-svg-icons';
const axios = require('axios').default;

const Dashboard = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [walletValue, setWalletValue] = useState();
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
            if (currentLeague !== primary_league_id) {
                const currentLeagueData = new Promise( async (resolve, reject) => {
                    const load = await DataLoad(currentLeague);
                    if (load) {
                        resolve("Data has loaded");
                    } else {
                        reject("Data did not load");
                    }
                });
                currentLeagueData.then(() => {
                    setIsLoading(false);
                    getWalletValue();
                })
                .catch(() => setIsError(true));
            } else {
                const primaryLeagueData = new Promise( async (resolve, reject) => {
                    const primaryLoad = await DataLoad(primary_league_id);
                    if (primaryLoad) {
                        resolve("Data has loaded");
                    } else {
                        reject("Data did not load");
                    }
                });
                primaryLeagueData.then(() => {
                    setIsLoading(false);
                    getWalletValue();
                })
                .catch(() => setIsError(true));
            }
        };

        const getWalletValue = async () => {
            const ownerId = JSON.parse(localStorage.getItem("current_user")).fpl_id;
            let currentOrigin = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_prodOrigin : "http://localhost:5000";
            axios.get(`${currentOrigin}/api/wallets/owner/` + ownerId)
            .then((apiResponse) => {
                 setWalletValue(apiResponse.data.total);
            })
            .catch(err => console.error(err));
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
        <main>
            {JSON.parse(localStorage.getItem("current_league")) === JSON.parse(localStorage.getItem("current_user")).primary_league_id
                ?
                <section>
                    <div>
                        <h4>Quick Actions</h4>
                        <button onClick={handleLeagueToggle}>Toggle Leagues</button>
                        {isLoading ? <span>Refreshing data...<Spinner animation="border" variant="success" /></span> : ""}
                    </div>

                    <h1>{ team_name }</h1>
                    <TeamStats owner_entry_id={entry_id}/>

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
                        {isLoading ? <span>Refreshing data...<Spinner animation="border" variant="success" /></span> : ""}
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