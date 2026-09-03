import seasonStats from "./GWStats";

// Returns the aggregated per-team stats for a given gameweek. Previously this
// hit the backend `/api/stats` endpoint (backed by a database + cron job). Now
// there is no database: stats are computed client-side by GWStats and cached in
// localStorage under `gw_{gw}_stats`. During the initial data load every
// completed gameweek is precomputed, so this is normally a fast cache read.
// The `leagueId` argument is kept for call-site compatibility but is unused
// (the active league's data already lives in localStorage).
const getStatData = async (gw, leagueId) => {
  const cached = localStorage.getItem(`gw_${gw}_stats`);
  if (cached !== null) {
    return JSON.parse(cached);
  }

  // Fallback: compute + cache on demand (e.g. a gameweek that was not part of
  // the initial precompute). Returns [] if it could not be computed.
  await seasonStats(gw);
  const now = localStorage.getItem(`gw_${gw}_stats`);
  return now !== null ? JSON.parse(now) : [];
};

export default getStatData;
