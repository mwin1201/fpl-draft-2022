import React from "react";
import {Link} from "react-router-dom";

const Header = () => {

    return (
        <header>
            <h1>
                FPL DRAFT 2022/23
            </h1>
            <nav>
                    <Link to="/">Homepage</Link>
                    <Link to="/fixtureHistory">Fixture History</Link>
                    <Link to="/premPlayers">Prem Players</Link>
                    <Link to="/matchups">Head to Head</Link>
                    <Link to="/aggregate">Aggregate Data</Link>
                    <Link to="/draft">Draft Data</Link>
                    <Link to="/gameweekStats">Gameweek Stats</Link>
                    <Link to="/seasonLeaders">Season Leaders</Link>
                    <Link to="/premFixtures">Prem Fixtures</Link>
            </nav>
        </header>
    );
};

export default Header;