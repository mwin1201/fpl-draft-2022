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

const ChampionshipPlayoffs = () => {
  let playoffTeams = JSON.parse(
    localStorage.getItem("championship_playoff_teams")
  );

  for (var i = 0; i < playoffTeams.length; i++) {
    playoffTeams[i].avgScore = calculateAVGScore(
      playoffTeams[i].league_entry,
      5
    );
    playoffTeams[i].teamName = getTeamName(playoffTeams[i].league_entry);
    playoffTeams[i].results = getRecord(playoffTeams[i].league_entry, 5);
    playoffTeams[i].id = OwnerID(playoffTeams[i].league_entry);
    playoffTeams[i].topPlayers = topPlayers(playoffTeams[i].id, 3);
    playoffTeams[i].curScore = PlayoffScore(playoffTeams[i].league_entry);
  }

  console.log(topPlayers(70760,3));

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
        <h2>Championship Playoffs</h2>
        <div className="row row-cols-2">
          {firstMatchup.map((team) => (
            <div className="col" key={team.league_entry}>
              <h3>
                #{team.rank}: {team.teamName}
              </h3>
              <h5>Score: {team.curScore}</h5>
              <p>L5 GW Avg Score: {team.avgScore}</p>
              <p>L5 GW Results: {team.results}</p>
              <h4>Top 3 Players on Roster</h4>
              {team.topPlayers.map((player, i) => (
                <div key={player.element}>
                  <p>
                    #{i+1}: {PlayerPosition(player.element_type)}{" "}
                    {PlayerTeam(player.team)} {player.second_name}{" "}
                    FDR: {PlayerFDR(player.team)} {player.total_points}pts
                  </p>
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="row row-cols-2">
          {secondMatchup.map((team) => (
            <div className="col" key={team.league_entry}>
              <h3>
                #{team.rank}: {team.teamName}
              </h3>
              <h5>Score: {team.curScore}</h5>
              <p>L5 GW Avg Score: {team.avgScore}</p>
              <p>L5 GW Results: {team.results}</p>
              <h4>Top 3 Players on Roster</h4>
              {team.topPlayers.map((player, i) => (
                <div key={player.element}>
                  <p>
                    #{i+1}: {PlayerPosition(player.element_type)}{" "}
                    {PlayerTeam(player.team)} {player.second_name}{" "}
                    FDR: {PlayerFDR(player.team)} {player.total_points}pts
                  </p>
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
