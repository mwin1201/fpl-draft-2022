import React, { useState, useEffect } from "react";
import {Link, useNavigate} from "react-router-dom"

const Aggregate = () => {
    const [points, setPoints] = useState(0);
    const [teamPoints, setTeamPoints] = useState([]);

    const navigate = useNavigate();
    const goToHomepage = () => {
        navigate("/");
    };

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

    if (points < 1) { 
        return (
            <div>Loading...</div>
        )
    }

    return (
        <div>
            <div>
                <Link to="/"></Link>
                <button onClick={goToHomepage}>
                    Homepage
                </button>
            </div>
            <h1>Total Points in all of FPL: {points}</h1>

            <h2>Team Breakdown</h2>
            {teamPoints.sort((a,b) => b.totalPoints - a.totalPoints)
            .map((team, i) => (
                <div key={team.teamId}>
                    <h3>{i+1}. {team.premTeam}: {team.totalPoints} points - {doMath(team.totalPoints, points)}% of all points</h3>
                    {team.players.sort((a,b) => b.total_points - a.total_points).map((player) => (
                        <div key={player.id}>
                            <strong>{getPosition(player.element_type)}</strong> {player.first_name} {player.second_name}: {player.total_points} points - {doMath(player.total_points,team.totalPoints)} % of team total points
                        </div>
                    ))}
                </div>

            ))}


        </div>
    )

};

export default Aggregate;