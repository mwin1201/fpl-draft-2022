import getLeagueData from "./LeagueData";
import getPlayers from "./Players";
import getDraftData from "./DraftData";
import getGameweek from "./CurrentGameweek";
import seasonStats from "./GWStats";
import ManagerOfTheMonth from "./ManagerOTM";
import CheckBets from "./CheckBets";
import currentFixtures from "./currentFixtures";
import getDreamteam from "./DreamTeam";
import getDBLeagueData from "./DBLeagueData";

const DataLoad = async (leagueID, didLeagueChange) => {
  let dataLoadComplete = false;

  const collectData = async (leagueID, gw) => {
    return await Promise.allSettled([
      getLeagueData(leagueID),
      getDBLeagueData(),
      getPlayers(),
      currentFixtures(gw + 1),
      getDreamteam(gw),
      getDraftData(leagueID),
      CheckBets(JSON.parse(localStorage.getItem("current_user")).fpl_id),
    ])
      .then(() => {
        return getCurrentGWStats();
      })
      .then(() => {
        if (gw === 36 && leagueID === 29556) { // need to remember to change this to gw === 36
          let standings = JSON.parse(localStorage.getItem("standings"));
          let playoffTeams = standings.filter(
            (team) =>
              team.rank === 3 ||
              team.rank === 4 ||
              team.rank === 5 ||
              team.rank === 6
          );
          localStorage.setItem(
            "championship_playoff_teams",
            JSON.stringify(playoffTeams)
          );
        }
        dataLoadComplete = true;
        return dataLoadComplete;
      })
      .catch((err) => {
        console.log(err);
        return dataLoadComplete;
      });
  };

  const getCurrentGWStats = async () => {
    const apiGW = JSON.parse(localStorage.getItem("current_gameweek"));
    if (apiGW == null) {
      dataLoadComplete = true;
      return dataLoadComplete;
    }
    await seasonStats(apiGW);
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

  const start = async (leagueID, didLeagueChange) => {
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
    localStorage.removeItem("dreamteam");
    localStorage.removeItem("db_league_data");

    for (var i = 0; i < 39; i++) {
      localStorage.removeItem(`gw_${i}_stats`);
    }

    if (apiGW < 36) {
      localStorage.removeItem("championship_playoff_teams");
    }

    localStorage.setItem("current_gameweek", apiGW);
    localStorage.setItem("current_gameweek_complete", gwComplete);
    localStorage.setItem("current_league", leagueID);
    return collectData(leagueID, apiGW);
  };

  return start(leagueID, didLeagueChange);
};

export default DataLoad;
