import { createContext, useContext, useState, useCallback, useMemo } from "react";
import { getLeagueConfig } from "../config/leagues";

const LeagueContext = createContext(null);

// Safely read + parse a JSON value from localStorage. Returns null on missing
// or malformed data instead of throwing.
const readJSON = (key) => {
  const raw = localStorage.getItem(key);
  if (raw === null) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

// Holds the currently-selected FPL Draft league. There are no user accounts:
// the visitor picks one of the hardcoded leagues on the welcome page. We mirror
// the selection into localStorage ("current_league") so the many pages/data
// modules that read it directly keep working, and restore it on reload.
export const LeagueProvider = ({ children }) => {
  const [currentLeagueId, setCurrentLeagueIdState] = useState(() => {
    const stored = readJSON("current_league");
    // Only trust a stored value that matches one of our configured leagues.
    return getLeagueConfig(stored) ? Number(stored) : null;
  });

  // Bumped every time a data load/refresh completes. Live views depend on it so
  // they re-read the freshly-updated localStorage as matches progress.
  const [dataVersion, setDataVersion] = useState(0);
  const bumpDataVersion = useCallback(() => setDataVersion((v) => v + 1), []);

  const setCurrentLeagueId = useCallback((leagueId) => {
    const id = Number(leagueId);
    localStorage.setItem("current_league", JSON.stringify(id));
    setCurrentLeagueIdState(id);
  }, []);

  const value = useMemo(
    () => ({
      currentLeagueId,
      hasLeagueSelected: currentLeagueId !== null,
      setCurrentLeagueId,
      dataVersion,
      bumpDataVersion,
    }),
    [currentLeagueId, setCurrentLeagueId, dataVersion, bumpDataVersion]
  );

  return (
    <LeagueContext.Provider value={value}>{children}</LeagueContext.Provider>
  );
};

export const useLeague = () => {
  const ctx = useContext(LeagueContext);
  if (ctx === null) {
    throw new Error("useLeague must be used within a LeagueProvider");
  }
  return ctx;
};

export default LeagueContext;
