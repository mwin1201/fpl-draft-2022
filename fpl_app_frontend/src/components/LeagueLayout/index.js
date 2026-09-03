import React, { useEffect, useState } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useLeague } from "../../context/LeagueContext";
import useLeagueData from "../../hooks/useLeagueData";
import { getLeagueConfig } from "../../config/leagues";
import Loading from "../Loading";
import ErrorState from "../ErrorState";

// Human-friendly "x ago" string for the last-updated timestamp.
const timeAgo = (timestamp) => {
  if (!timestamp) return "never";
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 10) return "just now";
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  return `${hours}h ago`;
};

// Thin bar shown above every league page: which league is active, when the data
// was last refreshed, a live "updating" indicator, and a manual refresh button.
const RefreshBar = ({ leagueName, isRefreshing, onRefresh }) => {
  const { dataVersion } = useLeague();
  // Re-render every 15s so the relative "last updated" time stays current even
  // between data refreshes.
  const [, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 15000);
    return () => clearInterval(id);
  }, []);

  const lastUpdated = JSON.parse(localStorage.getItem("last_updated"));
  // dataVersion is referenced so this recomputes when a refresh completes.
  void dataVersion;

  return (
    <div className="refresh-bar">
      <span className="refresh-bar-league">{leagueName}</span>
      <span className="refresh-bar-status">
        {isRefreshing ? "Updating\u2026" : `Last updated ${timeAgo(lastUpdated)}`}
      </span>
      <button
        type="button"
        className="refresh-bar-button"
        onClick={onRefresh}
        disabled={isRefreshing}
      >
        Refresh
      </button>
    </div>
  );
};

// Layout wrapping every league-scoped route. Redirects to the welcome page when
// no league is selected, otherwise loads the league's data (showing a
// full-screen loader on first load) and renders the routed page.
const LeagueLayout = () => {
  const { currentLeagueId, hasLeagueSelected } = useLeague();
  const { isLoading, isError, isRefreshing, refresh } =
    useLeagueData(currentLeagueId);

  if (!hasLeagueSelected) {
    return <Navigate to="/" replace />;
  }

  if (isLoading) {
    return <Loading message="Loading all gameweek data..." />;
  }

  if (isError) {
    return <ErrorState />;
  }

  const leagueName = getLeagueConfig(currentLeagueId)?.name || "League";

  return (
    <>
      <RefreshBar
        leagueName={leagueName}
        isRefreshing={isRefreshing}
        onRefresh={refresh}
      />
      <Outlet />
    </>
  );
};

export default LeagueLayout;
