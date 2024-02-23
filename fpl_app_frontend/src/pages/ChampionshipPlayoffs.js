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
import checkOutcome from "../data/checkWinorLoss";

const ChampionshipPlayoffs = () => {
  const gameweek = JSON.parse(localStorage.getItem("current_gameweek"));
  const gameweekStatus = JSON.parse(localStorage.getItem("current_gameweek_complete"));

  const semiFinalCheck = () => {
    let semiFinalWinners = [];
    // check first matchup results
    let matchup1team1 = firstMatchup[0].curScore;
    let matchup1team2 = firstMatchup[1].curScore;

    if (matchup1team1 > matchup1team2) {
      firstMatchup[0].finalScore = 0;
      semiFinalWinners.push(firstMatchup[0]);
    } else {
      firstMatchup[1].finalScore = 0;
      semiFinalWinners.push(firstMatchup[1]);
    }

    // check second matchup results
    let matchup2team1 = secondMatchup[0].curScore;
    let matchup2team2 = secondMatchup[1].curScore;

    if (matchup2team1 > matchup2team2) {
      secondMatchup[0].finalScore = 0;
      semiFinalWinners.push(secondMatchup[0]);
    } else {
      secondMatchup[1].finalScore = 0;
      semiFinalWinners.push(secondMatchup[1]);
    }

    return semiFinalWinners;
  };

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
    if (scoreArray.length === 1) {
      playoffTeams[i].curScore = scoreArray[0].score;
    } else {
      playoffTeams[i].curScore = scoreArray[0].score + scoreArray[1].score;
    }
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


  const playoffWinnerCheck = () => {
    let finalists = semiFinalCheck();

    for (var i = 0; i < finalists.length; i++) {
      let finalScoreArray = PlayoffScore(finalists[i].league_entry);
      finalists[i]["finalScore"] = finalScoreArray[0].score;
    }

    return finalists;

  };

  // want to create a function that will be checked after week 38 to declare
  // a Championship playoff winner

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
        <h2>Semi Finals</h2>
          <div className="team-container">
          {firstMatchup.map((team) => (
            <div key={team.league_entry}>
              {team.teamName}
              {team.scores.map((game) => (
                <div key={game.gw}>
                  GW: {game.gw} - {game.score}pts
                </div>
              ))}
              <h3>Total: {team.curScore}</h3>
              <p>{checkOutcome(firstMatchup,team.league_entry,"semifinals")}</p>
            </div>
          ))}
          </div>
          <div className="team-container">
          {secondMatchup.map((team) => (
            <div key={team.league_entry}>
              {team.teamName}
              {team.scores.map((game) => (
                <div key={game.gw}>
                  GW: {game.gw} - {game.score}pts
                </div>
              ))}
              <h3>Total: {team.curScore}</h3>
              <p>{checkOutcome(secondMatchup,team.league_entry,"semifinals")}</p>
            </div>
          ))}
        </div>
        <h2>Finals</h2>
        {(gameweek >= 37 && gameweekStatus)
        ?
        <div>
          {(gameweek === 38 && gameweekStatus)
          ?
          <div className="team-container">
          {playoffWinnerCheck().map((team) => (
            <div key={team.league_entry}>
              {team.teamName}
              <h3>Total: {team.finalScore}</h3>
              <p>{checkOutcome(playoffWinnerCheck(),team.league_entry,"finals")}</p>
            </div>
          ))}
          </div>
          :
          <div className="team-container">
            {playoffWinnerCheck().map((team) => (
              <div key={team.league_entry}>
                {team.teamName}
                <h3>Total: {team.finalScore}</h3>
                <p>Match still in progress!</p>
              </div>
            ))}
          </div>
          }
        </div>  
        :
        <div>
          <p>Coming week 38</p>
        </div>
        }
      </div>
    </section>
  );
};

export default ChampionshipPlayoffs;
