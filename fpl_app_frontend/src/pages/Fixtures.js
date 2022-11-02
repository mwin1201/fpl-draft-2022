import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";


const Fixtures = () => {
    const location = useLocation();

    return (
        <div>
            <h1>Fixture History</h1>
            {location.state.data.map((fixture,i) => (
                <div key={i}>
                    <h3>Week {fixture.event}</h3>
                    {fixture.league_entry_1}: {fixture.league_entry_1_points} vs {fixture.league_entry_2}: {fixture.league_entry_2_points}
                </div>
            ))}
        </div>
    );

};

export default Fixtures;