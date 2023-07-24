// Important page that will sync to the Owner Database table

// Need to include a league ID in the sign up form to accurately link the draft league + 
// there will need to be a search on the backend for the entered name in order to assign an
// entry_id & id to the Owner so that we can use these for the dashboard page


import React, { useState } from 'react';
import DangerAlert from '../alerts/FormAlerts/danger';
import SuccessAlert from '../alerts/FormAlerts/success';
import getLeagueData from '../data/LeagueData';
import Spinner from 'react-bootstrap/Spinner';

const SignUp = () => {
    const [formState, setFormState] = useState(
        {
            team_name: "",
            password: "",
            primary_league_id: "",
            entry_id: "",
            fpl_id: "",
            secondary_league_id: null
        }
    );
    const [errorMessage, setErrorMessage] = useState("");
    const [success, setSuccess] = useState("");
    const [errorMessage2, setErrorMessage2] = useState("");
    const [success2, setSuccess2] = useState("");
    const [isSearchLoading, setIsSearchLoading] = useState(false);
    const [isSubmitLoading, setIsSubmitLoading] = useState(false);

    const handleChange = (event) => {
        const { name, value } = event.target;

        if (name === "primary_league_id") {
            const primary_league_id = parseInt(value);
            setFormState({
                ...formState,
                [name]: primary_league_id
            })
        }
        else if (name === "secondary_league_id") {
            const secondary_league_id = parseInt(value);
            setFormState({
                ...formState,
                [name]: secondary_league_id
            });
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

        setIsSearchLoading(true);
        const primary_league_id = document.getElementById("primary_league_id").value;
        const team_name = document.getElementById("team_name").value;

        // this official endpoint call will need to wait until the league for new season is officially created

        await Promise.allSettled([
            getLeagueData(primary_league_id),
        ]).then((data) => {
            const leagueTeams = JSON.parse(localStorage.getItem("league_entries"));
            const leaguePlayer = leagueTeams.filter((team) => team.entry_name === team_name);
            setIsSearchLoading(false);
            let entry_id, fpl_id;

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
                let submitForm = document.getElementById("signup-submit");
                submitForm.classList.remove("hide-form");
            }
            }).catch(() => setErrorMessage("Issue Finding Team in League Search"));
    };

    const handleOwnerSignUp = async (event) => {
        event.preventDefault();

        const team_name = document.getElementById("team_name").value.length;
        const password = document.getElementById("password").value.length;
        const primary_league_id = document.getElementById("primary_league_id").value.length;
        const secondary_league_id = document.getElementById("secondary_league_id").value.length;

        if (!team_name || !primary_league_id) {
            setErrorMessage("Your team name and primary league ID are required.");
            setSuccess("");
        } else if (!password || !secondary_league_id) {
            setErrorMessage2("Your password and secondary league ID are required.");
            setSuccess2("");
        } else {
            setIsSubmitLoading(true);
            let currentOrigin = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_prodOrigin : "http://localhost:5000";
            await fetch(`${currentOrigin}/api/owners`, {
                method: "post",
                body: JSON.stringify(formState),
                headers: { "Content-Type": "application/json"}
            }).then((response) => {    
                if (response.ok) {
                    return response.json();
                }
                else {
                    throw response;
                }
            }).then((data) => {
                localStorage.setItem("current_user", JSON.stringify(data));
                setIsSubmitLoading(false);
                document.location.replace('/dashboard');
            })
            .catch((err) => {
                setIsSubmitLoading(false);
                setErrorMessage2("There was an issue with the submission. Please try again.");
            });
        }
    };

    return (
        <section>
            <form id="signup-search" onSubmit={handleOwnerSearch} autoComplete="off">
                <h1>Join in the FPL Fun!</h1>

                <h3>First, enter your FPL Draft League ID and your team name in that League.</h3>
                <p>This is so we can search for you and pre-populate data relative to your team.</p>

                <DangerAlert message={errorMessage} />
                <SuccessAlert message={success} />
                {isSearchLoading ? <Spinner variant='danger' /> : ""}

                <label htmlFor="primary_league_id">League ID:</label>
                <input id="primary_league_id" name="primary_league_id" type="number" onBlur={handleChange}></input>

                <label htmlFor="team_name">Team Name: </label>
                <input id="team_name" name="team_name" type="text" onBlur={handleChange}></input>

                <button>Search</button>
            </form>

            <form id='signup-submit' className='hide-form' onSubmit={handleOwnerSignUp} autoComplete="off">
                <h2>Last Steps</h2>
                
                <DangerAlert message={errorMessage2} />
                <SuccessAlert message={success2} />
                {isSubmitLoading ? <Spinner variant='danger' /> : ""}

                <label htmlFor="password">Password:</label>
                <input id="password" name="password" type="password" onBlur={handleChange}></input>

                <h3>Enter a Secondary League ID</h3>
                <label htmlFor="secondary_league_id">Secondary League ID:</label>
                <input id="secondary_league_id" name="secondary_league_id" type="number" onBlur={handleChange}></input>

                <button>Submit</button>
            </form>
        </section>
    )

};

export default SignUp;