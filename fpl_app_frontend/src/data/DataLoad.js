import getLeagueData from "./LeagueData";
import getPlayers from "./Players";
import getDraftData from "./DraftData";
import getGameweek from "./CurrentGameweek";
import seasonStats from "./GWStats";
import ManagerOfTheMonth from "./ManagerOTM";
import CheckBets from "./CheckBets";
import currentFixtures from "./currentFixtures";

const DataLoad = async (leagueID) => {
  let dataLoadComplete = false;

  const collectData = async (leagueID, gw) => {
    return await Promise.allSettled([
      getLeagueData(leagueID),
      getPlayers(),
      currentFixtures(gw + 1),
      getDraftData(leagueID),
      CheckBets(JSON.parse(localStorage.getItem("current_user")).fpl_id),
    ])
      .then(() => {
        return getAllStats();
      })
      .catch((err) => {
        console.log(err);
        return dataLoadComplete;
      });
  };

  const getAllStats = async () => {
    const apiGW = JSON.parse(localStorage.getItem("current_gameweek"));
    if (apiGW == null) {
      dataLoadComplete = true;
      return dataLoadComplete;
    }
    for (var index = apiGW; index >= 1; index--) {
      if (index === apiGW) {
        await seasonStats(index);
      } else if (localStorage.getItem(`gw_${index}_stats`)) {
        continue;
      } else {
        await seasonStats(index);
      }
    }
    return getManagerOfTheMonth(apiGW);
  };

  const getManagerOfTheMonth = async (gw) => {
    localStorage.setItem(
      "manager_of_the_month",
      JSON.stringify(await ManagerOfTheMonth(gw))
    );
    dataLoadComplete = true;
    return dataLoadComplete;
  };

  const start = async (leagueID) => {
    const [apiGW, gwComplete] = await getGameweek();
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

    for (var i = 0; i < 39; i++) {
      localStorage.removeItem(`gw_${i}_stats`);
    }

    localStorage.setItem("current_gameweek", apiGW);
    localStorage.setItem("current_gameweek_complete", gwComplete);
    localStorage.setItem("current_league", leagueID);
    return collectData(leagueID, apiGW);
  };

  return start(leagueID);
};

export default DataLoad;
