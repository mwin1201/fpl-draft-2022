import React, { useState } from "react";
import {Link} from "react-router-dom";
// import logo from 'public/fpl_logo.png' 

const Header = () => {
    const [loggedIn, setLoggedIn] = useState(localStorage.getItem("current_user") !== null);

    const logout = () => {
        removeLocalStorage();
        serverCall();
    };

    const removeLocalStorage = () => {
        localStorage.removeItem("current_user");
    };

    const serverCall = async () => {
        let currentOrigin = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_prodOrigin : "http://localhost:5000";
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
                <img className="logo" alt='fpl logo' src='https://www.premierleague.com/resources/rebrand/v7.123.11/i/elements/pl-main-logo.png'></img>
            <h1>
                FPL DRAFT 2023/24
            </h1>
            </div>
           
            {loggedIn ?
                <nav>
                    <Link to="/">Homepage</Link>
                    <Link to="/dashboard">Dashboard</Link>
                    <Link to="/fixtureHistory">Fixture History</Link>
                    <Link to="/premPlayers">Prem Players</Link>
                    <Link to="/matchups">Head to Head</Link>
                    <Link to="/aggregate">Aggregate Data</Link>
                    <Link to="/draft">Draft Data</Link>
                    <Link to="/gameweekStats">Gameweek Stats</Link>
                    <Link to="/seasonLeaders">Season Leaders</Link>
                    <Link to="/premFixtures">Prem Fixtures</Link>
                    <a href="/" onClick={logout}>Logout</a>
                </nav>
                :
                <nav>
                    <Link to="/">Homepage</Link>
                    <Link to="/signup">SignUp</Link>
                    <Link to="/login">Login</Link>
                </nav>
            }
        </header>
    );
};

export default Header;