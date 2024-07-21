import React, { useEffect, useState, Suspense } from "react";
import getUCLTeams from "../data/UCLmethods/UCLteams";
import getUCLGames from "../data/UCLmethods/UCLgames";
import getUCLTeamStats from "../data/UCLmethods/UCLstats";
import UCLFixtureHistory from "../data/UCLmethods/UCLfixturehistory";

const ChampionsLeague = () => {
  // need to show a standings table for the league
  // Things needed for standing table:
  // 1. Check teams are both in UCL
  // 2. Compare points for W/D/L
  // 3. Collect Points For and Against
  // 4. Calculate league point total
  // 5. Sort by total points

  const [UCLstandings, setUCLStandings] = useState([]);
  const [UCLgames, setUCLGames] = useState([]);
  const [UCLteams, setUCLTeams] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);

    const createTeamObjects = (teams, games) => {
      let teamObj = {};
      let standings = [];
      for (var i = 0; i < teams.length; i++) {
        teamObj = getUCLTeamStats(teams[i].owner_id, games);
        teamObj.team_name = teams[i].team_name;
        standings.push(teamObj);
      }
      standings.sort((a, b) => {
        if (a.leaguePoints === b.leaguePoints) {
          return b.pointsDiff - a.pointsDiff;
        }
        return b.leaguePoints - a.leaguePoints;
      });
      setUCLStandings(standings);
    };

    const start = async () => {
      const UCLteams = await getUCLTeams();
      const UCLgames = await getUCLGames();
      setUCLTeams(UCLteams);
      setUCLGames(UCLgames);
      createTeamObjects(UCLteams, UCLgames);
      setIsLoading(false);
    };

    start();
  }, []);

  if (isLoading) {
    return (
      <div>
        <h1>Champions League Standings</h1>
        <h2>Loading...</h2>
      </div>
    );
  }

  return (
    <div>
      <h1>Champions League Standings</h1>

      <section>
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
            {UCLstandings.map((team) => (
                <tr key={team.team_name}>
                  <td>{team.team_name}</td>
                  <td>{team.wins}</td>
                  <td>{team.draws}</td>
                  <td>{team.losses}</td>
                  <td>{team.pointsFor}</td>
                  <td>{team.pointsAgainst}</td>
                  <td>{team.pointsDiff}</td>
                  <td>{team.leaguePoints}</td>
                </tr>
            ))}
            </tbody>
        </table>
      </section>
      <section>
        <h2>Champions League Past Fixtures</h2>
        <UCLFixtureHistory teams={UCLteams} games={UCLgames} />
      </section>
    </div>
  );
};

export default ChampionsLeague;
