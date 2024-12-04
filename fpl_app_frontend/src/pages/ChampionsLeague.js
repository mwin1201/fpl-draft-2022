import React, { useEffect, useState } from "react";
import getUCLTeams from "../data/UCLmethods/UCLteams";
import getUCLGames from "../data/UCLmethods/UCLgames";
import getUCLTeamStats from "../data/UCLmethods/UCLstats";
import UCLFixtureHistory from "../data/UCLmethods/UCLfixturehistory";
import classNames from 'classnames'

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
  const [gameCount, setGameCount] = useState();

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

    const createCounterObject = (fixtures, teams) => {
      let counterObject = {};
      teams.forEach((team) => {
        let other_teams = teams.filter((t) => t !== team);
        counterObject[team.owner_id] = [
          {
            opponent: other_teams[0].team_name,
            played: countTimesPlayed(team.owner_id, other_teams[0].owner_id, fixtures),
            opponent_id: other_teams[0].owner_id
          },
          {
            opponent: other_teams[1].team_name,
            played: countTimesPlayed(team.owner_id, other_teams[1].owner_id, fixtures),
            opponent_id: other_teams[1].owner_id
          },
          {
            opponent: other_teams[2].team_name,
            played: countTimesPlayed(team.owner_id, other_teams[2].owner_id, fixtures),
            opponent_id: other_teams[2].owner_id
          }
        ]
      })
      return counterObject;
    };

    const countTimesPlayed = (team1, team2, ucl_fixtures) => {
      return ucl_fixtures.filter((matchup) => (matchup.league_entry_1 === team1 && matchup.league_entry_2 === team2) || (matchup.league_entry_1 === team2 && matchup.league_entry_2 === team1)).length
    }; 

    const start = async () => {
      const UCLteams = await getUCLTeams();
      const UCLgames = await getUCLGames();
      setUCLTeams(UCLteams);
      setUCLGames(UCLgames);
      setGameCount(createCounterObject(UCLgames, UCLteams));
      createTeamObjects(UCLteams, UCLgames);
      setIsLoading(false);
    };

    start();
  }, []);

  const returnPlayedGames = (team1, team2) => {
    let team1Array = gameCount[`${team1}`];
    return team1Array.filter((opponent) => opponent.opponent_id === team2)[0].played;
  }

  const greenHighlight = (val) => {
    return val === 4 ? true : false;
  }

  if (isLoading || !UCLteams.length || !UCLgames.length) {
    return (
      <div>
        <h1>Champions League Standings</h1>
        <h2>Loading...</h2>
      </div>
    );
  }

  return (
    <main>
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
      <section>
        <h2>Matches Played Count</h2>
        <div className="container text-center border">
          <div className="row border">
            <div className="col">
            </div>
            <div className="col">
              {UCLteams[0].team_name}
            </div>
            <div className="col">
              {UCLteams[1].team_name}
            </div>
            <div className="col">
              {UCLteams[2].team_name}
            </div>
            <div className="col">
              {UCLteams[3].team_name}
            </div>
          </div>
          <div className="row border-bottom">
            <div className="col">
              {UCLteams[0].team_name}
            </div>
            <div className="col red-highlight">
              X
            </div>
            <div className={classNames({"col": true, "green-highlight": greenHighlight(returnPlayedGames(UCLteams[0].owner_id, UCLteams[1].owner_id))})}>
              {returnPlayedGames(UCLteams[0].owner_id, UCLteams[1].owner_id)}
            </div>
            <div className={classNames({"col": true, "green-highlight": greenHighlight(returnPlayedGames(UCLteams[0].owner_id, UCLteams[2].owner_id))})}>
            {returnPlayedGames(UCLteams[0].owner_id, UCLteams[2].owner_id)}
            </div>
            <div className={classNames({"col": true, "green-highlight": greenHighlight(returnPlayedGames(UCLteams[0].owner_id, UCLteams[3].owner_id))})}>
            {returnPlayedGames(UCLteams[0].owner_id, UCLteams[3].owner_id)}
            </div>
          </div>
          <div className="row border-bottom">
            <div className="col">
              {UCLteams[1].team_name}
            </div>
            <div className={classNames({"col": true, "green-highlight": greenHighlight(returnPlayedGames(UCLteams[1].owner_id, UCLteams[0].owner_id))})}>
            {returnPlayedGames(UCLteams[1].owner_id, UCLteams[0].owner_id)}
            </div>
            <div className="col red-highlight">
              X
            </div>
            <div className={classNames({"col": true, "green-highlight": greenHighlight(returnPlayedGames(UCLteams[1].owner_id, UCLteams[2].owner_id))})}>
            {returnPlayedGames(UCLteams[1].owner_id, UCLteams[2].owner_id)}
            </div>
            <div className={classNames({"col": true, "green-highlight": greenHighlight(returnPlayedGames(UCLteams[1].owner_id, UCLteams[3].owner_id))})}>
            {returnPlayedGames(UCLteams[1].owner_id, UCLteams[3].owner_id)}
            </div>
          </div>
          <div className="row border-bottom">
            <div className="col">
              {UCLteams[2].team_name}
            </div>
            <div className={classNames({"col": true, "green-highlight": greenHighlight(returnPlayedGames(UCLteams[2].owner_id, UCLteams[0].owner_id))})}>
            {returnPlayedGames(UCLteams[2].owner_id, UCLteams[0].owner_id)}
            </div>
            <div className={classNames({"col": true, "green-highlight": greenHighlight(returnPlayedGames(UCLteams[2].owner_id, UCLteams[1].owner_id))})}>
            {returnPlayedGames(UCLteams[2].owner_id, UCLteams[1].owner_id)}
            </div>
            <div className="col red-highlight">
              X
            </div>
            <div className={classNames({"col": true, "green-highlight": greenHighlight(returnPlayedGames(UCLteams[2].owner_id, UCLteams[3].owner_id))})}>
            {returnPlayedGames(UCLteams[2].owner_id, UCLteams[3].owner_id)}
            </div>
          </div>
          <div className="row border-bottom">
            <div className="col">
              {UCLteams[3].team_name}
            </div>
            <div className={classNames({"col": true, "green-highlight": greenHighlight(returnPlayedGames(UCLteams[3].owner_id, UCLteams[0].owner_id))})}>
            {returnPlayedGames(UCLteams[3].owner_id, UCLteams[0].owner_id)}
            </div>
            <div className={classNames({"col": true, "green-highlight": greenHighlight(returnPlayedGames(UCLteams[3].owner_id, UCLteams[1].owner_id))})}>
            {returnPlayedGames(UCLteams[3].owner_id, UCLteams[1].owner_id)}
            </div>
            <div className={classNames({"col": true, "green-highlight": greenHighlight(returnPlayedGames(UCLteams[3].owner_id, UCLteams[2].owner_id))})}>
            {returnPlayedGames(UCLteams[3].owner_id, UCLteams[2].owner_id)}
            </div>
            <div className="col red-highlight">
              X
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ChampionsLeague;
