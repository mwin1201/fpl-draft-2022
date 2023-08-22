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

    const handleWin = async (event) => {
        event.preventDefault();
        const clickedTeam = event.target.id.split("-")[0];
        const clickedIndex = event.target.id.split("-")[1];
        let clickedButtonClassList = document.getElementById(event.target.id).classList;
        const notClickedTeam = clickedTeam === "away" ? "home" : "away";
        let notClickedButtonClass = document.getElementById(notClickedTeam + "-" + clickedIndex).classList;
        clickedButtonClassList.remove(...clickedButtonClassList);
        clickedButtonClassList.add("green-background");
        notClickedButtonClass.remove(...notClickedButtonClass);
        notClickedButtonClass.add("red-background");
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const gameweek = document.getElementById("gameweek").value;
        const fixtures = await getFixtureData(gameweek);
        setFixtures(fixtures);
        setVisibleGW(gameweek);
    };

    const checkTeamPredictions = (element) => {
        const classList = element.classList;
        if (classList.contains("green-background")) {
            return "win";
        } else if (classList.contains("red-background")) {
            return "loss";
        } else {
            return "draw";
        }
    };

    const checkIfBetExists = async (fixture_id) => {
        let currentOrigin = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_prodOrigin : "http://localhost:5000";
        axios.get(`${currentOrigin}/api/bets/owner/` + JSON.parse(localStorage.getItem("current_user")).fpl_id + "/fixture/" + fixture_id)
            .then((response) => {
                console.log(response.data);
                if (response.data) {
                    return true;
                } else {
                    return false;
                }
            })
    };

    const editBet = async (betData) => {
        let currentOrigin = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_prodOrigin : "http://localhost:5000";
        axios.put(`${currentOrigin}/api/bets`, betData)
        .then((response) => {
            alert("Bet successfully edited");
        })
        .catch(err => {
            alert("There was an error editing your bet");
        });
    };

    const postBet = async (betData) => {
        let currentOrigin = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_prodOrigin : "http://localhost:5000";
        axios.post(`${currentOrigin}/api/bets`, betData)
        .then((response) => {
            if (response.status === 200) {
                alert("Successfully placed bet");
            }
        })
        .catch(err => {
            alert("There was an error submitting your bet");
        })
    };

    const handleBet = async (event) => {
        event.preventDefault();
        console.log(event);
        const clickedIndex = event.target.id.split("-")[1];
        let newBet = await checkIfBetExists(event.target.dataset.fixture_id);
        let bet = {
            fixture_id: parseInt(event.target.dataset.fixture_id),
            team_h: parseInt(event.target.dataset.team_h),
            team_h_prediction: checkTeamPredictions(document.getElementById("home-" + clickedIndex)),
            team_a: parseInt(event.target.dataset.team_a),
            team_a_prediction: checkTeamPredictions(document.getElementById("away-" + clickedIndex)),
            amount: parseInt(document.getElementById("amount-" + clickedIndex).value),
            owner_id: JSON.parse(localStorage.getItem("current_user")).fpl_id
        };

        if (!newBet) {
            await postBet(bet);
        } else {
            let betConfirmation = window.confirm("Do you want to edit this existing bet you've made");
            alert(betConfirmation);
            if (betConfirmation) {
                await editBet(bet);
            } else {
                alert("Bet edit successfully cancelled");
            }
        } 
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
                            <th>Amount</th>
                            <th>Bet</th>
                        </tr>
                    </thead>
                    <tbody>
                        {fixtures.map((fixture, index) => (
                            <tr key={fixture.code}>
                                <td>{index + 1}</td>
                                <td><button id={"away-" + index} className="grey-background" onClick={handleWin}>{getTeamName(fixture.team_a)}</button></td>
                                <td><button id={"home-" + index} className="grey-background" onClick={handleWin}>{getTeamName(fixture.team_h)}</button></td>
                                <td><input type="number" id={"amount-" + index} name="amount" min="0"></input></td>
                                <td><button id={"bet-" + index} data-fixture_id={fixture.code} data-team_a={fixture.team_a} data-team_h={fixture.team_h} onClick={handleBet}>Bet</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>
        </main>
    );
};

export default Bets;