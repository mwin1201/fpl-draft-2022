import React, { useEffect, useState, Suspense } from "react";
import Standings from "../components/Standings";
import { Link } from "react-router-dom";
import Playoffs from "../components/ChampionshipPlayoffs/index.js";
import DreamTeam from "../components/DreamTeam/index.js";
import LeagueForm from "../components/HotorNot/index.js";
import Loading from "../components/Loading";
import { useLeague } from "../context/LeagueContext";

const Homepage = () => {
  const { currentLeagueId, dataVersion } = useLeague();
  const [teamData, setTeamData] = useState([]);
  const [leagueData, setLeagueData] = useState([]);
  const [standings, setStandings] = useState([]);
  const [leagueEntries, setLeagueEntries] = useState([]);
  const [MOTM, setMOTM] = useState([]);
  const [currentGameweek, setCurrentGameweek] = useState();
  const [currentGWStatus, setCurrentGWStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Re-read whenever a data load/refresh completes (dataVersion bumps) so live
  // scores and standings stay current as matches progress.
  useEffect(() => {
    setIsLoading(true);
    const entries = JSON.parse(localStorage.getItem("league_entries")) || [];
    setLeagueEntries(entries);
    setTeamData(entries);
    setLeagueData(JSON.parse(localStorage.getItem("league_data")) || {});
    setStandings(JSON.parse(localStorage.getItem("standings")) || []);
    setMOTM(JSON.parse(localStorage.getItem("manager_of_the_month")) || []);
    setCurrentGameweek(JSON.parse(localStorage.getItem("current_gameweek")));
    setCurrentGWStatus(
      JSON.parse(localStorage.getItem("current_gameweek_complete")) === false
        ? "Incomplete"
        : "Complete"
    );
    setIsLoading(false);
  }, [dataVersion]);

  const getEntryName = (owner_id) => {
    const oneTeam = teamData.filter((team) => team.id === owner_id);
    return oneTeam.length > 0 ? oneTeam[0].entry_name : "Unknown";
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <main>
      <section>
        <u>
          <h1>{leagueData.name}</h1>
        </u>
      </section>

      <section>
        <h3>The Participants</h3>
        <div className="participants">
          {leagueEntries.map((team) => (
            <div key={team.id}>
              <Link to={`/profile/${team.id}`}>
                <div>{team.entry_name}</div>
              </Link>
              <div className="participant-owner">
                {team.player_first_name} {team.player_last_name}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h3>
          Current Gameweek: {currentGameweek} - Status: {currentGWStatus}
        </h3>
      </section>

      <Standings standings={standings} teams={leagueEntries} />

      <DreamTeam />

      <Playoffs league_id={currentLeagueId} />

      <Suspense fallback={<div className="loading-screen"><span>Loading...</span></div>}>
        <LeagueForm league_id={currentLeagueId} currentGameweek={currentGameweek} />
      </Suspense>

      <br></br>
      <section id="google-slides">
        <iframe
          src="https://docs.google.com/presentation/d/e/2PACX-1vRuCPWsexhKg0LYndxebXzoC0KnQU_blmIdviXz0xjPm8hzlUySTHYEXFSOywMDgbJqaBPqt74cG35H/embed?start=true&loop=true&delayms=5000"
          title="Chicago Dogs terms and conditions"
          frameBorder="0"
          width="960"
          height="569"
          allowFullScreen="true"
          mozallowfullscreen="true"
          webkitallowfullscreen="true"
        ></iframe>
      </section>
      <br></br>
      <section>
        <h2>
          Manager of the Month
          {MOTM.length > 0 ? (
            MOTM.map((manager) => (
              <div key={manager.team}>
                <h3>
                  {getEntryName(manager.team)} with {manager.points}pts over
                  last 4 GWs!
                </h3>
              </div>
            ))
          ) : (
            <div>
              <h3>There is no manager of the month at this time</h3>
            </div>
          )}
        </h2>
      </section>
    </main>
  );
};

export default Homepage;
