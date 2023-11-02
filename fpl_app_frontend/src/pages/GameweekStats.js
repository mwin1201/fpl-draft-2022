import React, { useState, useEffect } from "react";
import LeagueAlert from "../alerts/LeagueAlert.js";
import StatCards from "../components/StatCards/index.js";

const GameweekStats = () => {
    const [currentGameweek, setCurrentGameweek] = useState(JSON.parse(localStorage.getItem("current_gameweek")));
    const [fullTeamDisplayArr, setFullTeamDisplayArr] = useState([]);
    const [GKPDisplayArr, setGKPDisplayArr] = useState([]);
    const [DEFDisplayArr, setDEFDisplayArr] = useState([]);
    const [MIDDisplayArr, setMIDDisplayArr] = useState([]);
    const [FWDDisplayArr, setFWDDisplayArr] = useState([]);
    const [displayArr, setDisplayArr] = useState([]);
    const [toggleStat, setToggleStat] = useState(0);
    const [position, setPosition] = useState(6);

    useEffect(() => {
        //setDisplayArr(JSON.parse(localStorage.getItem(`gw_${currentGameweek}_stats`)));

        let fullGWStats = JSON.parse(localStorage.getItem(`gw_${currentGameweek}_stats`));
        
        // need to have a 5 iteration loop to create the 5 separate arrays
        for (var i = 0; i < 5; i++) {
            let filteredStatArr = [];
            // loop through stat array to parse out specific position stats
            for (var y = 0; y < fullGWStats.length; y++) {
                let allowedStats = [];
                if (i === 0) {
                    allowedStats = ["minutes", "goals_scored", "assists", "clean_sheets", "goals_conceded", "yellow_cards", "red_cards", "bonus", "total_points", "teamId", "person", "league_entry"];
                }
                else if (i === 1) {
                    allowedStats = ["GKP_minutes", "GKP_goals_scored", "GKP_assists", "GKP_clean_sheets", "GKP_goals_conceded", "GKP_yellow_cards", "GKP_red_cards", "GKP_bonus", "GKP_total_points", "teamId", "person", "league_entry"];
                }
                else if (i === 2) {
                    allowedStats = ["DEF_minutes", "DEF_goals_scored", "DEF_assists", "DEF_clean_sheets", "DEF_goals_conceded", "DEF_yellow_cards", "DEF_red_cards", "DEF_bonus", "DEF_total_points", "teamId", "person", "league_entry"];
                }
                else if (i === 3) {
                    allowedStats = ["MID_minutes", "MID_goals_scored", "MID_assists", "MID_clean_sheets", "MID_goals_conceded", "MID_yellow_cards", "MID_red_cards", "MID_bonus", "MID_total_points", "teamId", "person", "league_entry"];
                }
                else {
                    allowedStats = ["FWD_minutes", "FWD_goals_scored", "FWD_assists", "FWD_clean_sheets", "FWD_goals_conceded", "FWD_yellow_cards", "FWD_red_cards", "FWD_bonus", "FWD_total_points", "teamId", "person", "league_entry"];
                }
                let curObj = fullGWStats[y];
                let filteredStats = Object.keys(curObj)
                .filter((key) => allowedStats.includes(key))
                .reduce((obj, key) => {
                    return {
                        ...obj,
                        [key]: curObj[key]
                    };
                }, {});

                filteredStatArr.push(filteredStats);

                if (filteredStatArr.length === 10) {
                    if (i === 0) {
                        setFullTeamDisplayArr(filteredStatArr);
                    }
                    else if (i === 1) {
                        setGKPDisplayArr(filteredStatArr);
                    }
                    else if (i === 2) {
                        setDEFDisplayArr(filteredStatArr);
                    }
                    else if (i === 3) {
                        setMIDDisplayArr(filteredStatArr);
                    }
                    else  {
                        setFWDDisplayArr(filteredStatArr);
                    }
                }
            }
        }

    },[currentGameweek]);

    // const checkWinLoss = (teamEntry) => {
    //     let matches = JSON.parse(localStorage.getItem("matches"));
    //     let eventMatch = matches.filter((match) => match.event == currentGameweek).filter((eventMatch) => (eventMatch.league_entry_1 === teamEntry) || (eventMatch.league_entry_2 === teamEntry));
    //     if (eventMatch[0].league_entry_1 === teamEntry) {
    //         if (eventMatch[0].league_entry_1_points > eventMatch[0].league_entry_2_points) {
    //             return (
    //                 <span className="win">W</span>
    //             );
    //         }
    //         else if (eventMatch[0].league_entry_1_points < eventMatch[0].league_entry_2_points){
    //             return (
    //                 <span className="loss">L</span>
    //             );
    //         }
    //         else {
    //             return (
    //                 <span className="draw">D</span>
    //             );
    //         }
    //     }
    //     else {
    //         if (eventMatch[0].league_entry_2_points > eventMatch[0].league_entry_1_points) {
    //             return (
    //                 <span className="win">W</span>
    //             );
    //         }
    //         else if (eventMatch[0].league_entry_2_points < eventMatch[0].league_entry_1_points){
    //             return (
    //                 <span className="loss">L</span>
    //             );
    //         }
    //         else {
    //             return (
    //                 <span className="draw">D</span>
    //             );
    //         }
    //     }
    // };

    // const getTableRank = (teamEntry) => {
    //     let standings = JSON.parse(localStorage.getItem("standings"));
    //     let teamRank = standings.filter((team) => team.league_entry === teamEntry)[0].rank;

    //     if (teamRank === 1) {
    //         return "1st";
    //     }
    //     else if (teamRank === 2) {
    //         return "2nd";
    //     }
    //     else if (teamRank === 3) {
    //         return "3rd";
    //     }
    //     else {
    //         return teamRank + "th";
    //     }
    // };
    
    // const getLeagueRank = (teamId, stat) => {
    //     let sortStats, index;
    //     if (stat === "points") {
    //         sortStats = displayArr.sort((a,b) => b.total_points - a.total_points);
    //         index = sortStats.findIndex((team) => team.teamId === teamId) + 1;
    //     }
    //     if (stat === "minutes") {
    //         sortStats = displayArr.sort((a,b) => b.minutes - a.minutes);
    //         index = sortStats.findIndex((team) => team.teamId === teamId) + 1;
    //     }
    //     if (stat === "goals") {
    //         sortStats = displayArr.sort((a,b) => b.goals_scored - a.goals_scored);
    //         index = sortStats.findIndex((team) => team.teamId === teamId) + 1;
    //     }
    //     if (stat === "assists") {
    //         sortStats = displayArr.sort((a,b) => b.assists - a.assists);
    //         index = sortStats.findIndex((team) => team.teamId === teamId) + 1;
    //     }
    //     if (stat === "bonus") {
    //         sortStats = displayArr.sort((a,b) => b.bonus - a.bonus);
    //         index = sortStats.findIndex((team) => team.teamId === teamId) + 1;
    //     }
    //     if (stat === "shutouts") {
    //         sortStats = displayArr.sort((a,b) => b.clean_sheets - a.clean_sheets);
    //         index = sortStats.findIndex((team) => team.teamId === teamId) + 1;
    //     }
    //     if (stat === "goals against") {
    //         sortStats = displayArr.sort((a,b) => b.goals_conceded - a.goals_conceded);
    //         index = sortStats.findIndex((team) => team.teamId === teamId) + 1;
    //     }
    //     if (stat === "yellows") {
    //         sortStats = displayArr.sort((a,b) => b.yellow_cards - a.yellow_cards);
    //         index = sortStats.findIndex((team) => team.teamId === teamId) + 1;
    //     }
    //     if (stat === "reds") {
    //         sortStats = displayArr.sort((a,b) => b.red_cards - a.red_cards);
    //         index = sortStats.findIndex((team) => team.teamId === teamId) + 1;
    //     }


    //     if (index === 1) {
    //         return "1st";
    //     }
    //     else if (index === 2) {
    //         return "2nd";
    //     }
    //     else if (index === 3) {
    //         return "3rd";
    //     }
    //     else {
    //         return index + "th";
    //     }
    // };

    const handleSubmit = async (event) => {
        event.preventDefault();
        let gameweek = document.getElementById("gameweek").value;
        setCurrentGameweek(gameweek);
        setToggleStat(0);
    };

    const modifyArray = async (statArray, position) => {
        let newArr = [];
        for (var i = 0; i < statArray.length; i++) {
            let newObj = {};
            let curObj = statArray[i];
            Object.keys(curObj)
            .forEach((key) => {
                let newKey;
                if (key.substring(0,3) === "GKP" || key.substring(0,3) === "DEF" || key.substring(0,3) === "MID" || key.substring(0,3) === "FWD") {
                    newKey = key.slice(4);
                    newObj[newKey] = curObj[key];
                }
                else {
                    newObj[key] = curObj[key];
                }
            });

            newArr.push(newObj);
        }
        setPosition(position);
        setDisplayArr(newArr);
    };

    const handleToggle = async (event) => {
        event.preventDefault();
        let positionToView = parseInt(event.target.dataset.position);
        if (positionToView === 1) {
            await modifyArray(GKPDisplayArr, positionToView);
        }
        else if (positionToView === 2) {
            await modifyArray(DEFDisplayArr, positionToView);
        }
        else if (positionToView === 3) {
            await modifyArray(MIDDisplayArr, positionToView);
        }
        else if (positionToView === 4) {
            await modifyArray(FWDDisplayArr, positionToView);
        }
        else if (positionToView === 5) {
            if (toggleStat === 0) {
                setToggleStat(1);
            }
            else {
                setToggleStat(0);
            }
        }
        else {
            setPosition(6);
            setDisplayArr(fullTeamDisplayArr);
        }
    };

    if (JSON.parse(localStorage.getItem(`gw_${currentGameweek}_stats`)) === null) {
        return (
            <main>
                <h2>Still waiting for the start of the 2023 season!</h2>
            </main>
        );
    }

    return (
        <main>
            <LeagueAlert data={{user: JSON.parse(localStorage.getItem("current_user")), league: JSON.parse(localStorage.getItem("current_league")), leagueData: JSON.parse(localStorage.getItem("league_data"))}}/>
            <form id="gw-search" onSubmit={handleSubmit}>
                <h2>Search Stats by Gameweek</h2>
                <label htmlFor="gameweek">Select a Gameweek:</label>
                <input type="number" id="gameweek" name="gameweek" min="0" max="38"></input>
                <button type="submit">Submit</button>
            </form>

            <form id="toggle">
                <button data-position="5" onClick={handleToggle}>Toggle View</button>
                <button data-position="6" onClick={handleToggle}>ALL Stats</button>
                <button data-position="1" onClick={handleToggle}>GKP Stats</button>
                <button data-position="2" onClick={handleToggle}>DEF Stats</button>
                <button data-position="3" onClick={handleToggle}>MID Stats</button>
                <button data-position="4" onClick={handleToggle}>FWD Stats</button>
            </form>

            <StatCards 
                displayArr={displayArr}
                toggleStat={toggleStat}
                currentGameweek={currentGameweek}
                position={position}
            />
            
        </main>
    );

};

export default GameweekStats;