// Important page that will sync to the Owner Database table

// Need to include a league ID in the sign up form to accurately link the draft league + 
// there will need to be a search on the backend for the entered name in order to assign an
// entry_id & id to the Owner so that we can use these for the dashboard page


import React, { useState } from 'react';
import Alert from 'react-bootstrap/Alert';
// will need to remove comments when league is created
//import getLeagueData from '../data/LeagueData';

const SignUp = () => {
    const [formState, setFormState] = useState(
        {
            team_name: "",
            password: "",
            primary_league_id: "",
            entry_id: "",
            fpl_id: "",
            secondary_league_id: ""
        }
    );
    const [errorMessage, setErrorMessage] = useState("");
    //const [leagueTeams, setLeagueTeams] = useState();
    const [success, setSuccess] = useState("");
    const [errorMessage2, setErrorMessage2] = useState("");
    const [success2, setSuccess2] = useState("");

    const handleChange = (event) => {
        const { name, value } = event.target;

        if (name === "primary_league_id") {
            const primary_league_id = parseInt(value);
            setFormState({
                ...formState,
                [name]: primary_league_id
            })
        }
        else {
            setFormState({
                ...formState,
                [name]: value
            });
        }
    };

    const handleOwnerSearch = async (event) => {
        event.preventDefault();

        const primary_league_id = document.getElementById("primary_league_id").value;
        const team_name = document.getElementById("team_name").value;

        // this official endpoint call will need to wait until the league for new season is officially created

        // await Promise.allSettled([
        //     getLeagueData(primary_league_id),
        // ]).then(() => {
        //     setLeagueTeams(JSON.parse(localStorage.getItem("league_entries")));
        // }).catch(() => setErrorMessage("Issue Finding Team in League Search"));

        const leagueTeams = JSON.parse(localStorage.getItem("league_entries"));
        const leaguePlayer = leagueTeams.filter((team) => team.entry_name == team_name);
        let entry_id, fpl_id;

        console.log(leaguePlayer);

        if (leaguePlayer.length === 0) {
            setErrorMessage("Could not find team with provided information");
            setSuccess("");
        }
        else {
            entry_id = leaguePlayer[0].entry_id;
            fpl_id = leaguePlayer[0].id;
            setFormState({
                ...formState,
                entry_id: entry_id,
                fpl_id: fpl_id
            });
            setSuccess(`We found your team and have associated ids ${entry_id} and ${fpl_id} to your user.`)
            setErrorMessage("");
        }
    };

    const handleOwnerSignUp = async (event) => {
        event.preventDefault();

        const team_name = document.getElementById("team_name").value.length;
        const password = document.getElementById("password").value.length;
        const primary_league_id = document.getElementById("primary_league_id").value.length;

        if (!team_name || !primary_league_id) {
            setErrorMessage("You are missing a required field");
            setSuccess("");
        } else if (!password) {
            setErrorMessage2("Your password is required");
            setSuccess2("");
        } else {
            // need to build Owner service under utils folder that will contain endpoint calls to push new owner to DB
            const response = await fetch("http://localhost:5000/api/owners", {
                method: "post",
                body: JSON.stringify(formState),
                headers: { "Content-Type": "application/json"}
            });

            const data = await response.json();
            localStorage.setItem("current_user", JSON.stringify(data));

            if (response.ok) {
                document.location.replace('/dashboard');
            }
            else {
                alert(response.statusText);
            }
        }
    };

    return (
        <section>
            <form onSubmit={handleOwnerSearch} autoComplete="off">
                <div>
                    <h1>Join in the FPL Fun!</h1>

                    <h2>First, enter your FPL Draft League ID and your team name in that League.</h2>
                    <p>This is so we can search for you and pre-populate data relative to your team.</p>

                    {errorMessage && <Alert variant='danger'>{errorMessage}</Alert>}
                    {success && <Alert variant='success'>{success}</Alert>}

                    <label htmlFor="primary_league_id">League ID:</label>
                    <input id="primary_league_id" name="primary_league_id" type="number" onBlur={handleChange}></input>

                    <label htmlFor="team_name">Team Name: </label>
                    <input id="team_name" name="team_name" type="text" onBlur={handleChange}></input>

                    <button>Search</button>
                </div>
            </form>

            <form onSubmit={handleOwnerSignUp} autoComplete="off">
                <h2>Last Step, enter a password</h2>
                {errorMessage2 && <Alert variant='danger'>{errorMessage2}</Alert>}
                {success2 && <Alert variant='success'>{success2}</Alert>}

                <label htmlFor="password">Password:</label>
                <input id="password" name="password" type="password" onBlur={handleChange}></input>

                <h3>Enter a Secondary League ID (optional)</h3>
                <label htmlFor="secondary_league_id">Secondary League ID:</label>
                <input id="secondary_league_id" name="secondary_league_id" type="number" onBlur={handleChange}></input>

                <button>Submit</button>
            </form>
        </section>
    )

};

export default SignUp;