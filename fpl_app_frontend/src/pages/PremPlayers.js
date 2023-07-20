import React, { useState } from "react";
import LeagueAlert from "../alerts/LeagueAlert.js";

const PremPlayers = () => {
    const [filterPoints, setFilterPoints] = useState(0);
    const [filterTeam, setFilterTeam] = useState(0);
    const [filterOwner, setFilterOwner] = useState(0);
    const [filterPosition, setFilterPosition] = useState(0);
    const [players, setPlayers] = useState(JSON.parse(localStorage.getItem("elements")));
    const [formSubmit, setFormSubmit] = useState(0);
    const [plyerOwnership, setPlyerOwnership] = useState([]);
    const [showStat, setShowStat] = useState("total_points");

    let playerPositions = JSON.parse(localStorage.getItem("element_types"));
    let premTeams = JSON.parse(localStorage.getItem("teams"));
    let playerOwnership = JSON.parse(localStorage.getItem("player_ownership"));
    let leagueTeams = JSON.parse(localStorage.getItem("league_entries"));

    const handleTeamSubmit = async (event) => {
        event.preventDefault();
        let points = document.getElementById("statistics").value;
        let teamId = document.getElementById("team").value;
        setFilterPoints(points);
        setFilterTeam(teamId);
        setFormSubmit(0);
        setFilterPosition(0);
        styleCurrentFilter("team");
    };

    const handleOwnerSubmit = async (event) => {
        event.preventDefault();
        let owner = document.getElementById("owner").value;
        createNewArray();
        setFilterOwner(owner);
        setFormSubmit(1);
        setFilterPosition(0);
        styleCurrentFilter("owner");
    };

    const handlePositionSubmit = async (event) => {
        event.preventDefault();
        let position = document.getElementById("position").value;
        setFilterPosition(position);
        styleCurrentFilter("position");
    };

    const handleStatToggle = async (event) => {
        event.preventDefault();
        let stat = document.getElementById("stats").value;
        setShowStat(stat);

    }

    const styleCurrentFilter = (curFilter) => {
        const teamElement = document.getElementById("teamTitle");
        const ownerElement = document.getElementById("ownerTitle");
        const positionElement = document.getElementById("positionTitle");

        if (curFilter == "team") {
            teamElement.className = "current-filter";
            ownerElement.classList.remove("current-filter");
            positionElement.classList.remove("current-filter");
        } 
        else if (curFilter == "owner") {
            ownerElement.className = "current-filter";
            teamElement.classList.remove("current-filter");
            positionElement.classList.remove("current-filter");
        }
        else {
            positionElement.className = "current-filter";
            ownerElement.classList.remove("current-filter");
            teamElement.classList.remove("current-filter");
        }
    };

    const createNewArray = () => {
        let newPlayerArray = [];
        for (var i = 0; i < playerOwnership.length; i++) {
            let newObj = {};
            let playerData = getPlayerData(playerOwnership[i].element);
            newObj = {...playerData, ...playerOwnership[i]};
            newPlayerArray.push(newObj);
        }
        setPlyerOwnership(newPlayerArray);
    };

    const getOwner = (playerId) => {
        let singlePlayer = playerOwnership.filter((player) => player.element === playerId);
        if (singlePlayer[0].owner) {
            let team = leagueTeams.filter((team) => team.entry_id === singlePlayer[0].owner);
            return (
                <em>Owned by {team[0].entry_name}</em>
            );
        }
        else {
            return (
                <mark>Available!</mark>
            );
        }
    };

    const getType = (type) => {
        let elementType = playerPositions.filter((pos) => (pos.id == type));
        let elementObj = elementType[0];
        return elementObj.singular_name_short;
    };

    const getPlayerData = (playerId) => {
        let singlePlayer = players.filter((player) => ( player.id === playerId));
        let playerObj = singlePlayer[0];
        playerObj.elementType = getType(playerObj.element_type);
        return playerObj;
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

    return (
        <main>
            <LeagueAlert data={{user: JSON.parse(localStorage.getItem("current_user")), league: JSON.parse(localStorage.getItem("current_league")), leagueData: JSON.parse(localStorage.getItem("league_data"))}}/>
            <section>
                <h2 id="teamTitle">Filter Prem Players by Stat and Team</h2>
                <form id="teamFilter" onSubmit={handleTeamSubmit}>
                    <label htmlFor="statistics">{showStat == "total_points" ? "POINTS" : showStat.toUpperCase()}: </label>
                    <input type="number" id="statistics" name="statistics" min="0"></input>
                    <label htmlFor="team">Prem Team: </label>
                    <select name="team" id="team">
                        <option value="">All Teams</option>
                        {premTeams.map((team) => (
                            <option key={team.id} value={team.id}>{team.name}</option>
                        ))}
                    </select>
                    <button type="submit">Submit</button>
                </form>
            </section>

            <section>
                <h2 id="ownerTitle">Filter Players by League Teams</h2>
                <form id="ownerFilter" onSubmit={handleOwnerSubmit}>
                    <label htmlFor="owner">Team: </label>
                    <select name="owner" id="owner">
                        <option value="">No Team Selected</option>
                        {leagueTeams.map((team) => (
                            <option key={team.entry_id} value={team.entry_id}>{team.entry_name}</option>
                        ))}
                    </select>
                    <button type="submit">Submit</button>
                </form>
            </section>

            <section>
                <h2 id="positionTitle">Filter Players by Position</h2>
                <form id="positionFilter" onSubmit={handlePositionSubmit}>
                    <label htmlFor="position">Position: </label>
                    <select name="position" id="position">
                        <option value="">No Position Selected</option>
                        {playerPositions.map((position) => (
                            <option key={position.id} value={position.id}>{position.singular_name_short}</option>
                        ))}
                    </select>
                    <button type="submit">Submit</button>
                </form>
            </section>

            <section>
                <h2>Toggle Stats</h2>
                <form id="showMin" onSubmit={handleStatToggle}>
                    <select name="stats" id="stats">
                        <option value="total_points">Points</option>
                        <option value="minutes">Minutes Played</option>
                        <option value="form">Form</option>
                    </select>
                    <button type="submit">Toggle Stats</button>
                </form>
            </section>


            <h2>Filtered Players</h2>
                {filterPosition ?
                    <table className="table-data">
                        <thead>
                            <tr>
                                <th>Rank</th>
                                <th>Position</th>
                                <th>Team</th>
                                <th>Name</th>
                                <th>Stat</th>
                                <th>Owner</th>
                                <th>News</th>
                            </tr>
                        </thead>
                        <tbody>
                        {players.filter((player) => (
                            player.element_type == filterPosition
                        ))
                        .sort((a,b) => b[showStat] - a[showStat])
                        .map((filteredPlayer, i) => (
                            <tr key={filteredPlayer.id}>
                                <td>#{i+1}</td>
                                <td>{getType(filteredPlayer.element_type)}</td>
                                <td>{getTeam(filteredPlayer.team)}</td>
                                <td>{filteredPlayer.first_name} {filteredPlayer.second_name}</td>
                                <td>{filteredPlayer[showStat]} {showStat == "total_points" ? "points" : showStat}</td>
                                <td>{getOwner(filteredPlayer.id)}</td>
                                <td>{getNews(filteredPlayer.id)}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>:
                    <div>
                        {formSubmit ?
                            <table className="table-data">
                                <thead>
                                    <tr>
                                        <th>Rank</th>
                                        <th>Position</th>
                                        <th>Team</th>
                                        <th>Name</th>
                                        <th>Stat</th>
                                        <th>Owner</th>
                                        <th>News</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {plyerOwnership.filter((player) => (
                                        player.owner == filterOwner
                                    ))
                                    .sort((a,b) => a.element_type - b.element_type)
                                    .map((filteredPlayer,i) => (
                                        <tr key={filteredPlayer.element}>
                                            <td>#{i+1}</td>
                                            <td>{getType(filteredPlayer.element_type)}</td>
                                            <td>{getTeam(filteredPlayer.team)}</td>
                                            <td>{filteredPlayer.first_name} {filteredPlayer.second_name}</td>
                                            <td>{filteredPlayer[showStat]} {showStat == "total_points" ? "points" : showStat}</td>
                                            <td>{getOwner(filteredPlayer.id)}</td>
                                            <td>{getNews(filteredPlayer.id)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table> :
                            <div>
                                {filterTeam ?
                                    <table className="table-data">
                                        <thead>
                                            <tr>
                                                <th>Rank</th>
                                                <th>Position</th>
                                                <th>Team</th>
                                                <th>Name</th>
                                                <th>Stat</th>
                                                <th>Owner</th>
                                                <th>News</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {players.filter(player =>
                                                (player[showStat] >= filterPoints) && (player.team == filterTeam)
                                            )
                                            .sort((a, b) => b[showStat] - a[showStat])
                                            .map((filteredPlayer,i) => (
                                                <tr key={filteredPlayer.id}>
                                                    <td>#{i+1}</td>
                                                    <td>{getType(filteredPlayer.element_type)}</td>
                                                    <td>{getTeam(filteredPlayer.team)}</td>
                                                    <td>{filteredPlayer.first_name} {filteredPlayer.second_name}</td>
                                                    <td>{filteredPlayer[showStat]} {showStat == "total_points" ? "points" : showStat}</td>
                                                    <td>{getOwner(filteredPlayer.id)}</td>
                                                    <td>{getNews(filteredPlayer.id)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table> :
                                    <table className="table-data">
                                        <thead>
                                            <tr>
                                                <th>Rank</th>
                                                <th>Position</th>
                                                <th>Team</th>
                                                <th>Name</th>
                                                <th>Stat</th>
                                                <th>Owner</th>
                                                <th>News</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {players.filter(player =>
                                                (player[showStat] >= filterPoints)
                                            )
                                            .sort((a, b) => b[showStat] - a[showStat])
                                            .map((filteredPlayer,i) => (
                                                <tr key={filteredPlayer.id}>
                                                    <td>#{i+1}</td>
                                                    <td>{getType(filteredPlayer.element_type)}</td>
                                                    <td>{getTeam(filteredPlayer.team)}</td>
                                                    <td>{filteredPlayer.first_name} {filteredPlayer.second_name}</td>
                                                    <td>{filteredPlayer[showStat]} {showStat == "total_points" ? "points" : showStat}</td>
                                                    <td>{getOwner(filteredPlayer.id)}</td>
                                                    <td>{getNews(filteredPlayer.id)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                }
                            </div>
                        }
                    </div>
                }
        </main>
    )
};

export default PremPlayers;