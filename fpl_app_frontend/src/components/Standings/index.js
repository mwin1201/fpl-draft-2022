import React, {useState, useEffect} from 'react';

const Standings = ({standings, teams}) => {
    const [standingsData, setStandingsData] = useState(standings);
    const [teamData, setTeamData] = useState(teams);

    const getEntryName = (entry_id) => {
        let oneTeam = teamData.filter((team) => {
            return team.id === entry_id;
        });

        return oneTeam[0].entry_name;
    };

    const getDifference = (num1, num2) => {
        return num1 - num2;
    };

    return (
        <section>
            <h2 style={{textAlign:'center'}}>League Standings</h2>
            <table className="table-data">
                <thead>
                <tr>
                    <th>League Team</th>
                    <th>Wins</th>
                    <th>Draws</th>
                    <th>Losses</th>
                    <th>Pts For</th>
                    <th>Pts Against</th>
                    <th>Pts Diff</th>
                    <th>Total Table Points</th>
                </tr>
                </thead>
                <tbody>
                {standingsData.map((player) => (
                    <tr key={player.league_entry}>
                        <td>{getEntryName(player.league_entry)}</td>
                        <td>{player.matches_won}</td>
                        <td>{player.matches_drawn}</td>
                        <td>{player.matches_lost}</td>
                        <td>{player.points_for}</td>
                        <td>{player.points_against}</td>
                        <td>{getDifference(player.points_for, player.points_against)}</td>
                        <td>{player.total}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </section>
    )
};

export default Standings;