import React, { useState, useEffect } from 'react';
const axios = require('axios').default;

const PersonalBets = () => {
    const [Bets, setBets] = useState(0);
    const [isLoading, setIsLoading] = useState(true);


    useEffect(() => {
        const getBets = () => {
            const ownerId = JSON.parse(localStorage.getItem("current_user")).fpl_id;
            let currentOrigin = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_prodOrigin : "http://localhost:5000";
            axios.get(`${currentOrigin}/api/bets/owner/` + ownerId)
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
        return(singleTeam[0].name);
    };


    if (isLoading) {
        return (
            <section>
                <h3>Bets are loading...</h3>
            </section>
        );
    }

    if (Bets === 0) {
        <section>
            <h3>You have no bets at this time.</h3>
        </section>
    }

    return (
        <section>
            <h2>Personal Bets</h2>
             <table className="table-data">
                <thead>
                <tr>
                    <th>GW</th>
                    <th>Home</th>
                    <th>Prediction</th>
                    <th>Away</th>
                    <th>Prediction</th>
                    <th>Amount</th>
                    <th>Paid</th>
                    <th>Success</th>
                </tr>
                </thead>
                <tbody>
                {Bets.map((bet) => (
                    <tr key={bet.fixture_id}>
                        <td>{bet.gameweek}</td>
                        <td>{getTeamName(bet.team_h)}</td>
                        <td>{bet.team_h_prediction}</td>
                        <td>{getTeamName(bet.team_a)}</td>
                        <td>{bet.team_a_prediction}</td>
                        <td>{bet.amount}</td>
                        <td>{bet.paid}</td>
                        <td>{bet.success}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </section>
    );

};

export default PersonalBets;