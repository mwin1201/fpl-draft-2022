import apiClient from "../api/client";

// Computes the aggregated starting-11 stats for every team in the current
// league for a single gameweek, and caches the result in localStorage under
// `gw_{gw}_stats`. This is the client-side replacement for the old database
// `Stat` table (which used to be populated by a backend cron job).
//
// Shape of each stored entry (unchanged from the previous DB-backed shape, so
// all consumers keep working):
//   { entry_id, person, owner_id, minutes, goals_scored, assists,
//     clean_sheets, goals_conceded, yellow_cards, red_cards, bonus,
//     total_points }

const STAT_KEYS = [
  "minutes",
  "goals_scored",
  "assists",
  "clean_sheets",
  "goals_conceded",
  "yellow_cards",
  "red_cards",
  "bonus",
  "total_points",
];

// Small delay to avoid hammering the FPL API when looping over many teams/GWs.
const apiTimeout = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Live per-player stats for a gameweek (fetched once per GW, not per team).
const getStats = (gameweek) =>
  apiClient
    .get(`/fpl/getStats/` + gameweek)
    .then((apiResponse) => apiResponse.data.elements);

// A single team's picks (lineup) for a gameweek.
const getLineups = (team, gameweek) =>
  apiClient
    .get(`/fpl/getLineups/` + team + "/" + gameweek)
    .then((apiResponse) => apiResponse.data.picks);

// Sum the starting-11 stats for one team from the shared per-player stats map.
const sumStartingEleven = (picks, allPlayerStats) => {
  const totals = {};
  for (const key of STAT_KEYS) {
    let counter = 0;
    for (let i = 0; i < 11; i++) {
      const pick = picks[i];
      const playerStats = pick && allPlayerStats[pick.element];
      if (playerStats) {
        counter += playerStats.stats[key];
      }
    }
    totals[key] = counter;
  }
  return totals;
};

// Compute + cache stats for a single gameweek. Pass { force: true } to
// recompute even if a cached value already exists (used for the live gameweek).
const seasonStats = async (index, { force = false } = {}) => {
  const cacheKey = `gw_${index}_stats`;
  if (!force && localStorage.getItem(cacheKey) !== null) {
    return index;
  }

  const leagueTeams = JSON.parse(localStorage.getItem("league_entries")) || [];
  if (leagueTeams.length === 0) {
    return index;
  }

  // Fetch the gameweek's live player stats a single time and reuse it for
  // every team, then fetch each team's lineup.
  const allPlayerStats = await getStats(index);

  const gameweekStats = [];
  for (let i = 0; i < leagueTeams.length; i++) {
    const team = leagueTeams[i];
    const picks = await Promise.all([
      getLineups(team.entry_id, index),
      apiTimeout(100),
    ]).then((values) => values[0]);

    const totals =
      Array.isArray(picks) && picks.length > 0
        ? sumStartingEleven(picks, allPlayerStats)
        : STAT_KEYS.reduce((acc, key) => ({ ...acc, [key]: 0 }), {});

    gameweekStats.push({
      entry_id: team.entry_id,
      person: team.entry_name,
      owner_id: team.id,
      ...totals,
    });
  }

  localStorage.setItem(cacheKey, JSON.stringify(gameweekStats));
  return index;
};

// Compute + cache stats for every gameweek from 1..currentGw. Past (finished)
// gameweeks are only computed once and then served from cache; the current
// gameweek is always recomputed so live scores stay fresh.
export const computeStatsThroughGameweek = async (currentGw) => {
  if (!currentGw || currentGw < 1) return;
  for (let gw = 1; gw <= currentGw; gw++) {
    await seasonStats(gw, { force: gw === currentGw });
  }
};

export default seasonStats;
