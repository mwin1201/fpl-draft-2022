import React from "react";
import { useQuery } from "@tanstack/react-query";
import getGameweek from "../data/CurrentGameweek";
import getFACupResults from "../data/FACupScores";
import Loading from "../components/Loading";
import ErrorState from "../components/ErrorState";

const STATUS_LABELS = {
  upcoming: "Upcoming",
  live: "Live",
  final: "Final",
};

const tiebreakNote = (matchup) => {
  const { home, away, winner, decidedBy } = matchup;
  const [w, l] = winner === home.entryId ? [home, away] : [away, home];
  if (decidedBy === "goals") return `Won on goals (${w.goals}-${l.goals})`;
  if (decidedBy === "cards") return `Won on fewer cards (${w.cards}-${l.cards})`;
  if (decidedBy === "override") return "Tie decided by the commissioner";
  return null;
};

const TeamRow = ({ team, gameweek, showScore, isWinner, isLoser, showTiebreak }) => (
  <div className={`fa-cup-team${isWinner ? " fa-cup-winner" : ""}${isLoser ? " fa-cup-loser" : ""}`}>
    <div className="fa-cup-team-info">
      {team.seed && <span className="fa-cup-seed">Seed {team.seed}</span>}
      {team.entryId ? (
        <a
          href={`https://draft.premierleague.com/entry/${team.entryId}/event/${gameweek}`}
          rel="noreferrer"
          target="_blank"
          className="fpl-link"
        >
          {team.name}
        </a>
      ) : (
        <span className="fa-cup-tbd">{team.name}</span>
      )}
      {team.league && <span className="fa-cup-league">{team.league}</span>}
      {showTiebreak && (
        <span className="fa-cup-tiebreak-stats">
          {team.goals} goals, {team.cards} cards
        </span>
      )}
    </div>
    <div className="fa-cup-score">{showScore && team.entryId ? team.score : "-"}</div>
  </div>
);

const MatchupCard = ({ matchup, gameweek, status }) => {
  const { home, away, winner, decidedBy } = matchup;
  const showScore = status !== "upcoming";
  const isTie =
    showScore && home.entryId && away.entryId && home.score === away.score;
  const pendingTie = status === "final" && home.entryId && away.entryId && !winner;

  return (
    <div className="fa-cup-matchup">
      <div className="fa-cup-matchup-header">
        <span>{matchup.label}</span>
        <span className={`fa-cup-status fa-cup-status-${status}`}>
          {pendingTie ? "Tie - awaiting decision" : STATUS_LABELS[status]}
        </span>
      </div>
      {[home, away].map((team, i) => (
        <TeamRow
          key={team.entryId ?? `${matchup.id}-${i}`}
          team={team}
          gameweek={gameweek}
          showScore={showScore}
          isWinner={winner != null && winner === team.entryId}
          isLoser={winner != null && winner !== team.entryId}
          showTiebreak={isTie}
        />
      ))}
      {decidedBy && decidedBy !== "points" && (
        <p className="fa-cup-note">{tiebreakNote(matchup)}</p>
      )}
    </div>
  );
};

const FACup = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["faCup"],
    queryFn: async () => {
      const [currentGw, gwFinished] = await getGameweek();
      return getFACupResults(currentGw, gwFinished);
    },
    refetchInterval: (query) => (query.state.data?.isLive ? 60000 : false),
    refetchIntervalInBackground: false,
  });

  if (isLoading) return <Loading message="Loading FA Cup scores..." />;
  if (isError) return <ErrorState />;

  return (
    <main className="fa-cup">
      <h1>FA Cup</h1>
      <p className="fa-cup-subtitle">
        Premiership vs Championship vs League One. Round 2 winners are seeded
        by their GW {data.rounds.find((r) => r.key === "r2")?.gameweek} score:
        seeds 1-6 go straight to the quarterfinals and seeds 7-10 meet in the
        play-in. Ties are decided by goals scored by the starting 11, then
        fewest cards (a red counts as two).
      </p>

      {data.champion && (
        <div className="fa-cup-champion">
          <h2>Champion: {data.champion.name}</h2>
          <p>
            {data.champion.manager} ({data.champion.league})
          </p>
        </div>
      )}

      {data.rounds.map((round) => (
        <section className="fa-cup-round" key={round.key}>
          <h2>
            {round.name} - GW {round.gameweek}
          </h2>
          <div className="fa-cup-matchups">
            {round.matchups.map((matchup) => (
              <MatchupCard
                key={matchup.id}
                matchup={matchup}
                gameweek={round.gameweek}
                status={round.status}
              />
            ))}
          </div>
        </section>
      ))}
    </main>
  );
};

export default FACup;
