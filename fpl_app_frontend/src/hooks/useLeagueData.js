import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import DataLoad, { liveRefresh } from "../data/DataLoad";
import { useLeague } from "../context/LeagueContext";

// True while the current gameweek is in progress (matches being played). Only
// meaningful after the initial load has populated localStorage.
const isGameweekLive = () => {
  const gw = JSON.parse(localStorage.getItem("current_gameweek"));
  const complete = JSON.parse(localStorage.getItem("current_gameweek_complete"));
  return gw != null && complete === false;
};

// Owns the data lifecycle for the selected league:
//  - one full DataLoad when the league changes (fetches everything, precomputes
//    per-gameweek stats, and caches it all in localStorage), and
//  - a lightweight liveRefresh on a ~60s interval, but only while the gameweek
//    is in progress, so live points/standings stay current without a heavy
//    reload or a full-screen loader.
// Each completed load bumps the context dataVersion so live views re-read the
// updated localStorage.
export const useLeagueData = (leagueId) => {
  const queryClient = useQueryClient();
  const { bumpDataVersion } = useLeague();

  const initial = useQuery({
    queryKey: ["leagueData", leagueId],
    queryFn: async () => {
      const ok = await DataLoad(leagueId);
      if (!ok) throw new Error(`Failed to load data for league ${leagueId}`);
      return Date.now();
    },
    enabled: leagueId !== null && leagueId !== undefined,
    // Full load only re-runs when the league changes; live data is handled by
    // the separate polling query below.
    staleTime: Infinity,
  });

  const live = useQuery({
    queryKey: ["liveRefresh", leagueId],
    queryFn: async () => {
      await liveRefresh(leagueId);
      return Date.now();
    },
    enabled:
      leagueId !== null &&
      leagueId !== undefined &&
      initial.isSuccess &&
      isGameweekLive(),
    refetchInterval: initial.isSuccess && isGameweekLive() ? 60000 : false,
    refetchIntervalInBackground: false,
    staleTime: 0,
    gcTime: 0,
  });

  // Reflect freshly-written localStorage in the UI after each successful load.
  useEffect(() => {
    if (initial.dataUpdatedAt) bumpDataVersion();
  }, [initial.dataUpdatedAt, bumpDataVersion]);
  useEffect(() => {
    if (live.dataUpdatedAt) bumpDataVersion();
  }, [live.dataUpdatedAt, bumpDataVersion]);

  // Manual refresh button: force a live refresh regardless of gameweek state.
  const refresh = () =>
    queryClient
      .fetchQuery({
        queryKey: ["liveRefresh", leagueId],
        queryFn: async () => {
          await liveRefresh(leagueId);
          return Date.now();
        },
      })
      .then(() => bumpDataVersion());

  return {
    isLoading: initial.isLoading,
    isError: initial.isError,
    isRefreshing: live.isFetching,
    refresh,
  };
};

export default useLeagueData;
