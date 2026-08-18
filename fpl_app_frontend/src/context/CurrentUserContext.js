import { createContext, useContext, useState, useCallback, useMemo } from "react";

const CurrentUserContext = createContext(null);

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

// Holds the logged-in user and the currently-selected league. During the
// migration this still mirrors its state into localStorage so the (not yet
// migrated) pages/components that read localStorage directly keep working.
export const CurrentUserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => readJSON("current_user"));
  const [currentLeagueId, setCurrentLeagueIdState] = useState(() => readJSON("current_league"));

  const login = useCallback((user) => {
    localStorage.setItem("current_user", JSON.stringify(user));
    localStorage.setItem("current_league", JSON.stringify(user.primary_league_id));
    setCurrentUser(user);
    setCurrentLeagueIdState(user.primary_league_id);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("current_user");
    setCurrentUser(null);
  }, []);

  const setCurrentLeagueId = useCallback((leagueId) => {
    localStorage.setItem("current_league", JSON.stringify(leagueId));
    setCurrentLeagueIdState(leagueId);
  }, []);

  const value = useMemo(
    () => ({
      currentUser,
      currentLeagueId,
      isLoggedIn: currentUser !== null,
      login,
      logout,
      setCurrentLeagueId,
    }),
    [currentUser, currentLeagueId, login, logout, setCurrentLeagueId]
  );

  return (
    <CurrentUserContext.Provider value={value}>
      {children}
    </CurrentUserContext.Provider>
  );
};

export const useCurrentUser = () => {
  const ctx = useContext(CurrentUserContext);
  if (ctx === null) {
    throw new Error("useCurrentUser must be used within a CurrentUserProvider");
  }
  return ctx;
};

export default CurrentUserContext;
