import getRecord from "../../data/MatchResults";
import calculateAVGScore from "../../data/AvgGWScore";

const TeamForm = ({team_id, number}) => {
    return (
        <div className="team-form">
            <h2>Current Team Form</h2>
            <h3>L10 Results (W-D-L): {getRecord(team_id, number)}</h3>
            <h3>L10 Avg Score: {calculateAVGScore(team_id, number)}pts</h3>
        </div>
    );
};

export default TeamForm;