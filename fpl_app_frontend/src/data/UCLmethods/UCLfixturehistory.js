import React, { useState } from "react";

const UCLFixtureHistory = ({ teams, games }) => {

  const getTeamName = (teamId) => {
    let teamFilter = teams.filter((team) => team.owner_id === teamId);
    return teamFilter[0].team_name;
  };

  const highlightWins = (score1, score2, entry) => {
    if (entry === "1" && score1 > score2) {
      return "green-highlight";
    }
    else if (entry === "1" && score1 < score2) {
      return "red-highlight";
    }
    else if (entry === "2" && score2 > score1) {
      return "green-highlight";
    }
    else if (entry === "2" && score2 < score1) {
      return "red-highlight";
    }
    else { 
      return "";
    }
  };

  if (!(games)) {
    return (
      <main>
        <section>
          <h3>There is no fixture data to show.</h3>
        </section>
      </main>
    );
  }

  return (
    <main>
      <section>
        {games.length ?
          <table className="table-data">
            <thead>
              <tr>
                <th>Gameweek</th>
                <th>Team 1</th>
                <th>Points</th>
                <th>Points</th>
                <th>Team 2</th>
              </tr>
            </thead>
            <tbody>
              {games.sort((a,b) => (
                a.gameweek - b.gameweek
              )).map((game, i) => (
                <tr key={i}>
                  <td>{game.gameweek}</td>
                  <td>{getTeamName(game.league_entry_1)}</td>
                  <td className={highlightWins(game.league_entry_1_points, game.league_entry_2_points, "1")}>{game.league_entry_1_points}</td>
                  <td className={highlightWins(game.league_entry_1_points, game.league_entry_2_points, "2")}>{game.league_entry_2_points}</td>
                  <td>{getTeamName(game.league_entry_2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        : 
          <div>
              <h2>There is no fixture data to show.</h2>
          </div>
        }
      </section>
    </main>
  )
};

export default UCLFixtureHistory;
