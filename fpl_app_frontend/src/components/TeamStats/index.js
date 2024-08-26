import React, {useState, useEffect} from 'react';
import getStatData from '../../data/GetStatData';
const axios = require('axios').default;

const TeamStats = ({ owner_entry_id }) => {
    const [currentGameweek, setCurrentGameweek] = useState(JSON.parse(localStorage.getItem("current_gameweek")));
    const [isLoading, setIsLoading] = useState(true);
    const [myGameweekStats, setMyGameweekStats] = useState([]);
    const [gameweekStats, setGameweekStats] = useState([]);
    const [mySeasonStats, setMySeasonStats] = useState();
    const [seasonStats, setSeasonStats] = useState();

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
            return axios.get(`${currentOrigin}/fpl/getTransactions/` + teamId)
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
            let gameweekStats = await getStatData(currentGameweek, currentLeague);
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

            if (gameweekStats.length === 0) {
                setMyGameweekStats(JSON.parse(localStorage.getItem(`gw_${currentGameweek}_stats`)).filter((stat) => stat.entry_id === owner_entry_id));
            } else {
                setMyGameweekStats(gameweekStats.filter((stat) => stat.entry_id === owner_entry_id));
            }
            setGameweekStats(JSON.parse(localStorage.getItem(`gw_${currentGameweek}_stats`)));
            setSeasonStats(newStatArr);
            setMySeasonStats(newStatArr.filter((stat) => stat.entry_id === owner_entry_id));
            setIsLoading(false);
        };

        start();

    },[owner_entry_id]);

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

    const getSeasonLeagueRank = (teamId, stat) => {
        let sortStats, index;
        if (stat === "points") {
            sortStats = seasonStats.sort((a,b) => b.total_points - a.total_points);
            index = sortStats.findIndex((team) => team.owner_id === teamId) + 1;
        }
        if (stat === "minutes") {
            sortStats = seasonStats.sort((a,b) => b.minutes - a.minutes);
            index = sortStats.findIndex((team) => team.owner_id === teamId) + 1;
        }
        if (stat === "goals") {
            sortStats = seasonStats.sort((a,b) => b.goals_scored - a.goals_scored);
            index = sortStats.findIndex((team) => team.owner_id === teamId) + 1;
        }
        if (stat === "assists") {
            sortStats = seasonStats.sort((a,b) => b.assists - a.assists);
            index = sortStats.findIndex((team) => team.owner_id === teamId) + 1;
        }
        if (stat === "bonus") {
            sortStats = seasonStats.sort((a,b) => b.bonus - a.bonus);
            index = sortStats.findIndex((team) => team.owner_id === teamId) + 1;
        }
        if (stat === "shutouts") {
            sortStats = seasonStats.sort((a,b) => b.clean_sheets - a.clean_sheets);
            index = sortStats.findIndex((team) => team.owner_id === teamId) + 1;
        }
        if (stat === "goals against") {
            sortStats = seasonStats.sort((a,b) => b.goals_conceded - a.goals_conceded);
            index = sortStats.findIndex((team) => team.owner_id === teamId) + 1;
        }
        if (stat === "yellows") {
            sortStats = seasonStats.sort((a,b) => b.yellow_cards - a.yellow_cards);
            index = sortStats.findIndex((team) => team.owner_id === teamId) + 1;
        }
        if (stat === "reds") {
            sortStats = seasonStats.sort((a,b) => b.red_cards - a.red_cards);
            index = sortStats.findIndex((team) => team.owner_id === teamId) + 1;
        }
        if (stat === "transactions") {
            sortStats = seasonStats.sort((a,b) => b.total_transactions - a.total_transactions);
            index = sortStats.findIndex((team) => team.owner_id === teamId) + 1;
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
    
    const getGameweekLeagueRank = (teamId, stat) => {
        let sortStats, index;
        if (stat === "points") {
            sortStats = gameweekStats.sort((a,b) => b.total_points - a.total_points);
            index = sortStats.findIndex((team) => team.owner_id === teamId) + 1;
        }
        if (stat === "minutes") {
            sortStats = gameweekStats.sort((a,b) => b.minutes - a.minutes);
            index = sortStats.findIndex((team) => team.owner_id === teamId) + 1;
        }
        if (stat === "goals") {
            sortStats = gameweekStats.sort((a,b) => b.goals_scored - a.goals_scored);
            index = sortStats.findIndex((team) => team.owner_id === teamId) + 1;
        }
        if (stat === "assists") {
            sortStats = gameweekStats.sort((a,b) => b.assists - a.assists);
            index = sortStats.findIndex((team) => team.owner_id === teamId) + 1;
        }
        if (stat === "bonus") {
            sortStats = gameweekStats.sort((a,b) => b.bonus - a.bonus);
            index = sortStats.findIndex((team) => team.owner_id === teamId) + 1;
        }
        if (stat === "shutouts") {
            sortStats = gameweekStats.sort((a,b) => b.clean_sheets - a.clean_sheets);
            index = sortStats.findIndex((team) => team.owner_id === teamId) + 1;
        }
        if (stat === "goals against") {
            sortStats = gameweekStats.sort((a,b) => b.goals_conceded - a.goals_conceded);
            index = sortStats.findIndex((team) => team.owner_id === teamId) + 1;
        }
        if (stat === "yellows") {
            sortStats = gameweekStats.sort((a,b) => b.yellow_cards - a.yellow_cards);
            index = sortStats.findIndex((team) => team.owner_id === teamId) + 1;
        }
        if (stat === "reds") {
            sortStats = gameweekStats.sort((a,b) => b.red_cards - a.red_cards);
            index = sortStats.findIndex((team) => team.owner_id === teamId) + 1;
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

    if (gameweekStats.length === 0) {
        return (
            <section>
                <h2>Still waiting for the start of the 2023 season!</h2>
            </section>
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
        <section>

            <h2 style={{textAlign:'center'}}>Starting Lineup Stats for Gameweek {currentGameweek ? currentGameweek : "TBD"} & Overall Season Stats</h2>
            <div className='card-row'>
                <div className="card-content">
                    {myGameweekStats.map((stat) => (
                        <div className="team-cards" key={stat.owner_id}>
                            <a href={"https://draft.premierleague.com/entry/" + stat.entry_id + "/event/" + currentGameweek} rel="noreferrer" target="_blank" className="fpl-link"><h3>{stat.person}</h3></a>
                            {/* <h4>Current Result:</h4> */}
                            {/* <br></br> */}
                            <h4 style={{padding:12}}>{checkWinLoss(stat.owner_id)}</h4>
                            <div>{stat.total_points} Points ({getGameweekLeagueRank(stat.owner_id, "points")})</div>
                            <div>{stat.minutes} Minutes ({getGameweekLeagueRank(stat.owner_id, "minutes")})</div>
                            <div>{stat.goals_scored} Goals ({getGameweekLeagueRank(stat.owner_id, "goals")})</div>
                            <div>{stat.assists} Assists ({getGameweekLeagueRank(stat.owner_id, "assists")})</div>
                            <div>{stat.bonus} Bonus ({getGameweekLeagueRank(stat.owner_id, "bonus")})</div>
                            <div>{stat.clean_sheets} Shutouts ({getGameweekLeagueRank(stat.owner_id, "shutouts")})</div>
                            <div>{stat.goals_conceded} Goals Against ({getGameweekLeagueRank(stat.owner_id, "goals against")})</div>
                            <div>{stat.yellow_cards} Yellow Cards ({getGameweekLeagueRank(stat.owner_id, "yellows")})</div>
                            <div>{stat.red_cards} Red Cards ({getGameweekLeagueRank(stat.owner_id, "reds")})</div>
                        </div>
                    ))}
                </div>

                <div className="card-content">
                    {mySeasonStats.map((stat) => (
                        <div className="team-cards" key={stat.owner_id}>
                            <h3>{stat.person}</h3>
                            <h4>Overall: {getTableRank(stat.owner_id)}</h4>
                            <div>{stat.total_points} Points ({getSeasonLeagueRank(stat.owner_id, "points")})</div>
                            <div>{stat.minutes} Minutes ({getSeasonLeagueRank(stat.owner_id, "minutes")})</div>
                            <div>{stat.goals_scored} Goals ({getSeasonLeagueRank(stat.owner_id, "goals")})</div>
                            <div>{stat.assists} Assists ({getSeasonLeagueRank(stat.owner_id, "assists")})</div>
                            <div>{stat.bonus} Bonus ({getSeasonLeagueRank(stat.owner_id, "bonus")})</div>
                            <div>{stat.clean_sheets} Shutouts ({getSeasonLeagueRank(stat.owner_id, "shutouts")})</div>
                            <div>{stat.goals_conceded} Goals Against ({getSeasonLeagueRank(stat.owner_id, "goals against")})</div>
                            <div>{stat.yellow_cards} Yellow Cards ({getSeasonLeagueRank(stat.owner_id, "yellows")})</div>
                            <div>{stat.red_cards} Red Cards ({getSeasonLeagueRank(stat.owner_id, "reds")})</div>
                            <div>{stat.total_transactions} Transactions ({getSeasonLeagueRank(stat.owner_id, "transactions")})</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TeamStats;
