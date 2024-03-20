import { useState, useEffect } from "react";
import getRecord from "../../data/MatchResults";
import calculateAVGScore from "../../data/AvgGWScore";

const LeagueForm = ({league_entries}) => {
    const [lookback, setLookback] = useState(10);
    const [leagueFormData, setLeagueFormData] = useState([]);

    useEffect(() => {
        let data = [];
        const league_entries = JSON.parse(localStorage.getItem("league_entries"));
        
        for (var i = 0; i < league_entries.length; i++) {
            let obj = {};
            obj.name = league_entries[i].entry_name;
            obj.team_id = league_entries[i].id;
            obj.form = getRecord(league_entries[i].id, lookback);
            obj.avg_score = calculateAVGScore(league_entries[i].id, lookback);
            data.push(obj);
        }
        setLeagueFormData(data);

    },[lookback]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLookback(document.getElementById("searchNumber").value);
    };

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