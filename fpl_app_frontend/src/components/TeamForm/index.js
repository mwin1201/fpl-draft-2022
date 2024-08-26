import {useState, useEffect} from "react";
import getRecord from "../../data/MatchResults";
import calculateAVGScore from "../../data/AvgGWScore";
import getStatData from "../../data/GetStatData";

const TeamForm = ({team_id}) => {
    const [avgScore, setAvgScore] = useState();
    const [gwLookback, setGWLookback] = useState();
    const [teamRecord, setTeamRecord] = useState();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsLoading(true);

        const checkGW = async (gw) => {
            if (!JSON.parse(localStorage.getItem("current_gameweek_complete"))) {
                return gw - 1;
            }
            const stats = await getStatData(gw, JSON.parse(localStorage.getItem("current_league")));
            return stats.length === 0 ? gw - 1 : gw;
        };

        const start = async () => {
            const currentGameweek = JSON.parse(localStorage.getItem("current_gameweek"));
            const GWvalue = await checkGW(currentGameweek);
            const lookback = GWvalue > 10 ? 10 : GWvalue;
            setGWLookback(lookback);
            setAvgScore(await calculateAVGScore(team_id, lookback, GWvalue));
            setTeamRecord(getRecord(team_id, lookback, GWvalue));
            setIsLoading(false);
        };

        start();

    }, [team_id]);

    const delay = () => {
        new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            }, 5000);
        });
    };

    const data =
            <div className="team-form">
                <h2>Current Team Form</h2>
                <h3>L{gwLookback} Results (W-D-L): {teamRecord}</h3>
                <h3>L{gwLookback} Avg Score: {avgScore}pts</h3>
            </div>;

    if (isLoading) {
        return delay();
    }
    else {
        return data;
    }
};

export default TeamForm;
