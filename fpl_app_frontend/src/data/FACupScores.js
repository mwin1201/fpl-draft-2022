import { ROUNDS, TEAMS, MATCHUPS, TIE_OVERRIDES, SEEDING_ROUND } from "../config/faCup";
import {
  getStats,
  getLineups,
  sumStartingEleven,
  apiTimeout,
} from "./GWStats";

// Finished rounds are cached per gameweek as { [entryId]: { score, goals, cards } }.
// Uses its own key prefix because DataLoad clears `gw_*_stats` on league change.
const cacheKey = (gw) => `fa_cup_gw_${gw}`;

const readCache = (gw) => {
  try {
    return JSON.parse(localStorage.getItem(cacheKey(gw))) || {};
  } catch {
    return {};
  }
};

// Red cards count double in the card tiebreaker.
const toCupTotals = (totals) => ({
  score: totals.total_points,
  goals: totals.goals_scored,
  cards: totals.yellow_cards + 2 * totals.red_cards,
});

const EMPTY_TOTALS = { score: 0, goals: 0, cards: 0 };

const scoreTeams = async (gw, entryIds, isFinal) => {
  const cached = isFinal ? readCache(gw) : {};
  const missing = entryIds.filter((id) => !cached[id]);
  if (missing.length === 0) return cached;

  const allPlayerStats = await getStats(gw);
  const results = { ...cached };
  for (const entryId of missing) {
    const picks = await Promise.all([
      getLineups(entryId, gw),
      apiTimeout(100),
    ]).then((values) => values[0]);

    results[entryId] =
      Array.isArray(picks) && picks.length > 0
        ? toCupTotals(sumStartingEleven(picks, allPlayerStats))
        : EMPTY_TOTALS;
  }

  if (isFinal) {
    localStorage.setItem(cacheKey(gw), JSON.stringify(results));
  }
  return results;
};

// Tiebreak order: points, then goals scored by the starting 11, then fewest
// cards, then a manual TIE_OVERRIDES entry.
export const decideWinner = (home, away, matchupId) => {
  if (!home.entryId || !away.entryId) return { winner: null, decidedBy: null };

  const checks = [
    ["points", home.score - away.score],
    ["goals", home.goals - away.goals],
    ["cards", away.cards - home.cards],
  ];
  for (const [decidedBy, diff] of checks) {
    if (diff !== 0) {
      return { winner: diff > 0 ? home.entryId : away.entryId, decidedBy };
    }
  }

  const override = TIE_OVERRIDES[matchupId];
  if (override === home.entryId || override === away.entryId) {
    return { winner: override, decidedBy: "override" };
  }
  return { winner: null, decidedBy: null };
};

const matchupLabel = (id) => id.toUpperCase();

const placeholderName = (slot) => {
  if (slot.winnerOf) return `Winner of ${matchupLabel(slot.winnerOf)}`;
  if (slot.seed) return `Seed ${slot.seed}`;
  return "TBD";
};

const resolveSlot = (slot, winners, seeds) => {
  const entryId =
    slot.entryId ??
    (slot.winnerOf ? winners[slot.winnerOf] : null) ??
    (slot.seed ? seeds[slot.seed - 1] : null) ??
    null;
  const team = entryId ? TEAMS[entryId] : null;
  return {
    entryId,
    name: team ? team.name : placeholderName(slot),
    manager: team?.manager ?? null,
    league: team?.league ?? null,
    seed: entryId ? seeds.indexOf(entryId) + 1 || null : null,
  };
};

// Ranks a finished round's winners by their score in that round: points, then
// goals, then fewest cards. Remaining ties keep bracket order. Returns [] until
// every matchup in the round has a winner.
const seedWinners = (matchups) => {
  if (matchups.some((m) => !m.winner)) return [];
  return matchups
    .map((m) => (m.winner === m.home.entryId ? m.home : m.away))
    .sort((a, b) => b.score - a.score || b.goals - a.goals || a.cards - b.cards)
    .map((team) => team.entryId);
};

const roundStatus = (gw, currentGw, gwFinished) => {
  if (currentGw == null || gw > currentGw) return "upcoming";
  if (gw === currentGw && !gwFinished) return "live";
  return "final";
};

// Walks the bracket in round order, scoring every round that has started and
// feeding each finished matchup's winner into the next round.
export const getFACupResults = async (currentGw, gwFinished) => {
  const winners = {};
  let seeds = [];
  const rounds = [];

  for (const round of ROUNDS) {
    const status = roundStatus(round.gameweek, currentGw, gwFinished);
    const matchups = MATCHUPS.filter((m) => m.round === round.key).map((m) => ({
      id: m.id,
      label: matchupLabel(m.id),
      home: resolveSlot(m.home, winners, seeds),
      away: resolveSlot(m.away, winners, seeds),
      winner: null,
      decidedBy: null,
    }));

    if (status !== "upcoming") {
      const entryIds = matchups
        .flatMap((m) => [m.home.entryId, m.away.entryId])
        .filter(Boolean);
      const totals = await scoreTeams(round.gameweek, entryIds, status === "final");

      for (const m of matchups) {
        for (const side of [m.home, m.away]) {
          if (side.entryId) Object.assign(side, totals[side.entryId] || EMPTY_TOTALS);
        }
        if (status === "final") {
          Object.assign(m, decideWinner(m.home, m.away, m.id));
          if (m.winner) winners[m.id] = m.winner;
        }
      }
    }

    if (round.key === SEEDING_ROUND && status === "final") {
      seeds = seedWinners(matchups);
    }

    rounds.push({ ...round, status, matchups });
  }

  const finalMatchup = rounds[rounds.length - 1].matchups[0];
  const championId = finalMatchup?.winner;
  const champion = championId ? { entryId: championId, ...TEAMS[championId] } : null;

  return {
    rounds,
    champion,
    isLive: rounds.some((r) => r.status === "live"),
  };
};

export default getFACupResults;
