import React, { useState } from "react";
import LeagueAlert from "../alerts/LeagueAlert.js";

const Draft = () => {

    const [roundFilter, setRoundFilter] = useState(0);
    const [teamFilter, setTeamFilter] = useState(0);

    const [draft, setDraft] = useState(JSON.parse(localStorage.getItem("draft_data")))

    let players = JSON.parse(localStorage.getItem("elements"));
    let leagueTeams = JSON.parse(localStorage.getItem("league_entries"));

    const getPlayerName = (element) => {
        let filteredPlayer = players.filter((player) => player.id === element);
        return filteredPlayer[0].first_name + " " + filteredPlayer[0].second_name;
    };

    const getPlayerPoints = (element) => {
        let filteredPlayer = players.filter((player) => player.id === element);
        return filteredPlayer[0].total_points;
    };

    const getPlayerCurrentPointRank = (element) => {
        let sortedPlayers = players.sort((a,b) => {
            return b.total_points - a.total_points
        });
        for (var i = 0; i < sortedPlayers.length; i++) {
            if (sortedPlayers[i].id === element) {
                return i+1;
            }
        }
    };

    const handleRoundSubmit = (event) => {
        event.preventDefault();
        let draftArr = JSON.parse(localStorage.getItem("draft_data"));
        let round = document.getElementById("round").value;
        setRoundFilter(round);
        setDraft(draftArr.filter((pick) => pick.round == round));
    };

    const handleTeamSubmit = (event) => {
        event.preventDefault();
        let draftArr = JSON.parse(localStorage.getItem("draft_data"));
        let team = document.getElementById("team").value;
        setTeamFilter(team);
        setDraft(draftArr.filter((pick) => pick.entry == team));
    };


    return (
        <main>
            <LeagueAlert data={{user: JSON.parse(localStorage.getItem("current_user")), league: JSON.parse(localStorage.getItem("current_league")), leagueData: JSON.parse(localStorage.getItem("league_data"))}}/>
            <section>
                <h2>See Players Picked by Round</h2>
                <form id="roundFilter" onSubmit={handleRoundSubmit}>
                    <label htmlFor="round">Round: </label>
                    <input type="number" id="round" name="round" min="1" max="15"></input>
                    <button type="submit">Submit</button>
                </form>
                <h2>See Players Picked by Team</h2>
                <form id="teamFilter" onSubmit={handleTeamSubmit}>
                    <label htmlFor="team">Team: </label>
                    <select name="team" id="team">
                        {leagueTeams.map((team) => (
                            <option key={team.id} value={team.entry_id}>{team.entry_name}</option>
                        ))}
                    </select>
                    <button type="submit">Submit</button>
                </form>
            </section>

            <h1>Draft Order</h1>
            <table className="table-data">
                <thead>
                    <tr>
                        <th>Round</th>
                        <th>Owner</th>
                        <th>Player Name</th>
                        <th>Pts</th>
                        <th>Rank</th>
                    </tr>
                </thead>
                <tbody>
                {draft.map((pick,i) => (
                    <tr key={i}>
                        <td>{pick.round}</td>
                        <td>{pick.entry_name}</td>
                        <td>{getPlayerName(pick.element)}</td>
                        <td>{getPlayerPoints(pick.element)}</td>
                        <td>#{getPlayerCurrentPointRank(pick.element)}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </main>
    )

};

export default Draft;