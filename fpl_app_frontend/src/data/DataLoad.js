import getLeagueData from "./LeagueData";
import getPlayers from "./Players";
import getDraftData from "./DraftData";
import getGameweek from "./CurrentGameweek";
import seasonStats from "./GWStats";
import ManagerOfTheMonth from "./ManagerOTM";

const DataLoad = async (leagueID) => {
    let dataLoadComplete = false;

    const collectData = async (leagueID) => {
        await Promise.allSettled([
            getLeagueData(leagueID),
            getPlayers(),
            getDraftData(leagueID),
        ]).then(() => {
            getAllStats();
        }).catch((err) => {
            console.log(err);
            return dataLoadComplete;
        });
    }

    const getAllStats = async () => {
        const apiGW = JSON.parse(localStorage.getItem("current_gameweek"));
        for (var index = apiGW; index >= 1; index--) {
            if (index === apiGW) {
                await seasonStats(index);
            }
            else if (localStorage.getItem(`gw_${index}_stats`)) {
                continue;
            }
            else {
                await seasonStats(index);
            }
        }
        getManagerOfTheMonth(apiGW);
    };

    const getManagerOfTheMonth = async (gw) => {
        localStorage.setItem("manager_of_the_month", await ManagerOfTheMonth(gw));
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
        localStorage.setItem("current_gameweek", apiGW);
        localStorage.setItem("current_gameweek_complete", gwComplete);
        localStorage.setItem("current_league", leagueID);
        collectData(leagueID);
    };

    start(leagueID);
};

export default DataLoad;