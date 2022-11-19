import React, { useState } from "react";
import {Link, useNavigate} from "react-router-dom"
const axios = require('axios').default;

const LeagueLeaders = () => {
    const [currentGameweek, setCurrentGameweek] = useState(JSON.parse(localStorage.getItem("current_gameweek")));
    const [displayArr, setDisplayArr] = useState([]);

    let fullLineupArr = [];
    let fullStatArr = [];

    const createLineupArr = async () => {
        const leagueTeams = JSON.parse(localStorage.getItem("league_entries"));
        for (var i = 0; i < leagueTeams.length; i++) {
            fullLineupArr.push({"teamId": leagueTeams[i].entry_id, "person": leagueTeams[i].entry_name, "lineup": await getLineups(leagueTeams[i].entry_id, currentGameweek)});
        }
        createStatArr(fullLineupArr);
    };

    const createStatArr = async (allLineups) => {
        for (var i = 0; i < allLineups.length; i++) {
            fullStatArr.push({"teamId": allLineups[i].teamId, "person": allLineups[i].person, "stats": await getPlayerStats(allLineups[i].lineup, currentGameweek)})
        }
        console.log("allStats", fullStatArr);
        setDisplayArr(fullStatArr);
    };

    const getPlayerStats = async (teamPlayers, gameweek) => {
        const statList = ["minutes", "goals_scored", "assists", "clean_sheets", "goals_conceded", "yellow_cards", "red_cards", "bonus"];
        let statArr = [];
        const allPlayerStats = await getStats(gameweek);
        for (var y = 0; y < statList.length; y++) {
            let statCounter = 0;
            for (var i = 0; i < 11; i++) {
                statCounter += allPlayerStats[teamPlayers[i].element].stats[statList[y]];
            }
            let key = statList[y];
            let obj = {};
            obj[key] = statCounter;
            statArr.push(obj);
        }
        return statArr;
    };

    // need to get team lineups per gameweek
    const getLineups = async (team,gameweek) => {
        return axios.get("http://localhost:5000/getLineups/" + team + "/" + gameweek)
        .then((apiResponse) => {
           return apiResponse.data.picks;
        })
    };

    // need to pull player stats per gameweek
    const getStats = async (gameweek) => {
        return axios.get("http://localhost:5000/getStats/" + gameweek)
            .then((apiResponse) => {
                return apiResponse.data.elements;
            })
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        let gameweek = document.getElementById("gameweek").value;
        setCurrentGameweek(gameweek);
        fullLineupArr = [];
        fullStatArr = [];
        createLineupArr();
    };

    const navigate = useNavigate();
    const goToHomepage = () => {
        navigate("/");
    };

    return (
        <section>
            <div>
                <Link to="/"></Link>
                <button onClick={goToHomepage}>
                    Homepage
                </button>
            </div>
            <form onSubmit={handleSubmit}>
                <label htmlFor="gameweek">Select a Gameweek:</label>
                <input type="number" id="gameweek" name="gameweek" min="0" max="38"></input>
                <button type="submit">Submit</button>
            </form>

            <h2>Starting Lineup Stats for Gameweek {currentGameweek ? currentGameweek : "TBD"}</h2>
            <div>
            {displayArr.map((team,index) => (
                <div key={index}>
                    <h3>Team: {team.person}</h3>
                    {team.stats.map((stat,index) => {
                        if (stat.minutes >= 0) {
                            return (
                            <div key={index}>
                                <p>{stat.minutes} minutes</p>
                            </div>
                            )
                        }
                        if (stat.goals_scored >= 0) {
                            return (
                                <div key={index}>
                                    <p>{stat.goals_scored} goals</p>
                                </div>
                            )
                        }
                        if (stat.assists >= 0) {
                            return (
                                <div key={index}>
                                    <p>{stat.assists} assists</p>
                                </div>
                            )
                        }
                        if (stat.clean_sheets >= 0) {
                            return (
                                <div key={index}>
                                    <p>{stat.clean_sheets} clean sheets</p>
                                </div>
                            )
                        }
                        if (stat.goals_conceded >= 0) {
                            return (
                                <div key={index}>
                                    <p>{stat.goals_conceded} goals conceded</p>
                                </div>
                            )
                        }
                        if (stat.yellow_cards >= 0) {
                            return (
                                <div key={index}>
                                    <p>{stat.yellow_cards} yellow cards</p>
                                </div>
                            )
                        }
                        if (stat.red_cards >= 0) {
                            return (
                                <div key={index}>
                                    <p>{stat.red_cards} red cards</p>
                                </div>
                            )
                        }
                        if (stat.bonus >= 0) {
                            return (
                                <div key={index}>
                                    <p>{stat.bonus} bonus</p>
                                </div>
                            )
                        }
                        return (
                            <div>what?</div>
                        )
                    })}
                </div>
                ))}
            </div>
        </section>
    )

};

export default LeagueLeaders;