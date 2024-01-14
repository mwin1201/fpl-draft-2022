import React, { useState, useEffect } from 'react';
const axios = require('axios').default;

const PersonalBets = ({ owner_id }) => {
    const [Bets, setBets] = useState(0);
    const [isLoading, setIsLoading] = useState(true);


    useEffect(() => {
        const getBets = () => {
            let currentOrigin = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_prodOrigin : "http://localhost:5000";
            axios.get(`${currentOrigin}/api/bets/owner/` + owner_id)
            .then((apiResponse) => {
                setBets(apiResponse.data);
                setIsLoading(false);
            })
        };

        getBets();
    }, []);


    const getTeamName = (teamId) => {
        const teams = JSON.parse(localStorage.getItem("teams"));
        let singleTeam = teams.filter((team) => team.id === teamId);
        return(singleTeam[0].short_name);
    };


    if (isLoading) {
        return (
            <section>
                <h3>Bets are loading...</h3>
            </section>
        );
    }

    return (
        <section>
            <h2>Personal Bets</h2>
            {Bets.length > 0
            ?
             <table className="table-data">
                <thead>
                <tr>
                    <th>GW</th>
                    <th>H</th>
                    <th>Bet</th>
                    <th>A</th>
                    <th>Bet</th>
                    <th>$$$</th>
                    <th>RSLT</th>
                </tr>
                </thead>
                <tbody>
                {Bets.sort((bet1, bet2) => bet1.gameweek - bet2.gameweek).map((bet) => (
                    <tr key={bet.fixture_id}>
                        <td>{bet.gameweek}</td>
                        <td>{getTeamName(bet.team_h)}</td>
                        <td>{bet.team_h_prediction}</td>
                        <td>{getTeamName(bet.team_a)}</td>
                        <td>{bet.team_a_prediction}</td>
                        <td>{bet.amount}</td>
                        <td className={bet.success ? "green-highlight" : "red-highlight"}>{bet.success ? "WON" : "LOST"}</td>
                    </tr>
                ))}
                </tbody>
            </table>
            :
            <section>
                <h3>No bets at this time.</h3>
            </section>
            }
        </section>
    );

};

export default PersonalBets;