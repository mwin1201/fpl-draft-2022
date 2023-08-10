import React, {useState, useEffect} from 'react';
const axios = require('axios').default;

const TeamStats = ({ owner_entry_id }) => {
    const [currentGameweek, setCurrentGameweek] = useState(JSON.parse(localStorage.getItem("current_gameweek")));
    const [isLoading, setIsLoading] = useState(true);
    const [gameweekStats, setGameweekStats] = useState([]);
    const [myGameweekStats, setMyGameweekStats] = useState();
    const [mySeasonStats, setMySeasonStats] = useState();
    const [seasonStats, setSeasonStats] = useState();

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
            let currentOrigin = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_prodOrigin : "http://localhost:5001";
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
            setGameweekStats(JSON.parse(localStorage.getItem(`gw_${currentGameweek}_stats`)));
            let allStats = createFullStatArray(currentGameweek);
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
            setMyGameweekStats(JSON.parse(localStorage.getItem(`gw_${currentGameweek}_stats`)).filter((stat) => stat.teamId == owner_entry_id));
            setSeasonStats(newStatArr);
            setMySeasonStats(newStatArr.filter((stat) => stat.teamId == owner_entry_id));
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
            index = sortStats.findIndex((team) => team.teamId === teamId) + 1;
        }
        if (stat === "minutes") {
            sortStats = seasonStats.sort((a,b) => b.minutes - a.minutes);
            index = sortStats.findIndex((team) => team.teamId === teamId) + 1;
        }
        if (stat === "goals") {
            sortStats = seasonStats.sort((a,b) => b.goals_scored - a.goals_scored);
            index = sortStats.findIndex((team) => team.teamId === teamId) + 1;
        }
        if (stat === "assists") {
            sortStats = seasonStats.sort((a,b) => b.assists - a.assists);
            index = sortStats.findIndex((team) => team.teamId === teamId) + 1;
        }
        if (stat === "bonus") {
            sortStats = seasonStats.sort((a,b) => b.bonus - a.bonus);
            index = sortStats.findIndex((team) => team.teamId === teamId) + 1;
        }
        if (stat === "shutouts") {
            sortStats = seasonStats.sort((a,b) => b.clean_sheets - a.clean_sheets);
            index = sortStats.findIndex((team) => team.teamId === teamId) + 1;
        }
        if (stat === "goals against") {
            sortStats = seasonStats.sort((a,b) => b.goals_conceded - a.goals_conceded);
            index = sortStats.findIndex((team) => team.teamId === teamId) + 1;
        }
        if (stat === "yellows") {
            sortStats = seasonStats.sort((a,b) => b.yellow_cards - a.yellow_cards);
            index = sortStats.findIndex((team) => team.teamId === teamId) + 1;
        }
        if (stat === "reds") {
            sortStats = seasonStats.sort((a,b) => b.red_cards - a.red_cards);
            index = sortStats.findIndex((team) => team.teamId === teamId) + 1;
        }
        if (stat === "transactions") {
            sortStats = seasonStats.sort((a,b) => b.total_transactions - a.total_transactions);
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
    
    const getGameweekLeagueRank = (teamId, stat) => {
        let sortStats, index;
        if (stat === "points") {
            sortStats = gameweekStats.sort((a,b) => b.total_points - a.total_points);
            index = sortStats.findIndex((team) => team.teamId === teamId) + 1;
        }
        if (stat === "minutes") {
            sortStats = gameweekStats.sort((a,b) => b.minutes - a.minutes);
            index = sortStats.findIndex((team) => team.teamId === teamId) + 1;
        }
        if (stat === "goals") {
            sortStats = gameweekStats.sort((a,b) => b.goals_scored - a.goals_scored);
            index = sortStats.findIndex((team) => team.teamId === teamId) + 1;
        }
        if (stat === "assists") {
            sortStats = gameweekStats.sort((a,b) => b.assists - a.assists);
            index = sortStats.findIndex((team) => team.teamId === teamId) + 1;
        }
        if (stat === "bonus") {
            sortStats = gameweekStats.sort((a,b) => b.bonus - a.bonus);
            index = sortStats.findIndex((team) => team.teamId === teamId) + 1;
        }
        if (stat === "shutouts") {
            sortStats = gameweekStats.sort((a,b) => b.clean_sheets - a.clean_sheets);
            index = sortStats.findIndex((team) => team.teamId === teamId) + 1;
        }
        if (stat === "goals against") {
            sortStats = gameweekStats.sort((a,b) => b.goals_conceded - a.goals_conceded);
            index = sortStats.findIndex((team) => team.teamId === teamId) + 1;
        }
        if (stat === "yellows") {
            sortStats = gameweekStats.sort((a,b) => b.yellow_cards - a.yellow_cards);
            index = sortStats.findIndex((team) => team.teamId === teamId) + 1;
        }
        if (stat === "reds") {
            sortStats = gameweekStats.sort((a,b) => b.red_cards - a.red_cards);
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

    if (JSON.parse(localStorage.getItem(`gw_${currentGameweek}_stats`)) === null) {
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

            <h2 style={{textAlign:'center'}}>Starting Lineup Stats for Gameweek {currentGameweek ? currentGameweek : "TBD"}</h2>
            <div className='card-row'>
                <div className="card-content">
                    {myGameweekStats.map((stat) => (
                        <div className="team-cards" key={stat.teamId}>
                            <a href={"https://draft.premierleague.com/entry/" + stat.teamId + "/event/" + currentGameweek} rel="noreferrer" target="_blank" className="fpl-link"><h3>{stat.person}</h3></a>
                            {/* <h4>Current Result:</h4> */}
                            {/* <br></br> */}
                            <h4 style={{padding:12}}>{checkWinLoss(stat.league_entry)}</h4>
                            <div>{stat.total_points} Points ({getGameweekLeagueRank(stat.teamId, "points")})</div>
                            <div>{stat.minutes} Minutes ({getGameweekLeagueRank(stat.teamId, "minutes")})</div>
                            <div>{stat.goals_scored} Goals ({getGameweekLeagueRank(stat.teamId, "goals")})</div>
                            <div>{stat.assists} Assists ({getGameweekLeagueRank(stat.teamId, "assists")})</div>
                            <div>{stat.bonus} Bonus ({getGameweekLeagueRank(stat.teamId, "bonus")})</div>
                            <div>{stat.clean_sheets} Shutouts ({getGameweekLeagueRank(stat.teamId, "shutouts")})</div>
                            <div>{stat.goals_conceded} Goals Against ({getGameweekLeagueRank(stat.teamId, "goals against")})</div>
                            <div>{stat.yellow_cards} Yellow Cards ({getGameweekLeagueRank(stat.teamId, "yellows")})</div>
                            <div>{stat.red_cards} Red Cards ({getGameweekLeagueRank(stat.teamId, "reds")})</div>
                        </div>
                    ))}
                </div>

                <div className="card-content">
                    {mySeasonStats.map((stat) => (
                        <div className="team-cards" key={stat.teamId}>
                            <h3>{stat.person}</h3>
                            <h4>Overall: {getTableRank(stat.league_entry)}</h4>
                            <div>{stat.total_points} Points ({getSeasonLeagueRank(stat.teamId, "points")})</div>
                            <div>{stat.minutes} Minutes ({getSeasonLeagueRank(stat.teamId, "minutes")})</div>
                            <div>{stat.goals_scored} Goals ({getSeasonLeagueRank(stat.teamId, "goals")})</div>
                            <div>{stat.assists} Assists ({getSeasonLeagueRank(stat.teamId, "assists")})</div>
                            <div>{stat.bonus} Bonus ({getSeasonLeagueRank(stat.teamId, "bonus")})</div>
                            <div>{stat.clean_sheets} Shutouts ({getSeasonLeagueRank(stat.teamId, "shutouts")})</div>
                            <div>{stat.goals_conceded} Goals Against ({getSeasonLeagueRank(stat.teamId, "goals against")})</div>
                            <div>{stat.yellow_cards} Yellow Cards ({getSeasonLeagueRank(stat.teamId, "yellows")})</div>
                            <div>{stat.red_cards} Red Cards ({getSeasonLeagueRank(stat.teamId, "reds")})</div>
                            <div>{stat.total_transactions} Transactions ({getSeasonLeagueRank(stat.teamId, "transactions")})</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TeamStats;