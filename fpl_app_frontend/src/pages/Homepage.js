import React, { useEffect, useState } from "react";
import getLeagueData from "../data/LeagueData";
import getPlayers from "../data/Players";
import getDraftData from "../data/DraftData";
import getGameweek from "../data/CurrentGameweek";
import seasonStats from "../data/GWStats";
import ManagerOfTheMonth from "../data/ManagerOTM";

const Homepage = () => {
    const [teamData, setTeamData] = useState([]);
    const [leagueData, setLeagueData] = useState([]);
    const [standingsData, setStandingsData] = useState([]);
    const [MOTM, setMOTM] = useState([]);
    const [currentGameweek, setCurrentGameweek] = useState(JSON.parse(localStorage.getItem("current_gameweek")));
    const [statCounter, setStatCounter] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);


    useEffect(() => {
        setIsLoading(true);

        const collectData = async (curGW) => {
            await Promise.allSettled([
                getLeagueData(),
                getPlayers(),
                getDraftData(),
            ]).then(() => {
                setTeamData(JSON.parse(localStorage.getItem("league_entries")));
                setLeagueData(JSON.parse(localStorage.getItem("league_data")));
                setStandingsData(JSON.parse(localStorage.getItem("standings")));
                setMOTM(ManagerOfTheMonth(currentGameweek));
                getAllStats(curGW);
            }).catch(() => setIsError(true));
        }

        const getAllStats = async (gw) => {
            for (var index = 1; index <= gw; index++) {
                setStatCounter(await seasonStats(index));
            }
            setIsLoading(false);
        };

        const start = async () => {
            const apiGW = await getGameweek();
            if (currentGameweek == null || apiGW != currentGameweek) {
                localStorage.clear();
                localStorage.setItem("current_gameweek", apiGW);
                collectData(apiGW);
            }
            else {
                setIsLoading(false);
                console.log("No need to update data");
                setTeamData(JSON.parse(localStorage.getItem("league_entries")));
                setLeagueData(JSON.parse(localStorage.getItem("league_data")));
                setStandingsData(JSON.parse(localStorage.getItem("standings")));
                setMOTM(ManagerOfTheMonth(currentGameweek));
            }
        };
        start();

    },[currentGameweek]);

    const getEntryName = (entry_id) => {
        let oneTeam = teamData.filter((team) => {
            return team.id === entry_id;
        });

        return oneTeam[0].entry_name;
    };

    const getDifference = (num1, num2) => {
        return num1 - num2;
    };

    if (isLoading) {
        return (
            <main>
                <div>Loading all of the Gameweek stats, be patient. {statCounter}/{JSON.parse(localStorage.getItem("current_gameweek"))}</div>
            </main>
        )
    }

    if (isError) {
        return (
            <div>
                There is an error, please refresh
            </div>
        )
    }

    return (
        <main>
            <section>
                <u><h1>{leagueData.name}</h1></u>
            </section>

            <section>
                <h2>
                    Manager of the Month
                    {MOTM.map((manager) => (
                        <div key={manager.team}>
                            <mark>{getEntryName(manager.team)} with {manager.points}pts over last 4 GWs!</mark>
                        </div>
                    ))}
                </h2>
            </section>

            <section>
                <h3>The Participants</h3>
                {teamData.map((team, i) => (
                    <div key={team.id}>{i+1}. {team.player_first_name} {team.player_last_name} - {team.entry_name}</div>
                ))}
            </section>

            <section>
                <h3>League Standings</h3>
                <table id="standings">
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
                </table>
            </section>

        </main>
    )
};

export default Homepage;