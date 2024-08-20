import {useState, useEffect} from "react";
import getRecord from "../../data/MatchResults";
import calculateAVGScore from "../../data/AvgGWScore";

const TeamForm = ({team_id, number}) => {
    const [avgScore, setAvgScore] = useState();
    const [teamRecord, setTeamRecord] = useState();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsLoading(true);

        const start = async () => {
            setAvgScore(await calculateAVGScore(team_id, number));
            setTeamRecord(getRecord(team_id, number));
            setIsLoading(false);
        };

        start();

    }, [team_id, number]);

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
                <h3>L10 Results (W-D-L): {teamRecord}</h3>
                <h3>L10 Avg Score: {avgScore}pts</h3>
            </div>;

    if (isLoading) {
        return delay();
    }
    else {
        return data;
    }
};

export default TeamForm;
