import React from "react";
import calculateAVGScore from "../../data/AvgGWScore";
import getTeamName from "../../data/TeamName";
import getRecord from "../../data/MatchResults";
import { Link } from "react-router-dom";

const Playoffs = ({league_id}) => {
    let standings = JSON.parse(localStorage.getItem("standings"));

    let playoffTeams = standings.filter((team) => (
        team.rank === 3 || team.rank === 4 || team.rank === 5 || team.rank === 6
    ));

    // Things I am thinking:
    // 1. Add more to the playoff team objects: team name, avg game week scores over past 5 gameweeks, W-D-L record over past 5 games
    // 2. Split the array into the 2 matchups
    // 3. Print out these 2 arrays

    for (var i = 0; i < playoffTeams.length; i++) {
        playoffTeams[i].avgScore = calculateAVGScore(playoffTeams[i].league_entry, 5);
        playoffTeams[i].teamName = getTeamName(playoffTeams[i].league_entry);
        playoffTeams[i].results = getRecord(playoffTeams[i].league_entry, 5);
    }

    // 3 vs 6
    let firstMatchup = playoffTeams.filter((team) => team.rank === 3 || team.rank === 6);

    // 4 vs 5
    let secondMatchup = playoffTeams.filter((team) => team.rank === 4 || team.rank === 5);

    if (league_id === 20667) {
        return (
            <div className="container">
                <Link to='/championshipPlayoffs'><h3>Championship Playoffs</h3></Link>
                <div className="row row-cols-2">
                {firstMatchup.map((team) => (
                    <div className="col" key={team.league_entry}>
                        <h5>#{team.rank}: {team.teamName}</h5>
                        <p>L5 GW Avg Score: {team.avgScore}</p>
                        <p>L5 GW Results: {team.results}</p>    
                    </div>
                ))}
                </div>
                <div className="row row-cols-2">
                {secondMatchup.map((team) => (
                    <div className="col" key={team.league_entry}>
                        <h5>#{team.rank}: {team.teamName}</h5>
                        <p>L5 GW Avg Score: {team.avgScore}</p>
                        <p>L5 GW Results: {team.results}</p>    
                    </div>
                ))}
                </div>
            </div>
        );
    }

    else {
        return(<div></div>);
    }

};

export default Playoffs;