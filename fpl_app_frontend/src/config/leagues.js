// Hardcoded FPL Draft leagues this static site serves. There is no database and
// no user accounts: every visitor picks one of these leagues on the welcome
// page and all data is fetched live from the FPL API for the chosen league.
//
// IMPORTANT: replace the `id` values below with your three real FPL Draft
// league IDs (the number in the draft.premierleague.com league URL). The names
// are shown on the welcome-page buttons and in the header switcher.
//
// Per-league display flags (previously hardcoded against specific league IDs):
//   relegation           -> use the promotion/relegation color coding in Standings
//   championshipPlayoffs  -> compute + show the end-of-season championship playoff bracket
export const LEAGUES = [
  { id: 9574, name: "Premiership", relegation: true, championshipPlayoffs: false, championsLeague: true },
  { id: 6231, name: "Championship", relegation: true, championshipPlayoffs: true, championsLeague: false },
  { id: 25709, name: "League One", relegation: false, championshipPlayoffs: true, championsLeague: false },
];

export const DEFAULT_LEAGUE_ID = LEAGUES[0].id;

// Look up the config object for a league id. Accepts number or numeric string.
export const getLeagueConfig = (leagueId) => {
  const id = Number(leagueId);
  return LEAGUES.find((league) => league.id === id) || null;
};

// Convenience helpers for the per-league feature flags.
export const hasRelegation = (leagueId) => Boolean(getLeagueConfig(leagueId)?.relegation);
export const hasChampionshipPlayoffs = (leagueId) =>
  Boolean(getLeagueConfig(leagueId)?.championshipPlayoffs);
export const hasChampionsLeague = (leagueId) => Boolean(getLeagueConfig(leagueId)?.championsLeague);

export default LEAGUES;
