import React, { useState, useEffect } from "react";

const Aggregate = () => {
    const [points, setPoints] = useState(0);
    const [teamPoints, setTeamPoints] = useState([]);
    const [showPlayers, setShowPlayers] = useState(1);

    useEffect(() => {
        const calculateTotalPoints = () => {
            let allPlayers = JSON.parse(localStorage.getItem("elements"));
            let totalPoints = 0
            for (var i = 0; i < allPlayers.length; i++) {
                totalPoints += allPlayers[i].total_points;
            }
            setPoints(totalPoints);
        };
        const calculatePoints = (team) => {
            let totalPoints = 0
            for (var i = 0; i < team.length; i++) {
                totalPoints += team[i].total_points;
            }
            return totalPoints;
        };
        const calculateTeamPoints = () => {
            let teamPointsArr = [];
            let premTeams = JSON.parse(localStorage.getItem("teams"));
            let allPlayers = JSON.parse(localStorage.getItem("elements"));
            for (var i = 0; i < premTeams.length; i++) {
                let curTeam = allPlayers.filter((player) => {
                    return player.team === premTeams[i].id
                });
                teamPointsArr.push({teamId: premTeams[i].id, premTeam: premTeams[i].name, totalPoints: calculatePoints(curTeam), players: curTeam});
            }
            setTeamPoints(teamPointsArr);
        };
        calculateTotalPoints();
        calculateTeamPoints();
    },[])

    const doMath = (numerator, denominator) => {
        const result = (numerator/denominator) * 100;
        return result.toFixed(2);
    };

    const getPosition = (position) => {
        let playerPositions = JSON.parse(localStorage.getItem("element_types"));
        let type = playerPositions.filter((pos) => pos.id === position);
        return type[0].singular_name_short;
    };

    const handlePlayerButton = async (event) => {
        event.preventDefault();
        if (showPlayers) {
            setShowPlayers(0);
            let tables = document.getElementsByClassName("table-data");
            for (var i = 0; i < tables.length; i++) {
                tables[i].classList.add("hide-players");
            }
        }
        else {
            setShowPlayers(1);
            let tables = document.getElementsByClassName("table-data");
            for (var i = 0; i < tables.length; i++) {
                tables[i].classList.remove("hide-players");
            }
        }
    };

    if (points < 1) { 
        return (
            <div>Loading...</div>
        )
    }

    return (
        <main>
            <h1>Total Points in all of FPL: {points}</h1>

            <h2>Team Breakdown</h2>
            <form id="player-toggle" onSubmit={handlePlayerButton}>
                <button type="submit">{showPlayers ? "Hide Players" : "Show Players"}</button>
            </form>
            <section id="aggregate">
                {teamPoints.sort((a,b) => b.totalPoints - a.totalPoints)
                .map((team, i) => (
                    <div key={team.teamId}>
                        <h2>#{i+1}: {team.premTeam}: {team.totalPoints} points - {doMath(team.totalPoints, points)}% of all points</h2>
                        <table className="table-data">
                                <thead>
                                    <tr>
                                        <th>Position</th>
                                        <th>Player</th>
                                        <th>Points</th>
                                        <th>Percentage of Team</th>
                                    </tr>
                                </thead>
                        {team.players.sort((a,b) => b.total_points - a.total_points).map((player) => (
                             <tbody key={player.id}>
                                        <tr>
                                            <td>{getPosition(player.element_type)}</td>
                                            <td>{player.first_name} {player.second_name}</td>
                                            <td>{player.total_points}</td>
                                            <td>{doMath(player.total_points,team.totalPoints)}%</td>
                                        </tr>
                                    </tbody>
                            ))}
                        </table>
                    </div>
                ))}
            </section>
        </main>
    )

};

export default Aggregate;