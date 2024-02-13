import React, { useEffect, useState } from "react";
import Spinner from "react-bootstrap/Spinner";
import Playoffs from "../components/ChampionshipPlayoffs";
import TeamStats from "../components/TeamStats";
import calculateAVGScore from "../data/AvgGWScore";
import getTeamName from "../data/TeamName";
import getRecord from "../data/MatchResults";
import OwnerID from "../data/OwnerID";
import topPlayers from "../data/TopRosterPlayers";
import PlayerPosition from "../data/PlayerPosition";
import PlayerFDR from "../data/PlayerFDR";
import PlayerTeam from "../data/PlayerTeam";
import PlayoffScore from "../data/PlayoffScore";
import { Link } from "react-router-dom";

const ChampionshipPlayoffs = () => {
  let playoffTeams = JSON.parse(
    localStorage.getItem("championship_playoff_teams")
  );

  let leagueEntries = JSON.parse(localStorage.getItem("league_entries"));

  for (var i = 0; i < playoffTeams.length; i++) {
    let curTeam = playoffTeams[i];
    let singleEntry = leagueEntries.filter((entry) => entry.id === curTeam.league_entry);

    playoffTeams[i].avatar = singleEntry[0].avatar;
    playoffTeams[i].avgScore = calculateAVGScore(
      playoffTeams[i].league_entry,
      5
    );
    playoffTeams[i].teamName = getTeamName(playoffTeams[i].league_entry);
    playoffTeams[i].results = getRecord(playoffTeams[i].league_entry, 5);
    playoffTeams[i].id = OwnerID(playoffTeams[i].league_entry);
    playoffTeams[i].topPlayers = topPlayers(playoffTeams[i].id, 3);
    let scoreArray = PlayoffScore(playoffTeams[i].league_entry);
    playoffTeams[i].curScore = scoreArray[0].score + scoreArray[1].score;
    playoffTeams[i] = {...playoffTeams[i], scores: scoreArray};
  }

  // 3 vs 6
  let firstMatchup = playoffTeams.filter(
    (team) => team.rank === 3 || team.rank === 6
  );

  // 4 vs 5
  let secondMatchup = playoffTeams.filter(
    (team) => team.rank === 4 || team.rank === 5
  );

  return (
    <section>
      <div className="container">
      <h1>Championship Playoffs</h1>
        <div className="team-container">
          {firstMatchup.map((team) => (
            <div className="stat-container" key={team.league_entry}>
              <h3>
                #{team.rank}: {team.teamName}
              </h3>
              <Link to={`/profile/${team.league_entry}`}><img className="avatar" src={team.avatar} alt="Owner Avatar"></img></Link>
              <h5>Score: {team.curScore}</h5>
              <p>L5 Avg Score: {team.avgScore}</p>
              <p>L5 Results: {team.results}</p>
              <h4>Top Players</h4>
              {team.topPlayers.map((player, i) => (
                <div key={player.element}>
                  <p>
                    #{i + 1}: [FDR: {PlayerFDR(player.team)}]{" "}
                    {player.second_name} - {player.total_points}pts
                  </p>
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="team-container">
          {secondMatchup.map((team) => (
            <div className="stat-container" key={team.league_entry}>
              <h3>
                #{team.rank}: {team.teamName}
              </h3>
              <Link to={`/profile/${team.league_entry}`}><img className="avatar" src={team.avatar} alt="Owner Avatar"></img></Link>
              <h5>Score: {team.curScore}</h5>
              <p>L5 Avg Score: {team.avgScore}</p>
              <p>L5 Results: {team.results}</p>
              <h4>Top Players</h4>
              {team.topPlayers.map((player, i) => (
                <div key={player.element}>
                  <p>
                    #{i + 1}: [FDR: {PlayerFDR(player.team)}]{" "}
                    {player.second_name} - {player.total_points}pts
                  </p>
                </div>
              ))}
            </div>
          ))}
        </div>
          <div className="team-container">
          <h2>Gameweek Scores</h2>
          {firstMatchup.map((team) => (
            <div key={team.league_entry}>
              {team.teamName}
              {team.scores.map((game) => (
                <div key={game.gw}>
                  GW: {game.gw} - {game.score}pts
                </div>
              ))}
            </div>
          ))}
          {secondMatchup.map((team) => (
            <div key={team.league_entry}>
              {team.teamName}
              {team.scores.map((game) => (
                <div key={game.gw}>
                  GW: {game.gw} - {game.score}pts
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ChampionshipPlayoffs;
