import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import Logo from "../../pl-main-logo.png";
import { useLeague } from "../../context/LeagueContext";

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { hasLeagueSelected } = useLeague();

    return (
        <header>
            <div className="logo-title">
                <img className="logo" alt='fpl logo' src={Logo}></img>
                <h1>Chicago Dogs FPL</h1>
            </div>

            <input
                type="checkbox"
                id="menuToggle"
                checked={isMenuOpen}
                onChange={() => setIsMenuOpen(!isMenuOpen)}
                style={{ display: 'none' }}
            />
            <label htmlFor="menuToggle" className="menu-icon">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#ffffff" className="menu-icon-svg">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5" />
                </svg>
            </label>

            <nav className="menu" style={{ display: isMenuOpen ? 'block' : 'none' }}>
                <NavLink to="/">Home</NavLink>
                {hasLeagueSelected && (
                    <>
                        <NavLink to="/overview">Overview</NavLink>
                        <NavLink to="/fixtureHistory">Fixture History</NavLink>
                        <NavLink to="/premPlayers">Prem Players</NavLink>
                        <NavLink to="/matchups">Head to Head</NavLink>
                        <NavLink to="/aggregate">Aggregate Data</NavLink>
                        <NavLink to="/draft">Draft Data</NavLink>
                        <NavLink to="/gameweekStats">Gameweek Stats</NavLink>
                        <NavLink to="/seasonLeaders">Season Leaders</NavLink>
                        <NavLink to="/premFixtures">Prem Fixtures</NavLink>
                    </>
                )}
            </nav>
        </header>
    );
};

export default Header;
