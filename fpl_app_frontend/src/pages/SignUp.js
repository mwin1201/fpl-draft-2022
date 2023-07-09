// Important page that will sync to the Owner Database table

// Need to include a league ID in the sign up form to accurately link the draft league + 
// there will need to be a search on the backend for the entered name in order to assign an
// entry_id & id to the Owner so that we can use these for the dashboard page


import React, { useState } from 'react';
// will need to remove comments when league is created
//import getLeagueData from '../data/LeagueData';

const SignUp = () => {
    const [formState, setFormState] = useState(
        {
            teamName: "",
            password: "",
            leagueID: "",
            entryID: "",
            fplID: "",
            secondaryLeagueID: ""
        }
    );
    const [errorMessage, setErrorMessage] = useState("");
    //const [leagueTeams, setLeagueTeams] = useState();
    const [success, setSuccess] = useState("");
    const [pageState, setPageState] = useState(1);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormState({
            ...formState,
            [name]: value
        });
    };

    const handleOwnerSearch = async (event) => {
        event.preventDefault();

        const leagueID = document.getElementById("leagueID").value;
        const teamName = document.getElementById("teamName").value;

        // this official endpoint call will need to wait until the league for new season is officially created

        // await Promise.allSettled([
        //     getLeagueData(leagueID),
        // ]).then(() => {
        //     setLeagueTeams(JSON.parse(localStorage.getItem("league_entries")));
        // }).catch(() => setErrorMessage("Issue Finding Team in League Search"));

        const leagueTeams = JSON.parse(localStorage.getItem("league_entries"));
        const leaguePlayer = leagueTeams.filter((team) => team.entry_name == teamName);
        let entryID, fplID;

        if (!leaguePlayer) {
            setErrorMessage("Could not find team with provided information");
        }
        else {
            entryID = leaguePlayer[0].entry_id;
            fplID = leaguePlayer[0].id;
            setFormState({
                ...formState,
                entryID: entryID,
                fplID: fplID
            });
        }

        setSuccess(`We found your team and have associated ids ${entryID} and ${fplID} to your user.`)
    };

    const handleOwnerSignUp = async (event) => {
        event.preventDefault();

        const teamName = document.getElementById("teamName").value.length;
        const password = document.getElementById("password").value.length;
        const leagueID = document.getElementById("leagueID").value.length;

        if (!teamName || !leagueID) {
            setPageState(1);
            setErrorMessage("You are missing a required field");
        } else if (!password) {
            setPageState(2);
            setErrorMessage("Your password is required");
        } else {
                    // need to build Owner service under utils folder that will contain endpoint calls to push new owner to DB
        setPageState(2);
        setSuccess(`Your data as follows: ${formState.teamName} ${formState.password} ${formState.leagueID} ${formState.entryID} ${formState.fplID} ${formState.secondaryLeagueID}`);
        }
    };

    return (
        <section>
            <form onSubmit={handleOwnerSearch} autoComplete="off">
                <div>
                    <h1>Join in the FPL Fun!</h1>
                    {pageState === 1 && errorMessage && <p>{errorMessage}</p>}
                    { pageState === 1 && success && <p>{success}</p>}

                    <h2>First, enter your FPL Draft League ID and your team name in that League.</h2>
                    <p>This is so we can search for you and pre-populate data relative to your team.</p>

                    <label htmlFor="leagueID">League ID:</label>
                    <input id="leagueID" name="leagueID" type="number" onBlur={handleChange}></input>

                    <label htmlFor="teamName">Team Name: </label>
                    <input id="teamName" name="teamName" type="text" onBlur={handleChange}></input>

                    <button>Search</button>
                </div>
            </form>

            <form onSubmit={handleOwnerSignUp} autoComplete="off">
                <h2>Last Step, enter a password</h2>
                {pageState === 2 && errorMessage && <p>{errorMessage}</p>}
                {pageState === 2 && success && <p>{success}</p>}

                <label htmlFor="password">Password:</label>
                <input id="password" name="password" type="password" onBlur={handleChange}></input>

                <h3>Enter a Secondary League ID (optional)</h3>
                <label htmlFor="secondaryLeagueID">Secondary League ID:</label>
                <input id="secondaryLeagueID" name="secondaryLeagueID" type="number" onBlur={handleChange}></input>

                <button>Submit</button>
            </form>
        </section>
    )

};

export default SignUp;