import React, { useState, useEffect } from "react";
import {Link, useNavigate} from "react-router-dom"
const axios = require('axios').default;

const LeagueLeaders = () => {
    const [currentGameweek, setCurrentGameweek] = useState(JSON.parse(localStorage.getItem("current_gameweek")));
    const [displayArr, setDisplayArr] = useState([]);

    let fullLineupArr = [];
    let fullStatArr = [];

    useEffect(() => {
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
            modifyArr(fullStatArr);
        };
    
        const modifyArr = (allStatArr) => {
            let newArr = [];
            for (var i = 0; i < allStatArr.length; i++) {
                let statObj = {};
                for (var y = 0; y < allStatArr[i].stats.length; y++) {
                    Object.assign(statObj,allStatArr[i].stats[y]);
                }
                statObj.teamId = allStatArr[i].teamId;
                statObj.person = allStatArr[i].person;
                newArr.push(statObj);
            }
            setDisplayArr(newArr);
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
            let currentOrigin = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_prodOrigin : "http://localhost:5000";
            return axios.get(`${currentOrigin}/getLineups/` + team + "/" + gameweek)
            .then((apiResponse) => {
               return apiResponse.data.picks;
            })
        };
    
        // need to pull player stats per gameweek
        const getStats = async (gameweek) => {
            let currentOrigin = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_prodOrigin : "http://localhost:5000";
            return axios.get(`${currentOrigin}/getStats/` + gameweek)
                .then((apiResponse) => {
                    return apiResponse.data.elements;
                })
        };
        
        createLineupArr();

    },[currentGameweek]);

    

    const handleSubmit = async (event) => {
        event.preventDefault();
        let gameweek = document.getElementById("gameweek").value;
        fullLineupArr = [];
        fullStatArr = [];
        setCurrentGameweek(gameweek);
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

            <div>
                <strong>Refresh Screen when you first open the page to see accurate data</strong>
            </div>

            <h2>Starting Lineup Stats for Gameweek {currentGameweek ? currentGameweek : "TBD"}</h2>
            <div>
                <h3>Minutes Played</h3>
            {displayArr.sort((a,b) => (
                b.minutes - a.minutes
            ))
            .map((stat,index) => (
                <div key={index}>
                    {stat.minutes} : {stat.person}
                </div>
            ))}
                <h3>Goals Scored</h3>
            {displayArr.sort((a,b) => (
                b.goals_scored - a.goals_scored
            ))
            .map((stat,index) => (
                <div key={index}>
                    {stat.goals_scored} : {stat.person}
                </div>
            ))}
                <h3>Assists</h3>
            {displayArr.sort((a,b) => (
                b.assists - a.assists
            ))
            .map((stat,index) => (
                <div key={index}>
                    {stat.assists} : {stat.person}
                </div>
            ))}
                <h3>Bonus Points</h3>
            {displayArr.sort((a,b) => (
                b.bonus - a.bonus
            ))
            .map((stat,index) => (
                <div key={index}>
                    {stat.bonus} : {stat.person}
                </div>
            ))}
                <h3>Clean Sheets</h3>
            {displayArr.sort((a,b) => (
                b.clean_sheets - a.clean_sheets
            ))
            .map((stat,index) => (
                <div key={index}>
                    {stat.clean_sheets} : {stat.person}
                </div>
            ))}
                <h3>Goals Conceded</h3>
            {displayArr.sort((a,b) => (
                b.goals_conceded - a.goals_conceded
            ))
            .map((stat,index) => (
                <div key={index}>
                    {stat.goals_conceded} : {stat.person}
                </div>
            ))}
                <h3>Yellow Cards</h3>
            {displayArr.sort((a,b) => (
                b.yellow_cards - a.yellow_cards
            ))
            .map((stat,index) => (
                <div key={index}>
                    {stat.yellow_cards} : {stat.person}
                </div>
            ))}
                <h3>Red Cards</h3>
            {displayArr.sort((a,b) => (
                b.red_cards - a.red_cards
            ))
            .map((stat,index) => (
                <div key={index}>
                    {stat.red_cards} : {stat.person}
                </div>
            ))}
            </div>
        </section>
    )

};

export default LeagueLeaders;