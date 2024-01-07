import React from "react";
import getTeamName from "../../data/TeamName";
import PlayerPosition from "../../data/PlayerPosition";


const DreamTeam = () => {
    let dreamteam = JSON.parse(localStorage.getItem("dreamteam"));
    const playerOwnership = JSON.parse(localStorage.getItem("player_ownership"));
    const players = JSON.parse(localStorage.getItem("elements"));


    for (var i = 0; i < dreamteam.length; i++) {
        let loopPlayer = dreamteam[i];
        // get team that owns player
        let playerOwner = playerOwnership.filter((player) => player.element === loopPlayer.element_id)[0].owner;
        let singlePlayer = players.filter((player) => player.id === loopPlayer.element_id);
        dreamteam[i].leagueTeam = playerOwner ? getTeamName(playerOwner) : "Unowned";
        dreamteam[i].position = PlayerPosition(singlePlayer.element_type);
        dreamteam[i].name = singlePlayer.second_name;
    }

    return (
        <section>
            <h3>Gameweek Dream Team</h3>
            <table className="table-data">
                <thead>
                    <tr>
                        <th>Pos</th>
                        <th>Name</th>
                        <th>Owner</th>
                        <th>Pts</th>
                    </tr>
                </thead>
                <tbody>
                    {dreamteam.map((player) => (
                        <tr key={player.element_id}>
                            <td>{player.position}</td>
                            <td>{player.name}</td>
                            <td>{player.leagueTeam}</td>
                            <td>{player.total_points}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </section>
    );
};

export default DreamTeam;