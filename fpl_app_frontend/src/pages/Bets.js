import React, { useState, useEffect } from "react";
import Spinner from 'react-bootstrap/Spinner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSackDollar } from '@fortawesome/free-solid-svg-icons';
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
    const [walletValue, setWalletValue] = useState();

    useEffect(() => {

        const getFixtureData = async (event) => {
            let currentOrigin = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_prodOrigin : "http://localhost:5000";
            return axios.get(`${currentOrigin}/fpl/getFixtureData/` + event)
            .then((apiResponse) => {
                return apiResponse.data.filter((match) => match.started === false);
            })
        };

        const getWalletValue = async (owner_id) => {
            let currentOrigin = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_prodOrigin : "http://localhost:5000";
            return axios.get(`${currentOrigin}/api/wallets/owner/` + owner_id)
            .then((apiResponse) => {
                return apiResponse.data.total;
            })
            .catch(err => console.error(err));
        };

        const start = async () => {
            const gw = JSON.parse(localStorage.getItem("current_gameweek")) + 1;
            const ownerId = JSON.parse(localStorage.getItem("current_user")).fpl_id;
            setFixtures(await getFixtureData(gw));
            setWalletValue(await getWalletValue(ownerId));
            setIsLoading(false);
        };

        start();

    },[]);

    const getFixtureData = async (event) => {
        let currentOrigin = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_prodOrigin : "http://localhost:5000";
        return axios.get(`${currentOrigin}/fpl/getFixtureData/` + event)
        .then((apiResponse) => {
            return apiResponse.data.filter((match) => match.started === false);
        })
    };

    const getTeamName = (teamId) => {
        const teams = JSON.parse(localStorage.getItem("teams"));
        let singleTeam = teams.filter((team) => team.id === teamId);
        return(singleTeam[0].short_name);
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
        return axios.get(`${currentOrigin}/api/bets/owner/` + JSON.parse(localStorage.getItem("current_user")).fpl_id + "/fixture/" + fixture_id)
            .then((response) => {
                if (Array.isArray(response.data)) {
                    return {result: false, data: null};
                } else {
                    return {result: true, data: response.data};
                }
            })
    };

    const editBet = async (betData, currentBet) => {
        let currentOrigin = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_prodOrigin : "http://localhost:5000";
        axios.put(`${currentOrigin}/api/bets`, betData)
        .then(async (response) => {
            if (response.status === 200) {
                alert("Bet successfully edited");
                await changeWalletValue(betData, currentBet.amount);
            }
        })
        .catch(err => {
            alert("There was an error editing your bet");
        });
    };

    const changeWalletValue = async (data, originalBetAmount) => {
        const owner = data.owner_id;
        const betAmount = data.amount;
        const newWalletTotal = walletValue - (betAmount - originalBetAmount);
        let currentOrigin = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_prodOrigin : "http://localhost:5000";
        axios.put(`${currentOrigin}/api/wallets`, {total: newWalletTotal, owner_id: owner})
        .then((apiResponse) => {
            if (apiResponse.status === 200) {
                setWalletValue(newWalletTotal);
            }
        })
        .catch(err => console.error(err));
    };

    const postBet = async (betData) => {
        // check wallet value
        if (walletValue >= betData.amount) {
            let currentOrigin = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_prodOrigin : "http://localhost:5000";
            axios.post(`${currentOrigin}/api/bets`, betData)
            .then(async (response) => {
                if (response.status === 200) {
                    alert("Successfully placed bet");
                    await changeWalletValue(betData, 0);
                }
            })
            .catch(err => {
                alert("There was an error submitting your bet");
            })
        }
        else {
            alert("Not enough money in your wallet to make that bet.");
        }
    };

    const handleBet = async (event) => {
        event.preventDefault();
        const clickedIndex = event.target.id.split("-")[1];
        let {result, data} = await checkIfBetExists(event.target.dataset.fixture_id);
        let bet = {
            fixture_id: parseInt(event.target.dataset.fixture_id),
            gameweek: parseInt(event.target.dataset.gameweek),
            team_h: parseInt(event.target.dataset.team_h),
            team_h_prediction: checkTeamPredictions(document.getElementById("home-" + clickedIndex)),
            team_a: parseInt(event.target.dataset.team_a),
            team_a_prediction: checkTeamPredictions(document.getElementById("away-" + clickedIndex)),
            amount: parseInt(document.getElementById("amount-" + clickedIndex).value),
            owner_id: JSON.parse(localStorage.getItem("current_user")).fpl_id
        };

        if (!result) {
            await postBet(bet);
        } else {
            let betConfirmation = window.confirm("Do you want to edit this existing bet you've made");
            if (betConfirmation) {
                await editBet(bet, data);
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
            <div>
                <FontAwesomeIcon icon={faSackDollar} size="2xl"  /> <h3><span>{walletValue}</span></h3>
            </div>
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
                            <th>Game</th>
                            <th>A</th>
                            <th>H</th>
                            <th>$$</th>
                            <th>Bet</th>
                        </tr>
                    </thead>
                    <tbody>
                        {fixtures.map((fixture, index) => (
                            <tr key={fixture.code}>
                                <td>{index + 1}</td>
                                <td><button id={"away-" + index} className="grey-background" onClick={handleWin}>{getTeamName(fixture.team_a)}</button></td>
                                <td><button id={"home-" + index} className="grey-background" onClick={handleWin}>{getTeamName(fixture.team_h)}</button></td>
                                <td><input type="number" id={"amount-" + index} name="amount" min="0" style={{width: '40px'}}></input></td>
                                <td><button id={"bet-" + index} data-fixture_id={fixture.code} data-gameweek={fixture.event} data-team_a={fixture.team_a} data-team_h={fixture.team_h} onClick={handleBet}>Bet</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>
        </main>
    );
};

export default Bets;