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

    const getColorCode = (index) => {
        let currentLeague = JSON.parse(localStorage.getItem("current_league"));
        if (currentLeague === 24003) {
            if (index === 0) {
                return "standings-top1";
            }
            else if (index > 0 && index < 4) {
                return "standings-top4";
            }
            else if (index > 6 && index < 10) {
                return "standings-bottom3";
            }
        }
        else {
            if (index === 0) {
                return "standings-top1";
            }
            else if (index === 1) {
                return "standings-top4";
            }
            else if (index > 1 && index < 6) {
                return "standings-playoff4";
            }
            else if (index === 9) {
                return "standings-bottom3";
            }
        }
    };

    if (!(standings)) {
        return (
            <section>
                <h3>There are no standings at this time to display.</h3>
            </section>
        );
    }

    return (
        <section>
            <h2 style={{textAlign:'center'}}>League Standings</h2>
            <table className="table-data">
                <thead>
                <tr>
                    <th>Team</th>
                    <th>W</th>
                    <th>D</th>
                    <th>L</th>
                    <th>Pts For</th>
                    <th>Pts Against</th>
                    <th>Pts Diff</th>
                    <th>Total Points</th>
                </tr>
                </thead>
                <tbody>
                {standingsData.map((player, index) => (
                    <tr className={getColorCode(index)} key={player.league_entry}>
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