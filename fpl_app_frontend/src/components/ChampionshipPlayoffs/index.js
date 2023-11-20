import React, { useState } from "react";

const Playoffs = () => {
    const [currentGameweek, setCurrentGameweek] = useState(JSON.parse(localStorage.getItem("current_gameweek")));
    const [standings, setStandings] = useState(JSON.parse(localStorage.getItem("standings")));

    let playoffTeams = standings.filter((team) => (
        team.rank === 3 || team.rank === 4 || team.rank === 5 || team.rank === 6
    ));

    // Things I am thinking:
    // 1. Add more to the playoff team objects: team name, avg game week scores over past 5 gameweeks, W-D-L record over past 5 games
    // 2. Split the array into the 2 matchups
    // 3. Print out these 2 arrays


    return (
        <div>
            <h3>Championship Playoffs</h3>
            {playoffTeams.map((team) => (
                <div key={team.league_entry}>
                    <p>#{team.rank}: {team.league_entry}</p>    
                </div>
            ))}
        </div>
    );

};

export default Playoffs;