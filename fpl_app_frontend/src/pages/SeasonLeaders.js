import React, { useEffect, useState } from "react";
import getGameweek from "../data/CurrentGameweek";
import LeagueAlert from "../alerts/LeagueAlert.js";
import positionStats from "../utils/positionStats";
const axios = require('axios').default;

const SeasonLeaders = () => {
    const [currentGameweek, setCurrentGameweek] = useState(JSON.parse(localStorage.getItem("current_gameweek")));
    const [allStats, setAllStats] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [statToggle, setStatToggle] = useState(0);

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
                        break;
                    }
                    else {
                        let team = buildArr.find(obj => obj.teamId === startArr[y].teamId);
                        // total stats section
                        team.minutes = team.minutes + startArr[y].minutes;
                        team.goals_scored = team.goals_scored + startArr[y].goals_scored;
                        team.assists = team.assists + startArr[y].assists;
                        team.clean_sheets = team.clean_sheets + startArr[y].clean_sheets;
                        team.goals_conceded = team.goals_conceded + startArr[y].goals_conceded;
                        team.yellow_cards = team.yellow_cards + startArr[y].yellow_cards;
                        team.red_cards = team.red_cards + startArr[y].red_cards;
                        team.bonus = team.bonus + startArr[y].bonus;
                        team.total_points = team.total_points + startArr[y].total_points;
                        // GKP stats section
                        team.GKP_minutes = team.GKP_minutes + startArr[y].GKP_minutes;
                        team.GKP_goals_scored = team.GKP_goals_scored + startArr[y].GKP_goals_scored;
                        team.GKP_assists = team.GKP_assists + startArr[y].GKP_assists;
                        team.GKP_clean_sheets = team.GKP_clean_sheets + startArr[y].GKP_clean_sheets;
                        team.GKP_goals_conceded = team.GKP_goals_conceded + startArr[y].GKP_goals_conceded;
                        team.GKP_yellow_cards = team.GKP_yellow_cards + startArr[y].GKP_yellow_cards;
                        team.GKP_red_cards = team.GKP_red_cards + startArr[y].GKP_red_cards;
                        team.GKP_bonus = team.GKP_bonus + startArr[y].GKP_bonus;
                        team.GKP_total_points = team.GKP_total_points + startArr[y].GKP_total_points;
                        // DEF stats section
                        team.DEF_minutes = team.DEF_minutes + startArr[y].DEF_minutes;
                        team.DEF_goals_scored = team.DEF_goals_scored + startArr[y].DEF_goals_scored;
                        team.DEF_assists = team.DEF_assists + startArr[y].DEF_assists;
                        team.DEF_clean_sheets = team.DEF_clean_sheets + startArr[y].DEF_clean_sheets;
                        team.DEF_goals_conceded = team.DEF_goals_conceded + startArr[y].DEF_goals_conceded;
                        team.DEF_yellow_cards = team.DEF_yellow_cards + startArr[y].DEF_yellow_cards;
                        team.DEF_red_cards = team.DEF_red_cards + startArr[y].DEF_red_cards;
                        team.DEF_bonus = team.DEF_bonus + startArr[y].DEF_bonus;
                        team.DEF_total_points = team.DEF_total_points + startArr[y].DEF_total_points;
                        // MID stats section
                        team.MID_minutes = team.MID_minutes + startArr[y].MID_minutes;
                        team.MID_goals_scored = team.MID_goals_scored + startArr[y].MID_goals_scored;
                        team.MID_assists = team.MID_assists + startArr[y].MID_assists;
                        team.MID_clean_sheets = team.MID_clean_sheets + startArr[y].MID_clean_sheets;
                        team.MID_goals_conceded = team.MID_goals_conceded + startArr[y].MID_goals_conceded;
                        team.MID_yellow_cards = team.MID_yellow_cards + startArr[y].MID_yellow_cards;
                        team.MID_red_cards = team.MID_red_cards + startArr[y].MID_red_cards;
                        team.MID_bonus = team.MID_bonus + startArr[y].MID_bonus;
                        team.MID_total_points = team.MID_total_points + startArr[y].MID_total_points;
                        // FWD stats section
                        team.FWD_minutes = team.FWD_minutes + startArr[y].FWD_minutes;
                        team.FWD_goals_scored = team.FWD_goals_scored + startArr[y].FWD_goals_scored;
                        team.FWD_assists = team.FWD_assists + startArr[y].FWD_assists;
                        team.FWD_clean_sheets = team.FWD_clean_sheets + startArr[y].FWD_clean_sheets;
                        team.FWD_goals_conceded = team.FWD_goals_conceded + startArr[y].FWD_goals_conceded;
                        team.FWD_yellow_cards = team.FWD_yellow_cards + startArr[y].FWD_yellow_cards;
                        team.FWD_red_cards = team.FWD_red_cards + startArr[y].FWD_red_cards;
                        team.FWD_bonus = team.FWD_bonus + startArr[y].FWD_bonus;
                        team.FWD_total_points = team.FWD_total_points + startArr[y].FWD_total_points;

                        teamArr.push(team);

                        if (y === startArr.length) {
                            buildArr = teamArr;
                        }
                    }
                }
            }
            return buildArr;
        };

        const getTransactionData = async (teamId) => {
            let currentOrigin = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_prodOrigin : "http://localhost:5000";
            return axios.get(`${currentOrigin}/getTransactions/` + teamId)
            .then((apiResponse) => {
                return apiResponse.data;
            })
        };

        const createTransactionArray = async () => {
            let transactionArr = [];
            const leagueEntries = JSON.parse(localStorage.getItem("league_entries"));
            for (var i = 0; i < leagueEntries.length; i++) {
                let data = await getTransactionData(leagueEntries[i].entry_id);
                transactionArr.push({total_count: data.entry.transactions_total, id: data.entry.id});
            }
            localStorage.setItem("transactions", JSON.stringify(transactionArr));
            return transactionArr;
        };

        const start = async () => {
            let transactionArray;
            const currentGameweek = JSON.parse(localStorage.getItem("current_gameweek"));
            let allStats = createFullStatArray(currentGameweek);
            allStats = positionStats(allStats);
            console.log("all stats ",allStats);
            if (JSON.parse(localStorage.getItem("transactions"))) {
                transactionArray = JSON.parse(localStorage.getItem("transactions"));
            }
            else {
                transactionArray = await createTransactionArray();
            }
            let newStatArr = [];
            for (var i = 0; i < transactionArray.length; i++) {
                let teamStats = allStats.filter((team) => team.teamId === transactionArray[i].id);
                teamStats[0]["total_transactions"] = transactionArray[i].total_count;
                newStatArr.push(teamStats[0]);
            }
            setAllStats(newStatArr);
            setIsLoading(false);
        };

        start();

    },[])

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
            sortStats = allStats.sort((a,b) => b.total_points - a.total_points);
            index = sortStats.findIndex((team) => team.teamId === teamId) + 1;
        }
        if (stat === "minutes") {
            sortStats = allStats.sort((a,b) => b.minutes - a.minutes);
            index = sortStats.findIndex((team) => team.teamId === teamId) + 1;
        }
        if (stat === "goals") {
            sortStats = allStats.sort((a,b) => b.goals_scored - a.goals_scored);
            index = sortStats.findIndex((team) => team.teamId === teamId) + 1;
        }
        if (stat === "assists") {
            sortStats = allStats.sort((a,b) => b.assists - a.assists);
            index = sortStats.findIndex((team) => team.teamId === teamId) + 1;
        }
        if (stat === "bonus") {
            sortStats = allStats.sort((a,b) => b.bonus - a.bonus);
            index = sortStats.findIndex((team) => team.teamId === teamId) + 1;
        }
        if (stat === "shutouts") {
            sortStats = allStats.sort((a,b) => b.clean_sheets - a.clean_sheets);
            index = sortStats.findIndex((team) => team.teamId === teamId) + 1;
        }
        if (stat === "goals against") {
            sortStats = allStats.sort((a,b) => b.goals_conceded - a.goals_conceded);
            index = sortStats.findIndex((team) => team.teamId === teamId) + 1;
        }
        if (stat === "yellows") {
            sortStats = allStats.sort((a,b) => b.yellow_cards - a.yellow_cards);
            index = sortStats.findIndex((team) => team.teamId === teamId) + 1;
        }
        if (stat === "reds") {
            sortStats = allStats.sort((a,b) => b.red_cards - a.red_cards);
            index = sortStats.findIndex((team) => team.teamId === teamId) + 1;
        }
        if (stat === "transactions") {
            sortStats = allStats.sort((a,b) => b.total_transactions - a.total_transactions);
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

    const doMath = (numerator, denominator) => {
        const result = (numerator/denominator) * 100;
        return result.toFixed(2);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (statToggle === 0) {
            setStatToggle(1);
        }
        else {
            setStatToggle(0);
        }
    };

    if (JSON.parse(localStorage.getItem(`gw_${currentGameweek}_stats`)) === null) {
        return (
            <main>
                <h2>Still waiting for the start of the 2023 season!</h2>
            </main>
        );
    }

    if (isLoading) {
        return (
            <main>
                LOADING ALL DATA, PLEASE BE PATIENT
            </main>
        )
    }

    return (
        <main>
            <LeagueAlert data={{user: JSON.parse(localStorage.getItem("current_user")), league: JSON.parse(localStorage.getItem("current_league")), leagueData: JSON.parse(localStorage.getItem("league_data"))}}/>
            <form id="stat-toggle" onSubmit={handleSubmit}>
                <button type="submit">Toggle View</button>
            </form>
            {statToggle ? 
                <div className="card-content">
                    {allStats.map((stat) => (
                        <div className="season-team-cards" key={stat.teamId}>
                            <h3>{stat.person}</h3>
                            <h4>Overall: {getTableRank(stat.league_entry)}</h4>
                            <div>{stat.total_points} Points ({getLeagueRank(stat.teamId, "points")})</div>
                            {stat.position_total_points.map((position) => (
                                <div className="season-position-stats" key={position}>
                                    <p>GKP: {position.GKP_total_points} ({doMath(position.GKP_total_points, stat.total_points)}%)</p>
                                    <p>DEF: {position.DEF_total_points} ({doMath(position.DEF_total_points, stat.total_points)}%)</p>
                                    <p>MID: {position.MID_total_points} ({doMath(position.MID_total_points, stat.total_points)}%)</p>
                                    <p>FWD: {position.FWD_total_points} ({doMath(position.FWD_total_points, stat.total_points)}%)</p>
                                </div>  
                            ))}
                            <div>{stat.minutes} Minutes ({getLeagueRank(stat.teamId, "minutes")})</div>
                            {stat.position_minutes.map((position) => (
                                <div className="season-position-stats" key={position}>
                                    <p>GKP: {position.GKP_minutes} ({doMath(position.GKP_minutes, stat.minutes)}%)</p>
                                    <p>DEF: {position.DEF_minutes} ({doMath(position.DEF_minutes, stat.minutes)}%)</p>
                                    <p>MID: {position.MID_minutes} ({doMath(position.MID_minutes, stat.minutes)}%)</p>
                                    <p>FWD: {position.FWD_minutes} ({doMath(position.FWD_minutes, stat.minutes)}%)</p>
                                </div>  
                            ))}
                            <div>{stat.goals_scored} Goals ({getLeagueRank(stat.teamId, "goals")})</div>
                            {stat.position_goals_scored.map((position) => (
                                <div className="season-position-stats" key={position}>
                                    <p>GKP: {position.GKP_goals_scored} ({doMath(position.GKP_goals_scored, stat.goals_scored)}%)</p>
                                    <p>DEF: {position.DEF_goals_scored} ({doMath(position.DEF_goals_scored, stat.goals_scored)}%)</p>
                                    <p>MID: {position.MID_goals_scored} ({doMath(position.MID_goals_scored, stat.goals_scored)}%)</p>
                                    <p>FWD: {position.FWD_goals_scored} ({doMath(position.FWD_goals_scored, stat.goals_scored)}%)</p>
                                </div>  
                            ))}
                            <div>{stat.assists} Assists ({getLeagueRank(stat.teamId, "assists")})</div>
                            {stat.position_assists.map((position) => (
                                <div className="season-position-stats" key={position}>
                                    <p>GKP: {position.GKP_assists} ({doMath(position.GKP_assists, stat.assists)}%)</p>
                                    <p>DEF: {position.DEF_assists} ({doMath(position.DEF_assists, stat.assists)}%)</p>
                                    <p>MID: {position.MID_assists} ({doMath(position.MID_assists, stat.assists)}%)</p>
                                    <p>FWD: {position.FWD_assists} ({doMath(position.FWD_assists, stat.assists)}%)</p>
                                </div>  
                            ))}
                            <div>{stat.bonus} Bonus ({getLeagueRank(stat.teamId, "bonus")})</div>
                            {stat.position_bonus.map((position) => (
                                <div className="season-position-stats" key={position}>
                                    <p>GKP: {position.GKP_bonus} ({doMath(position.GKP_bonus, stat.bonus)}%)</p>
                                    <p>DEF: {position.DEF_bonus} ({doMath(position.DEF_bonus, stat.bonus)}%)</p>
                                    <p>MID: {position.MID_bonus} ({doMath(position.MID_bonus, stat.bonus)}%)</p>
                                    <p>FWD: {position.FWD_bonus} ({doMath(position.FWD_bonus, stat.bonus)}%)</p>
                                </div>  
                            ))}
                            <div>{stat.clean_sheets} Shutouts ({getLeagueRank(stat.teamId, "shutouts")})</div>
                            {stat.position_clean_sheets.map((position) => (
                                <div className="season-position-stats" key={position}>
                                    <p>GKP: {position.GKP_clean_sheets} ({doMath(position.GKP_clean_sheets, stat.clean_sheets)}%)</p>
                                    <p>DEF: {position.DEF_clean_sheets} ({doMath(position.DEF_clean_sheets, stat.clean_sheets)}%)</p>
                                    <p>MID: {position.MID_clean_sheets} ({doMath(position.MID_clean_sheets, stat.clean_sheets)}%)</p>
                                    <p>FWD: {position.FWD_clean_sheets} ({doMath(position.FWD_clean_sheets, stat.clean_sheets)}%)</p>
                                </div>  
                            ))}
                            <div>{stat.goals_conceded} Goals Against ({getLeagueRank(stat.teamId, "goals against")})</div>
                            {stat.position_goals_conceded.map((position) => (
                                <div className="season-position-stats" key={position}>
                                    <p>GKP: {position.GKP_goals_conceded} ({doMath(position.GKP_goals_conceded, stat.goals_conceded)}%)</p>
                                    <p>DEF: {position.DEF_goals_conceded} ({doMath(position.DEF_goals_conceded, stat.goals_conceded)}%)</p>
                                    <p>MID: {position.MID_goals_conceded} ({doMath(position.MID_goals_conceded, stat.goals_conceded)}%)</p>
                                    <p>FWD: {position.FWD_goals_conceded} ({doMath(position.FWD_goals_conceded, stat.goals_conceded)}%)</p>
                                </div>  
                            ))}
                            <div>{stat.yellow_cards} Yellow Cards ({getLeagueRank(stat.teamId, "yellows")})</div>
                            {stat.position_yellow_cards.map((position) => (
                                <div className="season-position-stats" key={position}>
                                    <p>GKP: {position.GKP_yellow_cards} ({doMath(position.GKP_yellow_cards, stat.yellow_cards)}%)</p>
                                    <p>DEF: {position.DEF_yellow_cards} ({doMath(position.DEF_yellow_cards, stat.yellow_cards)}%)</p>
                                    <p>MID: {position.MID_yellow_cards} ({doMath(position.MID_yellow_cards, stat.yellow_cards)}%)</p>
                                    <p>FWD: {position.FWD_yellow_cards} ({doMath(position.FWD_yellow_cards, stat.yellow_cards)}%)</p>
                                </div>  
                            ))}
                            <div>{stat.red_cards} Red Cards ({getLeagueRank(stat.teamId, "reds")})</div>
                             {stat.position_red_cards.map((position) => (
                                <div className="season-position-stats" key={position}>
                                    <p>GKP: {position.GKP_red_cards} ({doMath(position.GKP_red_cards, stat.red_cards)}%)</p>
                                    <p>DEF: {position.DEF_red_cards} ({doMath(position.DEF_red_cards, stat.red_cards)}%)</p>
                                    <p>MID: {position.MID_red_cards} ({doMath(position.MID_red_cards, stat.red_cards)}%)</p>
                                    <p>FWD: {position.FWD_red_cards} ({doMath(position.FWD_red_cards, stat.red_cards)}%)</p>
                                </div>  
                            ))}
                            <div>{stat.total_transactions} Transactions ({getLeagueRank(stat.teamId, "transactions")})</div>
                        </div>
                    ))}
                </div>
                :
                <div className="card-content">
                    <div className="stat-cards">
                        <h3>Total Points</h3>
                        {allStats.sort((a,b) => (
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
                        {allStats.sort((a,b) => (
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
                        {allStats.sort((a,b) => (
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
                        {allStats.sort((a,b) => (
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
                        {allStats.sort((a,b) => (
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
                        {allStats.sort((a,b) => (
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
                        {allStats.sort((a,b) => (
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
                        {allStats.sort((a,b) => (
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
                        {allStats.sort((a,b) => (
                            b.red_cards - a.red_cards
                        ))
                        .map((stat,index) => (
                            <div key={index}>
                                {stat.red_cards} : {stat.person}
                            </div>
                        ))}
                    </div>
                    <div className="stat-cards">
                        <h3>Transactions</h3>
                        {allStats.sort((a,b) => (
                            b.total_transactions - a.total_transactions
                        ))
                        .map((stat,index) => (
                            <div key={index}>
                                {stat.total_transactions} : {stat.person}
                            </div>
                        ))}
                    </div>
            </div>
            }
        </main>
    );
};

export default SeasonLeaders;