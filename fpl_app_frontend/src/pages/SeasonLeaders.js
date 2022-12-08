import React, { useEffect, useState } from "react";
import {Link, useNavigate} from "react-router-dom"
import getGameweek from "../data/CurrentGameweek";

const SeasonLeaders = () => {
    const [allStats, setAllStats] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsLoading(true);

        const createFullStatArray = (loopEnd) => {
            let buildArr = [];
            for (var i = 1; i <= loopEnd; i++) {
                let teamArr = [];
                let startArr = JSON.parse(localStorage.getItem(`gw_${i}_stats`));
                for (var y = 0; y < startArr.length; y++) {
                    if (buildArr.length === 0) {
                        buildArr = startArr;
                    }
                    else {
                        const team = buildArr.find(obj => obj.teamId === startArr[y].teamId);
                        team.minutes = team.minutes + startArr[y].minutes;
                        team.goals_scored = team.goals_scored + startArr[y].goals_scored;
                        team.assists = team.assists + startArr[y].assists;
                        team.clean_sheets = team.clean_sheets + startArr[y].clean_sheets;
                        team.goals_conceded = team.goals_conceded + startArr[y].goals_conceded;
                        team.yellow_cards = team.yellow_cards + startArr[y].yellow_cards;
                        team.red_cards = team.red_cards + startArr[y].red_cards;
                        team.bonus = team.bonus + startArr[y].bonus;
                        teamArr.push(team);

                        if (y === startArr.length) {
                            buildArr = teamArr;
                        }
                    }
                }
            }
            setIsLoading(false);
            setAllStats(buildArr);
        };

        const start = async () => {
            const currentGameweek = await getGameweek();
            createFullStatArray(currentGameweek);
        };

        start();

    },[])

    const navigate = useNavigate();
    const goToHomepage = () => {
        navigate("/");
    };

    if (isLoading) {
        return (
            <div>
                LOADING ALL DATA, PLEASE BE PATIENT
            </div>
        )
    }

    return (
        <section>
            <div>
                    <Link to="/"></Link>
                    <button onClick={goToHomepage}>
                        Homepage
                    </button>
                </div>
            <div>
                <h3>Minutes Played</h3>
                {allStats.sort((a,b) => (
                    b.minutes - a.minutes
                ))
                .map((stat,index) => (
                    <div key={index}>
                        {stat.minutes} : {stat.person}
                    </div>
                ))}
                    <h3>Goals Scored</h3>
                {allStats.sort((a,b) => (
                    b.goals_scored - a.goals_scored
                ))
                .map((stat,index) => (
                    <div key={index}>
                        {stat.goals_scored} : {stat.person}
                    </div>
                ))}
                    <h3>Assists</h3>
                {allStats.sort((a,b) => (
                    b.assists - a.assists
                ))
                .map((stat,index) => (
                    <div key={index}>
                        {stat.assists} : {stat.person}
                    </div>
                ))}
                    <h3>Bonus Points</h3>
                {allStats.sort((a,b) => (
                    b.bonus - a.bonus
                ))
                .map((stat,index) => (
                    <div key={index}>
                        {stat.bonus} : {stat.person}
                    </div>
                ))}
                    <h3>Clean Sheets</h3>
                {allStats.sort((a,b) => (
                    b.clean_sheets - a.clean_sheets
                ))
                .map((stat,index) => (
                    <div key={index}>
                        {stat.clean_sheets} : {stat.person}
                    </div>
                ))}
                    <h3>Goals Conceded</h3>
                {allStats.sort((a,b) => (
                    b.goals_conceded - a.goals_conceded
                ))
                .map((stat,index) => (
                    <div key={index}>
                        {stat.goals_conceded} : {stat.person}
                    </div>
                ))}
                    <h3>Yellow Cards</h3>
                {allStats.sort((a,b) => (
                    b.yellow_cards - a.yellow_cards
                ))
                .map((stat,index) => (
                    <div key={index}>
                        {stat.yellow_cards} : {stat.person}
                    </div>
                ))}
                    <h3>Red Cards</h3>
                {allStats.sort((a,b) => (
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

export default SeasonLeaders;