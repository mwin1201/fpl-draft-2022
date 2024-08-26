import { useState, useEffect } from "react";
import getRecord from "../../data/MatchResults";
import calculateAVGScore from "../../data/AvgGWScore";
import getStatData from "../../data/GetStatData";

const LeagueForm = ({league_id, currentGameweek}) => {
    const [lookback, setLookback] = useState(1);
    const [leagueFormData, setLeagueFormData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsLoading(true);

        const start = async () => {
            let data = [];
            const league_entries = JSON.parse(localStorage.getItem("league_entries"));
            const currentGWStats = await getStatData(currentGameweek, league_id);
            let previousGWStats, GWvalue;

            if (currentGWStats.length === 0) {
                previousGWStats = await getStatData(currentGameweek - 1, league_id);
                GWvalue = currentGameweek - 1;
            } else { 
                GWvalue = currentGameweek;
            }

            const stats = currentGWStats.length === 0 ? previousGWStats : currentGWStats;

            for (var i = 0; i < stats.length; i++) {
                let stat_entry_id = stats[i].entry_id;
                let league_entry = league_entries.filter((team) => team.entry_id === stat_entry_id)[0];
                let obj = {};
                obj.name = league_entry.entry_name;
                obj.team_id = league_entry.id;
                obj.form = getRecord(league_entry.id, lookback, GWvalue);
                obj.avg_score = await calculateAVGScore(league_entry.id, lookback, GWvalue);
                data.push(obj);
            }
            setLeagueFormData(data);
            setIsLoading(false);
        };

        start();

    },[lookback, currentGameweek, league_id]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLookback(document.getElementById("searchNumber").value);
    };

    const delay = () => {
        new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            }, 5000);
        });
    };

    if (isLoading) {
        return delay();
    }

    return (
        <section>
            <h3>Hot or Not</h3>
            <form id="lookback" onSubmit={handleSubmit}>
                <label htmlFor="searchNumber">How many games to look back:</label>
                <input type="number" id="searchNumber" name="searchNumber" min="0" max={JSON.parse(localStorage.getItem("current_gameweek"))}></input>
                <button type="submit">Submit</button>
            </form>
            <div className="participants">
                {leagueFormData.sort((a,b) => (b.avg_score - a.avg_score)).map((team) => (
                    <div className="border-top border-danger" key={team.id}>
                        <h4>{team.name}</h4>
                        <p>L{lookback} Results (W-D-L): {team.form}</p>
                        <p>L{lookback} Avg Score: {team.avg_score}pts</p>
                    </div>
                ))}
            </div>
        </section>
    )
};

export default LeagueForm;
