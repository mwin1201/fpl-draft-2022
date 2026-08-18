import { useQuery } from "@tanstack/react-query";
import DataLoad from "../data/DataLoad";

// React Query wrapper around the legacy DataLoad routine. DataLoad still writes
// the fetched data into localStorage (which the not-yet-migrated pages read),
// but React Query now owns the load lifecycle: caching per league, loading /
// error state, and refetching when the selected league changes. This replaces
// the manual useEffect + Promise + useState boilerplate the pages used to have.
export const useLeagueData = (leagueId) =>
  useQuery({
    queryKey: ["leagueData", leagueId],
    queryFn: async () => {
      const loaded = await DataLoad(leagueId, false);
      if (!loaded) {
        throw new Error(`Failed to load data for league ${leagueId}`);
      }
      return loaded;
    },
    enabled: leagueId !== null && leagueId !== undefined,
    // localStorage is a single global slot shared by the not-yet-migrated
    // pages, so we must re-run DataLoad every time a league becomes active
    // (even if its boolean result is cached) to repopulate localStorage for
    // the current league. Override the global 5-minute staleTime to force it.
    staleTime: 0,
  });

export default useLeagueData;
