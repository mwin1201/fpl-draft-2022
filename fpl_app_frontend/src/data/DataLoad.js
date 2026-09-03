import getLeagueData from "./LeagueData";
import getPlayers from "./Players";
import getDraftData from "./DraftData";
import getGameweek from "./CurrentGameweek";
import seasonStats, { computeStatsThroughGameweek } from "./GWStats";
import ManagerOfTheMonth from "./ManagerOTM";
import currentFixtures from "./currentFixtures";
import getDreamteam from "./DreamTeam";
import { hasChampionshipPlayoffs } from "../config/leagues";

// Records when the currently displayed data was last refreshed so the UI can
// show a "last updated" indicator.
const stampLastUpdated = () => {
  localStorage.setItem("last_updated", JSON.stringify(Date.now()));
};

const refreshManagerOfTheMonth = async (gw) => {
  localStorage.setItem(
    "manager_of_the_month",
    JSON.stringify(await ManagerOfTheMonth(gw))
  );
};

const computeChampionshipPlayoffTeams = (leagueID, gw) => {
  if (gw === 36 && hasChampionshipPlayoffs(leagueID)) {
    const standings = JSON.parse(localStorage.getItem("standings")) || [];
    const playoffTeams = standings.filter(
      (team) =>
        team.rank === 3 || team.rank === 4 || team.rank === 5 || team.rank === 6
    );
    localStorage.setItem(
      "championship_playoff_teams",
      JSON.stringify(playoffTeams)
    );
  }
};

// Full load for a freshly-selected league. Clears any cached data from a
// previously viewed league, fetches everything from the FPL API, precomputes
// per-gameweek stats for the whole season so far, and caches it in
// localStorage.
const DataLoad = async (leagueID) => {
  const [apiGW, gwComplete] = await getGameweek();

  // Clear data belonging to a previously-selected league so nothing leaks
  // across leagues.
  localStorage.removeItem("draft_data");
  localStorage.removeItem("player_ownership");
  localStorage.removeItem("element_types");
  localStorage.removeItem("elements");
  localStorage.removeItem("teams");
  localStorage.removeItem("league_data");
  localStorage.removeItem("standings");
  localStorage.removeItem("matches");
  localStorage.removeItem("league_entries");
  localStorage.removeItem("current_gameweek");
  localStorage.removeItem("transactions");
  localStorage.removeItem("current_fixtures");
  localStorage.removeItem("current_gameweek_complete");
  localStorage.removeItem("dreamteam");

  for (let i = 0; i < 39; i++) {
    localStorage.removeItem(`gw_${i}_stats`);
  }

  if (apiGW == null) {
    // Season has not started yet: store the gameweek state and stop.
    localStorage.setItem("current_gameweek", JSON.stringify(apiGW));
    localStorage.setItem("current_gameweek_complete", JSON.stringify(gwComplete));
    localStorage.setItem("current_league", leagueID);
    stampLastUpdated();
    return true;
  }

  if (apiGW < 36) {
    localStorage.removeItem("championship_playoff_teams");
  }

  localStorage.setItem("current_gameweek", JSON.stringify(apiGW));
  localStorage.setItem("current_gameweek_complete", JSON.stringify(gwComplete));
  localStorage.setItem("current_league", leagueID);

  // League data (standings/matches/entries), players, fixtures, dream team and
  // draft data can all load in parallel. league_entries (needed by the stats
  // computation below) is set by getLeagueData.
  await Promise.allSettled([
    getLeagueData(leagueID),
    getPlayers(),
    currentFixtures(apiGW + 1),
    getDreamteam(apiGW),
    getDraftData(leagueID),
  ]);

  // Precompute every completed gameweek's stats (client-side replacement for
  // the old DB stat cache). Runs after league_entries is available.
  await computeStatsThroughGameweek(apiGW);

  computeChampionshipPlayoffTeams(leagueID, apiGW);
  await refreshManagerOfTheMonth(apiGW);

  stampLastUpdated();
  return true;
};

// Lightweight refresh used while matches are in progress. Only the data that
// actually changes during live play is re-fetched, and it is overwritten in
// place (localStorage is NOT cleared first) so pages reading it don't briefly
// see missing data.
export const liveRefresh = async (leagueID) => {
  const [apiGW, gwComplete] = await getGameweek();
  if (apiGW == null) {
    stampLastUpdated();
    return true;
  }

  localStorage.setItem("current_gameweek", JSON.stringify(apiGW));
  localStorage.setItem("current_gameweek_complete", JSON.stringify(gwComplete));

  // Volatile data only: standings + match scores, dream team, and the current
  // gameweek's live stats.
  await getLeagueData(leagueID);
  await getDreamteam(apiGW);
  await seasonStats(apiGW, { force: true });
  await refreshManagerOfTheMonth(apiGW);

  stampLastUpdated();
  return true;
};

export default DataLoad;
