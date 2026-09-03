import React from "react";
import { useNavigate } from "react-router-dom";
import { LEAGUES } from "../config/leagues";
import { useLeague } from "../context/LeagueContext";

// Public landing page. No login: visitors simply choose which of the hardcoded
// leagues they want to view, which sets the active league and sends them to the
// league overview.
const Welcome = () => {
  const navigate = useNavigate();
  const { setCurrentLeagueId } = useLeague();

  const handleSelectLeague = (leagueId) => {
    setCurrentLeagueId(leagueId);
    navigate("/overview");
  };

  return (
    <main className="welcome">
      <section className="welcome-hero">
        <h1>Chicago Dogs FPL League Mania</h1>
        <p>Pick your league to dive into the stats.</p>
      </section>

      <section className="welcome-league-buttons">
        {LEAGUES.map((league) => (
          <button
            key={league.id}
            type="button"
            className="league-button"
            onClick={() => handleSelectLeague(league.id)}
          >
            {league.name}
          </button>
        ))}
      </section>
    </main>
  );
};

export default Welcome;
