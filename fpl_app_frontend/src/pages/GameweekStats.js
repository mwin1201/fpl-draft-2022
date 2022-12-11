import React, { useState, useEffect } from "react";
import {Link, useNavigate} from "react-router-dom"
const axios = require('axios').default;

const GameweekStats = () => {
    const [currentGameweek, setCurrentGameweek] = useState(JSON.parse(localStorage.getItem("current_gameweek")));
    const [displayArr, setDisplayArr] = useState([]);

    useEffect(() => {
        setDisplayArr(JSON.parse(localStorage.getItem(`gw_${currentGameweek}_stats`)));

    },[currentGameweek]);

    

    const handleSubmit = async (event) => {
        event.preventDefault();
        let gameweek = document.getElementById("gameweek").value;
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

export default GameweekStats;