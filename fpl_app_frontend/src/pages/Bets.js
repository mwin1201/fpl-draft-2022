import React, { useState, useEffect } from "react";
import Spinner from 'react-bootstrap/Spinner';
const axios = require('axios').default;

const Bets = () => {
    // 1. This page will contain the functionality to make bets against game week fixtures that have not happened yet.
    // 2. Default list of fixtures will be upcoming gameweek that has not yet started
        // a. Check current gameweek and current gameweek complete localstorage variables
        // b. Make appropriate call to fpl endpoint based on data in a
    // 3. Will need a global variable or something to track the amount of money in user wallet (probably state variable)
    // 4. Bet buttons will appear for each fixture in the gameweek as long as wallet amount > 0
    // 5. Bet buttons will turn to edit buttons if bet has been submitted for fixture
    // 6. Cancel buttons will display next to edit buttons. When clicked they will delete bet from table and add amount back to wallet
    // 7. Consider adding a "paid" column in the Bets table so that we know when a bet has been paid out

    const [isLoading, setIsLoading] = useState(true);
    const [visibleGW, setVisibleGW] = useState(JSON.parse(localStorage.getItem("current_gameweek")) + 1);
    const [fixtures, setFixtures] = useState();

    useEffect(() => {

        const getFixtureData = async (event) => {
            let currentOrigin = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_prodOrigin : "http://localhost:5000";
            return axios.get(`${currentOrigin}/fpl/getFixtureData/` + event)
            .then((apiResponse) => {
                return apiResponse.data;
            })
        };


        const start = async () => {
            const gw = JSON.parse(localStorage.getItem("current_gameweek")) + 1;
            setFixtures(await getFixtureData(gw));
            setIsLoading(false);
        };

        start();

    },[]);

    const getFixtureData = async (event) => {
        let currentOrigin = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_prodOrigin : "http://localhost:5000";
        return axios.get(`${currentOrigin}/fpl/getFixtureData/` + event)
        .then((apiResponse) => {
            return apiResponse.data;
        })
    };

    const getTeamName = (teamId) => {
        const teams = JSON.parse(localStorage.getItem("teams"));
        let singleTeam = teams.filter((team) => team.id === teamId);
        return(singleTeam[0].name);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const gameweek = document.getElementById("gameweek").value;
        const fixtures = await getFixtureData(gameweek);
        setFixtures(fixtures);
        setVisibleGW(gameweek);
    };

    if (isLoading) {
        return(
            <main>
                <span>Loading...<Spinner animation="border" variant="success" /></span>
            </main>
        );
    }

    return (
        <main>
            <form id="gw-search" onSubmit={handleSubmit}>
                <h2>Search Gameweek Prem Fixtures</h2>
                <label htmlFor="gameweek">Select a Gameweek: </label>
                <input type="number" id="gameweek" name="gameweek" min={visibleGW} max="38"></input>
                <button type="submit">Submit</button>
            </form>

            <h2>
                Fixtures for Gameweek {visibleGW}
            </h2>
            <section>
                <table className="table-data">
                    <thead>
                        <tr>
                            <th>Match #</th>
                            <th>AWAY</th>
                            <th>HOME</th>
                        </tr>
                    </thead>
                    <tbody>
                        {fixtures.map((fixture, index) => (
                            <tr key={fixture.code}>
                                <td>{index + 1}</td>
                                <td>{getTeamName(fixture.team_a)}</td>
                                <td>{getTeamName(fixture.team_h)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>
        </main>
    );


};

export default Bets;