import React, { useState, useEffect } from "react";
import {Link, useNavigate} from "react-router-dom"
const axios = require('axios').default;

const LeagueLeaders = () => {
    const [currentGameweek, setCurrentGameweek] = useState(JSON.parse(localStorage.getItem("current_gameweek")));

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
            fullStatArr.push({"teamId": allLineups[i].teamId, "person": allLineups[i].person, "goals": await getPlayerStats(allLineups[i].lineup)})
        }
        console.log("allStats", fullStatArr);
    };

    const getPlayerStats = async (teamPlayers) => {
        let statCounter = 0;
        const allPlayerStats = await getStats(currentGameweek);
        for (var i = 0; i < teamPlayers.length; i++) {
            statCounter += allPlayerStats[teamPlayers[i].element].stats["goals_scored"];
        }
        return statCounter;
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

            <h2>Leaders for Gameweek {currentGameweek}</h2>
            <div>Goals Scored</div>
            {fullStatArr.sort((a,b) => (
                b.goals - a.goals
            ))
            .map((team) => (
                <div key={team.teamId}>
                    {team.person} - {team.goals} goals
                </div>
            ))}
        </section>
    )

};

export default LeagueLeaders;