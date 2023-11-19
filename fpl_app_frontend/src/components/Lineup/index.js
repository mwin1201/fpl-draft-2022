import React, { useState, useEffect } from "react";

const Lineup = ({ owner_id }) => {
    const [playersAndOwners, setPlayersAndOwners] = useState();
    const [isLoading, setIsLoading] = useState(true);
    let players = JSON.parse(localStorage.getItem("elements"));
    let playerPositions = JSON.parse(localStorage.getItem("element_types"));
    let premTeams = JSON.parse(localStorage.getItem("teams"));
    let premFixtures = JSON.parse(localStorage.getItem("current_fixtures"));

    useEffect(() => {
        let playerOwnership = JSON.parse(localStorage.getItem("player_ownership"));
        let players = JSON.parse(localStorage.getItem("elements"));
        const createNewArray = async () => {
            let newPlayerArray = [];
            for (var i = 0; i < playerOwnership.length; i++) {
                let newObj = {};
                let playerData = getPlayerData(playerOwnership[i].element);
                newObj = {...playerData, ...playerOwnership[i]};
                newPlayerArray.push(newObj);
            }
            setPlayersAndOwners(newPlayerArray);
            setIsLoading(false);
        };

        const getPlayerData = (playerId) => {
            let singlePlayer = players.filter((player) => ( player.id === playerId));
            let playerObj = singlePlayer[0];
            return playerObj;
        };

        createNewArray();
    },[]);

    const getType = (type) => {
        let elementType = playerPositions.filter((pos) => (pos.id == type));
        let elementObj = elementType[0];
        return elementObj.singular_name_short;
    };

    const getNews = (playerId) => {
        let singlePlayer = players.filter((player) => player.id === playerId);
        let playerObj = singlePlayer[0];
        return (
            <span className="news">{playerObj.news}</span>
        );
    };

    const getTeam = (teamId) => {
        let singleTeam = premTeams.filter((team) => team.id === teamId);
        let teamObj = singleTeam[0];
        return teamObj.short_name;
    };

    const getFixtureDifficulty = (team) => {
        team = parseInt(team);
        let homeTeams = premFixtures.filter((fixture) => parseInt(fixture.team_h) === team);
        let awayTeams = premFixtures.filter((fixture) => parseInt(fixture.team_a) === team);
        let fixtureDifficulty;

        if (homeTeams.length > 0) {
            fixtureDifficulty = homeTeams[0].team_h_difficulty;
        } else {
            fixtureDifficulty = awayTeams[0].team_a_difficulty;
        }

        return fixtureDifficulty;
    };

    const getFDRClassName = (FDR) => {
        if (FDR < 6 && FDR > 3) {
            return "red-highlight";
        }
        else if (FDR < 3 && FDR > 0) {
            return "green-highlight";
        }
        else { return "grey-highlight" };
    };
   
    if (isLoading) {
        return (
            <h1>Loading</h1>
        );
    }

    return (
        <section>
            <h2>Current Squad</h2>
            <table className="table-data">
                <thead>
                    <tr>
                        <th>Rank</th>
                        <th>Pos</th>
                        <th>Team</th>
                        <th>Name</th>
                        <th>FDR</th>
                        <th>Pts</th>
                        <th>News</th>
                    </tr>
                </thead>
                <tbody>
                    {playersAndOwners.filter((player) => (
                        player.owner === owner_id
                    ))
                    .sort((a,b) => a.element_type - b.element_type)
                    .map((filteredPlayer,i) => (
                        <tr key={filteredPlayer.element}>
                            <td>#{i+1}</td>
                            <td>{getType(filteredPlayer.element_type)}</td>
                            <td>{getTeam(filteredPlayer.team)}</td>
                            <td>{filteredPlayer.second_name}</td>
                            <td className={getFDRClassName(getFixtureDifficulty(filteredPlayer.team))}>{getFixtureDifficulty(filteredPlayer.team)}</td>
                            <td>{filteredPlayer.total_points}</td>
                            <td>{getNews(filteredPlayer.id)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </section>
    );
};

export default Lineup;