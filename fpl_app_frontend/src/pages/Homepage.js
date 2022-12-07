import React, { useEffect, useState } from "react";
import {Link, useNavigate} from "react-router-dom"
import getLeagueData from "../data/LeagueData";
import getPlayers from "../data/Players";
import getDraftData from "../data/DraftData";
import getGameweek from "../data/CurrentGameweek";

const Homepage = () => {
    const [teamData, setTeamData] = useState([]);
    const [leagueData, setLeagueData] = useState([]);
    const [standingsData, setStandingsData] = useState([]);
    const [currentGameweek, setCurrentGameweek] = useState(JSON.parse(localStorage.getItem("current_gameweek")));
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);


    useEffect(() => {
        setIsLoading(true);

        const collectData = async () => {
            await Promise.allSettled([
                getLeagueData(),
                getPlayers(),
                getDraftData(),
            ]).then(() => {
                setTeamData(JSON.parse(localStorage.getItem("league_entries")));
                setLeagueData(JSON.parse(localStorage.getItem("league_data")));
                setStandingsData(JSON.parse(localStorage.getItem("standings")));
            }).catch(() => setIsError(true)).finally(() => setIsLoading(false));
        }

        const start = async () => {
            const apiGW = await getGameweek();
            if (currentGameweek == null || apiGW != currentGameweek) {
                localStorage.clear();
                localStorage.setItem("current_gameweek", apiGW);
                collectData();
            }
            else {
                setIsLoading(false);
                console.log("No need to update data");
                setTeamData(JSON.parse(localStorage.getItem("league_entries")));
                setLeagueData(JSON.parse(localStorage.getItem("league_data")));
                setStandingsData(JSON.parse(localStorage.getItem("standings")));
            }
        };
        start();

    },[currentGameweek]);

    const navigate = useNavigate();
    const goToFixtures = () => {
        navigate("/fixtureHistory");
    };

    const goToPremPlayers = () => {
        navigate("/premPlayers");
    };

    const goToLineups = () => {
        navigate("/lineups");
    };

    const goToAggregate = () => {
        navigate("/aggregate");
    };

    const goToDraft = () => {
        navigate("/draft");
    };

    const goToLeaders = () => {
        navigate("/leagueLeaders");
    };

    const goToSeasonLeaders = () => {
        navigate("/seasonLeaders");
    }


    const getEntryName = (entry_id) => {
        let oneTeam = teamData.filter((team) => {
            return team.id === entry_id;
        });
        return oneTeam[0].entry_name;
    };

    if (isLoading) {
        return (
            <div>Loading...be patient</div>
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
                <Link to="/fixtureHistory"></Link>
                <button onClick={goToFixtures}>
                        Fixture History
                </button>
            </div>
            <div>
                <Link to="/premPlayers"></Link>
                <button onClick={goToPremPlayers}>
                    See Players
                </button>
            </div>
            <div>
                <Link to="/lineups"></Link>
                <button onClick={goToLineups}>
                    See Team Lineups
                </button>
            </div>
            <div>
                <Link to="/aggregate"></Link>
                <button onClick={goToAggregate}>
                    See Aggregate Data
                </button>
            </div>
            <div>
                <Link to="/draft"></Link>
                <button onClick={goToDraft}>
                    See Draft Data
                </button>
            </div>
            <div>
                <Link to="/leagueLeaders"></Link>
                <button onClick={goToLeaders}>
                        League Leaders
                </button>
            </div>
            <div>
                <Link to="/seasonLeaders"></Link>
                <button onClick={goToSeasonLeaders}>
                        Season Leaders
                </button>
            </div>
            <div>
                <h1>FPL DRAFT 2022/23</h1>
                <h2>{leagueData.name}</h2>
            </div>
            <div>
                <h3>The participants</h3>
                {teamData.map((team) => (
                    <div key={team.id}>{team.player_first_name} {team.player_last_name} - {team.entry_name}</div>
                ))}
            </div>
            <div>
                <h3>League Standings</h3>
                <div>Player ID - Wins - Draws - Losses - Pts For - Pts Against - Total Table Pts</div>
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