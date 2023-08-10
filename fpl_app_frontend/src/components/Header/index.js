import React, { useState } from "react";
import {NavLink} from "react-router-dom";
import Logo from '../../pl-main-logo.png';



const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [loggedIn, setLoggedIn] = useState(localStorage.getItem("current_user") !== null);

    const logout = () => {
        removeLocalStorage();
        serverCall();
    };

    const removeLocalStorage = () => {
        localStorage.removeItem("current_user");
    };

    const serverCall = async () => {
        let currentOrigin = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_prodOrigin : "http://localhost:5001";
        const response = await fetch(`${currentOrigin}/api/owners/logout`, {
            method: "post",
            headers: { "Content-Type": "application/json" }
        });

        if (response.ok) {
            document.location.replace("/");
        }
        else {
            alert(response.statusText);
        }
    };


    return (

        <header>
        <div className="logo-title">
            <img className="logo" alt='fpl logo' src={Logo}></img>
            <h1>FPL DRAFT 2023/24</h1>
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
        

        
        {loggedIn ? (
            <nav className="menu" style={{ display: isMenuOpen ? 'block' : 'none' }}>
                <NavLink to="/" activeClassName="active-link">Homepage</NavLink>
                <NavLink to="/dashboard" activeClassName="active-link">Dashboard</NavLink>
                <NavLink to="/fixtureHistory" activeClassName="active-link">Fixture History</NavLink>
                <NavLink to="/premPlayers" activeClassName="active-link">Prem Players</NavLink>
                <NavLink to="/matchups" activeClassName="active-link">Head to Head</NavLink>
                <NavLink to="/aggregate" activeClassName="active-link">Aggregate Data</NavLink>
                <NavLink to="/draft" activeClassName="active-link">Draft Data</NavLink>
                <NavLink to="/gameweekStats" activeClassName="active-link">Gameweek Stats</NavLink>
                <NavLink to="/seasonLeaders" activeClassName="active-link">Season Leaders</NavLink>
                <NavLink to="/premFixtures" activeClassName="active-link">Prem Fixtures</NavLink>
                <a href="/" onClick={logout}>Logout</a>
            </nav>
        ) : (
            <nav className="menu" style={{ display: isMenuOpen ? 'block' : 'none' }}>
                <NavLink to="/" activeClassName="active-link">Homepage</NavLink>
                <NavLink to="/signup" activeClassName="active-link">SignUp</NavLink>
                <NavLink to="/login" activeClassName="active-link">Login</NavLink>
            </nav>
        )}
    </header>
);
};

export default Header;