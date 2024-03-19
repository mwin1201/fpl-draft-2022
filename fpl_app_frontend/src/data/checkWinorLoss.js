// Purpose of this file is to determine the outcome between 2 league
// teams competing against one another

const checkOutcome = (matchup, teamEntry, playoffStage) => {
    let team1Score,team2Score;

    if (playoffStage === "semifinals") {
        team1Score = matchup.filter((team) => team.league_entry === teamEntry)[0].curScore;
        team2Score = matchup.filter((team) => team.league_entry !== teamEntry)[0].curScore;
        const matchesPlayed = matchup.filter((team) => team.league_entry === teamEntry)[0].scores.length;

        // 2 matches and team 1 wins
        if (matchesPlayed === 2 && team1Score > team2Score) {
            return <span className="win">W</span>
        }
        // 2 matches and team 1 loses
        else if (matchesPlayed === 2 && team1Score < team2Score) {
            return <span className="loss">L</span>
        }
        else if (matchesPlayed === 1 && team1Score > team2Score) {
            return <span className="win">+{team1Score - team2Score}</span>
        }
        else if (matchesPlayed === 1 && team1Score < team2Score) {
            return <span className="loss">{team1Score - team2Score}</span>
        }
    } else {
        team1Score = matchup.filter((team) => team.league_entry === teamEntry)[0].finalScore;
        team2Score = matchup.filter((team) => team.league_entry !== teamEntry)[0].finalScore;

        if (team1Score > team2Score) {
            return (
                <p><span className="win">W</span>Playoff Winner!!</p>
                
            );
        }
        // 2 matches and team 1 loses
        else {
            return <span className="loss">L</span>
        }
    }
};

export default checkOutcome;

