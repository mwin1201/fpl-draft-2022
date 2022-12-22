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
                getAllStats(curGW);
                setMOTM(ManagerOfTheMonth(currentGameweek));
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

    if (isLoading) {
        return (
            <section>
                <div>Loading all of the Gameweek stats, be patient. {statCounter}/{JSON.parse(localStorage.getItem("current_gameweek"))}</div>
            </section>
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
            <div>
                <h1>{leagueData.name}</h1>
            </div>
            <div>
                <h2>
                    Manager of the Month
                    {MOTM.map((manager) => (
                        <div key={manager.team}>
                            <mark>{getEntryName(manager.team)} with {manager.points}pts over last 4 GWs!</mark>
                        </div>
                    ))}
                </h2>
            </div>
            <div>
                <h3>The participants</h3>
                {teamData.map((team) => (
                    <div key={team.id}>{team.player_first_name} {team.player_last_name} - {team.entry_name}</div>
                ))}
            </div>
            <div>
                <h3>League Standings</h3>
                <div>League Team - Wins - Draws - Losses - Pts For - Pts Against - Total Table Pts</div>
                {standingsData.map((player) => (
                    <div key={player.league_entry}>
                        {getEntryName(player.league_entry)} - {player.matches_won} - {player.matches_drawn} - 
                        {player.matches_lost} - {player.points_for} - {player.points_against} - {player.total}
                    </div>
                ))}
            </div>
        </main>
    )
};

export default Homepage;