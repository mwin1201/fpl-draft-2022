import React, { useEffect, useState } from "react";
import getGameweek from "../data/CurrentGameweek";
import LeagueAlert from "../alerts/LeagueAlert.js";
import getStatData from "../data/GetStatData.js";
const axios = require('axios').default;

const SeasonLeaders = () => {
    const [currentGameweek, setCurrentGameweek] = useState(JSON.parse(localStorage.getItem("current_gameweek")));
    const [allStats, setAllStats] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [statToggle, setStatToggle] = useState(0);

    useEffect(() => {
        setIsLoading(true);

        const createFullStatArray = async (loopEnd, league) => {
            let buildArr = [];
            for (var i = 1; i <= loopEnd; i++) {
                let teamArr = [];
                let startArr = await getStatData(i, league);
                for (var y = 0; y < startArr.length; y++) {
                    if (buildArr.length === 0) {
                        buildArr = startArr;
                        break;
                    }
                    else {
                        let team = buildArr.find(obj => obj.entry_id === startArr[y].entry_id);
                        team.minutes = team.minutes + startArr[y].minutes;
                        team.goals_scored = team.goals_scored + startArr[y].goals_scored;
                        team.assists = team.assists + startArr[y].assists;
                        team.clean_sheets = team.clean_sheets + startArr[y].clean_sheets;
                        team.goals_conceded = team.goals_conceded + startArr[y].goals_conceded;
                        team.yellow_cards = team.yellow_cards + startArr[y].yellow_cards;
                        team.red_cards = team.red_cards + startArr[y].red_cards;
                        team.bonus = team.bonus + startArr[y].bonus;
                        team.total_points = team.total_points + startArr[y].total_points;
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
            const currentLeague = JSON.parse(localStorage.getItem("current_league"));
            let allStats = await createFullStatArray(currentGameweek, currentLeague);
            if (JSON.parse(localStorage.getItem("transactions"))) {
                transactionArray = JSON.parse(localStorage.getItem("transactions"));
            }
            else {
                transactionArray = await createTransactionArray();
            }
            let newStatArr = [];
            for (var i = 0; i < allStats.length; i++) {
                let teamStats = allStats.filter((team) => team.entry_id === transactionArray[i].id);
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
            index = sortStats.findIndex((team) => team.entry_id === teamId) + 1;
        }
        if (stat === "minutes") {
            sortStats = allStats.sort((a,b) => b.minutes - a.minutes);
            index = sortStats.findIndex((team) => team.entry_id === teamId) + 1;
        }
        if (stat === "goals") {
            sortStats = allStats.sort((a,b) => b.goals_scored - a.goals_scored);
            index = sortStats.findIndex((team) => team.entry_id === teamId) + 1;
        }
        if (stat === "assists") {
            sortStats = allStats.sort((a,b) => b.assists - a.assists);
            index = sortStats.findIndex((team) => team.entry_id === teamId) + 1;
        }
        if (stat === "bonus") {
            sortStats = allStats.sort((a,b) => b.bonus - a.bonus);
            index = sortStats.findIndex((team) => team.entry_id === teamId) + 1;
        }
        if (stat === "shutouts") {
            sortStats = allStats.sort((a,b) => b.clean_sheets - a.clean_sheets);
            index = sortStats.findIndex((team) => team.entry_id === teamId) + 1;
        }
        if (stat === "goals against") {
            sortStats = allStats.sort((a,b) => b.goals_conceded - a.goals_conceded);
            index = sortStats.findIndex((team) => team.entry_id === teamId) + 1;
        }
        if (stat === "yellows") {
            sortStats = allStats.sort((a,b) => b.yellow_cards - a.yellow_cards);
            index = sortStats.findIndex((team) => team.entry_id === teamId) + 1;
        }
        if (stat === "reds") {
            sortStats = allStats.sort((a,b) => b.red_cards - a.red_cards);
            index = sortStats.findIndex((team) => team.entry_id === teamId) + 1;
        }
        if (stat === "transactions") {
            sortStats = allStats.sort((a,b) => b.total_transactions - a.total_transactions);
            index = sortStats.findIndex((team) => team.entry_id === teamId) + 1;
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
        if (statToggle === 0) {
            setStatToggle(1);
        }
        else {
            setStatToggle(0);
        }
    };

    if (isLoading) {
        return (
            <main>
                LOADING ALL DATA, PLEASE BE PATIENT
            </main>
        )
    }

    if (allStats.length === 0) {
        return (
            <main>
                <h2>Still waiting for the start of the 2023 season!</h2>
            </main>
        );
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
                        <div className="team-cards" key={stat.entry_id}>
                            <h3>{stat.person}</h3>
                            <h4>Overall: {getTableRank(stat.owner_id)}</h4>
                            <div>{stat.total_points} Points ({getLeagueRank(stat.entry_id, "points")})</div>
                            <div>{stat.minutes} Minutes ({getLeagueRank(stat.entry_id, "minutes")})</div>
                            <div>{stat.goals_scored} Goals ({getLeagueRank(stat.entry_id, "goals")})</div>
                            <div>{stat.assists} Assists ({getLeagueRank(stat.entry_id, "assists")})</div>
                            <div>{stat.bonus} Bonus ({getLeagueRank(stat.entry_id, "bonus")})</div>
                            <div>{stat.clean_sheets} Shutouts ({getLeagueRank(stat.entry_id, "shutouts")})</div>
                            <div>{stat.goals_conceded} Goals Against ({getLeagueRank(stat.entry_id, "goals against")})</div>
                            <div>{stat.yellow_cards} Yellow Cards ({getLeagueRank(stat.entry_id, "yellows")})</div>
                            <div>{stat.red_cards} Red Cards ({getLeagueRank(stat.entry_id, "reds")})</div>
                            <div>{stat.total_transactions} Transactions ({getLeagueRank(stat.entry_id, "transactions")})</div>
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
