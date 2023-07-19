import React, { useEffect, useState } from "react";
import getLeagueData from "../data/LeagueData";
import getPlayers from "../data/Players";
import getDraftData from "../data/DraftData";
import getGameweek from "../data/CurrentGameweek";
import seasonStats from "../data/GWStats";
import ManagerOfTheMonth from "../data/ManagerOTM";

import Spinner from 'react-bootstrap/Spinner';

// seed data for testing
//import Seeds from "../data/LocalStorage_seeds";


const Homepage = () => {
    const [teamData, setTeamData] = useState([]);
    const [leagueData, setLeagueData] = useState([]);
    const [standingsData, setStandingsData] = useState([]);
    const [MOTM, setMOTM] = useState([]);
    const [currentGameweek, setCurrentGameweek] = useState();
    const [currentGWStatus, setCurrentGWStatus] = useState("");
    const [statCounter, setStatCounter] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(JSON.parse(localStorage.getItem("current_user")));


    useEffect(() => {
        setIsLoading(true);

        if (!(JSON.parse(localStorage.getItem("current_user")))) {
            document.location.replace("/login");
        }

        const start = async () => {
            // set state variables
            setIsLoggedIn(JSON.parse(localStorage.getItem("current_user")));
            setCurrentGameweek(JSON.parse(localStorage.getItem("current_gameweek")));
            setTeamData(JSON.parse(localStorage.getItem("league_entries")));
            setLeagueData(JSON.parse(localStorage.getItem("league_data")));
            setStandingsData(JSON.parse(localStorage.getItem("standings")));
            setMOTM(localStorage.getItem("manager_of_the_month"));
            if (JSON.parse(localStorage.getItem("current_gameweek_complete")) === false) {
                setCurrentGWStatus("Incomplete");
            }
            else {
                setCurrentGWStatus("Complete");
            }
            setIsLoading(false);
        };

        // const start = () => {
        //     Seeds();
        //     setTeamData(JSON.parse(localStorage.getItem("league_entries")));
        //     setLeagueData(JSON.parse(localStorage.getItem("league_data")));
        //     setStandingsData(JSON.parse(localStorage.getItem("standings")));
        //     getManagerOfTheMonth(localStorage.getItem("current_gameweek"));
        // }
        start();

    },[]);

    const getEntryName = (entry_id) => {
        let oneTeam = teamData.filter((team) => {
            return team.id === entry_id;
        });

        return oneTeam[0].entry_name;
    };

    const getDifference = (num1, num2) => {
        return num1 - num2;
    };

    if (!(isLoggedIn)) {
        return (
            <main>
                <section>
                    <h1>This site is for FPL collegiate athletes and those who are not logged in shall not see the glorious data hidden behind these web walls. Please log in.</h1>
                </section>
            </main>
        );
    }

    if (isLoading) {
        //<div>Refreshing stats and populating consolidated gameweek data: {statCounter}</div>
        return (
            <main>
                <span>Loading...<Spinner animation="border" variant="success" /></span>
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
                    {MOTM ? 
                        MOTM.map((manager) => (
                            <div key={manager.team}>
                                <mark>{getEntryName(manager.team)} with {manager.points}pts over last 4 GWs!</mark>
                            </div>
                        ))
                    :
                        <div>
                            <h3>There is no manager of the month at this time</h3>
                        </div>}
                </h2>
            </section>

            <section>
                <h3>The Participants</h3>
                {teamData.map((team, i) => (
                    <div key={team.id}>{i+1}. {team.player_first_name} {team.player_last_name} - {team.entry_name}</div>
                ))}
            </section>

            <section>
                <h3>
                    Current Gameweek: {currentGameweek} - Status: {currentGWStatus}
                </h3>
            </section>

            <section>
                <h3>League Standings</h3>
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

        </main>
    )
};

export default Homepage;