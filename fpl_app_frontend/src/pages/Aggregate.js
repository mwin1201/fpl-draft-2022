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
                teamPointsArr.push({teamId: premTeams[i].id, premTeam: premTeams[i].name, totalPoints: calculatePoints(curTeam)})
            }
            setTeamPoints(teamPointsArr);
        };
        calculateTotalPoints();
        calculateTeamPoints();
    },[])

    const doMath = (value) => {
        const result = (value/points) * 100;
        return result.toFixed(2);
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
                <div key={team.teamId}>{i+1}. {team.premTeam}: {team.totalPoints} points - {doMath(team.totalPoints)}% of all points</div>
            ))}


        </div>
    )

};

export default Aggregate;