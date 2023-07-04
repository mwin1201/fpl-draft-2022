import React, { useState, useEffect } from "react";
const axios = require('axios').default;

const GameweekStats = () => {
    const [currentGameweek, setCurrentGameweek] = useState(JSON.parse(localStorage.getItem("current_gameweek")));
    const [displayArr, setDisplayArr] = useState([]);
    const [toggleStat, setToggleStat] = useState(0);

    useEffect(() => {
        setDisplayArr(JSON.parse(localStorage.getItem(`gw_${currentGameweek}_stats`)));

    },[currentGameweek]);

    const checkWinLoss = (teamEntry) => {
        let matches = JSON.parse(localStorage.getItem("matches"));
        let eventMatch = matches.filter((match) => match.event == currentGameweek).filter((eventMatch) => (eventMatch.league_entry_1 === teamEntry) || (eventMatch.league_entry_2 === teamEntry));
        if (eventMatch[0].league_entry_1 === teamEntry) {
            if (eventMatch[0].league_entry_1_points > eventMatch[0].league_entry_2_points) {
                return (
                    <span className="win">W</span>
                );
            }
            else {
                return (
                    <span className="loss">L</span>
                );
            }
        }
        else {
            if (eventMatch[0].league_entry_2_points > eventMatch[0].league_entry_1_points) {
                return (
                    <span className="win">W</span>
                );
            }
            else {
                return (
                    <span className="loss">L</span>
                );
            }
        }
    };

    const getTableRank = (teamEntry) => {
        let standings = JSON.parse(localStorage.getItem("standings"));
        let teamRank = standings.filter((team) => team.league_entry === teamEntry)[0].rank;

        if (teamRank === 1) {
            return "1st";
        }
        else if (teamRank === 2) {
            return "2nd";
        }
        else if (teamRank === 3) {
            return "3rd";
        }
        else {
            return teamRank + "th";
        }
    };
    
    const getLeagueRank = (teamId, stat) => {
        let sortStats, index;
        if (stat === "points") {
            sortStats = displayArr.sort((a,b) => b.total_points - a.total_points);
            index = sortStats.findIndex((team) => team.teamId === teamId) + 1;
        }
        if (stat === "minutes") {
            sortStats = displayArr.sort((a,b) => b.minutes - a.minutes);
            index = sortStats.findIndex((team) => team.teamId === teamId) + 1;
        }
        if (stat === "goals") {
            sortStats = displayArr.sort((a,b) => b.goals_scored - a.goals_scored);
            index = sortStats.findIndex((team) => team.teamId === teamId) + 1;
        }
        if (stat === "assists") {
            sortStats = displayArr.sort((a,b) => b.assists - a.assists);
            index = sortStats.findIndex((team) => team.teamId === teamId) + 1;
        }
        if (stat === "bonus") {
            sortStats = displayArr.sort((a,b) => b.bonus - a.bonus);
            index = sortStats.findIndex((team) => team.teamId === teamId) + 1;
        }
        if (stat === "shutouts") {
            sortStats = displayArr.sort((a,b) => b.clean_sheets - a.clean_sheets);
            index = sortStats.findIndex((team) => team.teamId === teamId) + 1;
        }
        if (stat === "goals against") {
            sortStats = displayArr.sort((a,b) => b.goals_conceded - a.goals_conceded);
            index = sortStats.findIndex((team) => team.teamId === teamId) + 1;
        }
        if (stat === "yellows") {
            sortStats = displayArr.sort((a,b) => b.yellow_cards - a.yellow_cards);
            index = sortStats.findIndex((team) => team.teamId === teamId) + 1;
        }
        if (stat === "reds") {
            sortStats = displayArr.sort((a,b) => b.red_cards - a.red_cards);
            index = sortStats.findIndex((team) => team.teamId === teamId) + 1;
        }


        if (index === 1) {
            return "1st";
        }
        else if (index === 2) {
            return "2nd";
        }
        else if (index === 3) {
            return "3rd";
        }
        else {
            return index + "th";
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        let gameweek = document.getElementById("gameweek").value;
        setCurrentGameweek(gameweek);
        setToggleStat(0);
    };

    const handleToggle = async (event) => {
        event.preventDefault();
        if (toggleStat === 0) {
            setToggleStat(1);
        }
        else {
            setToggleStat(0);
        }
    };

    return (
        <main>
            <form id="gw-search" onSubmit={handleSubmit}>
                <h2>Search Stats by Gameweek</h2>
                <label htmlFor="gameweek">Select a Gameweek:</label>
                <input type="number" id="gameweek" name="gameweek" min="0" max="38"></input>
                <button type="submit">Submit</button>
            </form>

            <form id="toggle" onSubmit={handleToggle}>
                <button type="submit">Toggle View</button>
            </form>

            <h2>Starting Lineup Stats for Gameweek {currentGameweek ? currentGameweek : "TBD"}</h2>
            {toggleStat ?
                <div className="card-content">
                    {displayArr.map((stat) => (
                        <div className="team-cards" key={stat.teamId}>
                            <a href={"https://draft.premierleague.com/entry/" + stat.teamId + "/event/" + currentGameweek} rel="noreferrer" target="_blank" className="fpl-link"><h3>{stat.person}</h3></a>
                            <h4>Overall: {getTableRank(stat.league_entry)}</h4>
                            <h4>{checkWinLoss(stat.league_entry)}</h4>
                            <div>{stat.total_points} Points ({getLeagueRank(stat.teamId, "points")})</div>
                            <div>{stat.minutes} Minutes ({getLeagueRank(stat.teamId, "minutes")})</div>
                            <div>{stat.goals_scored} Goals ({getLeagueRank(stat.teamId, "goals")})</div>
                            <div>{stat.assists} Assists ({getLeagueRank(stat.teamId, "assists")})</div>
                            <div>{stat.bonus} Bonus ({getLeagueRank(stat.teamId, "bonus")})</div>
                            <div>{stat.clean_sheets} Shutouts ({getLeagueRank(stat.teamId, "shutouts")})</div>
                            <div>{stat.goals_conceded} Goals Against ({getLeagueRank(stat.teamId, "goals against")})</div>
                            <div>{stat.yellow_cards} Yellow Cards ({getLeagueRank(stat.teamId, "yellows")})</div>
                            <div>{stat.red_cards} Red Cards ({getLeagueRank(stat.teamId, "reds")})</div>
                        </div>
                    ))}
                </div>
                :
                <div className="card-content">
                    <div className="stat-cards">
                        <h3>Total Points</h3>
                        {displayArr.sort((a,b) => (
                            b.total_points - a.total_points
                        ))
                        .map((stat,index) => (
                            <div key={index}>
                                {stat.total_points} : {stat.person}
                            </div>
                        ))}
                    </div>
                    <div className="stat-cards">
                        <h3>Minutes Played</h3>
                        {displayArr.sort((a,b) => (
                            b.minutes - a.minutes
                        ))
                        .map((stat,index) => (
                            <div key={index}>
                                {stat.minutes} : {stat.person}
                            </div>
                        ))}
                    </div>
                    <div className="stat-cards">
                        <h3>Goals Scored</h3>
                        {displayArr.sort((a,b) => (
                            b.goals_scored - a.goals_scored
                        ))
                        .map((stat,index) => (
                            <div key={index}>
                                {stat.goals_scored} : {stat.person}
                            </div>
                        ))}
                    </div>
                    <div className="stat-cards">
                        <h3>Assists</h3>
                        {displayArr.sort((a,b) => (
                            b.assists - a.assists
                        ))
                        .map((stat,index) => (
                            <div key={index}>
                                {stat.assists} : {stat.person}
                            </div>
                        ))}
                    </div>
                    <div className="stat-cards">
                        <h3>Bonus Points</h3>
                        {displayArr.sort((a,b) => (
                            b.bonus - a.bonus
                        ))
                        .map((stat,index) => (
                            <div key={index}>
                                {stat.bonus} : {stat.person}
                            </div>
                        ))}
                    </div>
                    <div className="stat-cards">
                        <h3>Clean Sheets</h3>
                        {displayArr.sort((a,b) => (
                            b.clean_sheets - a.clean_sheets
                        ))
                        .map((stat,index) => (
                            <div key={index}>
                                {stat.clean_sheets} : {stat.person}
                            </div>
                        ))}
                    </div>
                    <div className="stat-cards">
                        <h3>Goals Conceded</h3>
                        {displayArr.sort((a,b) => (
                            b.goals_conceded - a.goals_conceded
                        ))
                        .map((stat,index) => (
                            <div key={index}>
                                {stat.goals_conceded} : {stat.person}
                            </div>
                        ))}
                    </div>
                    <div className="stat-cards">
                        <h3>Yellow Cards</h3>
                        {displayArr.sort((a,b) => (
                            b.yellow_cards - a.yellow_cards
                        ))
                        .map((stat,index) => (
                            <div key={index}>
                                {stat.yellow_cards} : {stat.person}
                            </div>
                        ))}
                    </div>
                    <div className="stat-cards">
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
                </div>
            }
        </main>
    );

};

export default GameweekStats;