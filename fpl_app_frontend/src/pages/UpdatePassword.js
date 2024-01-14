import React, { useState } from 'react';
import DangerAlert from '../alerts/FormAlerts/danger';
import Spinner from 'react-bootstrap/Spinner';

const UpdatePassword = () => {
    const [errorMessage, setErrorMessage] = useState("");
    const [formState, setFormState] = useState({
        team_name:"",
        password: ""
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormState({
            ...formState,
            [name]: value
        });

    };

    const handleUpdate = async (event) => {
        event.preventDefault();

        const team_name = document.getElementById("team_name").value.trim();
        const password = document.getElementById("password").value.trim();

        if (team_name && password) {
            setIsLoading(true);
            let currentOrigin = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_prodOrigin : "http://localhost:5000";
            await fetch(`${currentOrigin}/api/owners`, {
                method: "put",
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
                const ownerData = data[1][0];
                localStorage.setItem("current_user", JSON.stringify(ownerData));
                localStorage.setItem("current_league", JSON.stringify(ownerData.primary_league_id));
                setIsLoading(false);
                document.location.replace("/dashboard");
            }).catch((err) => {
                setIsLoading(false);
                setErrorMessage("Either your team name is not correct or password is not at least 8 characters. Try again.");
            });
        }
        else {
            setErrorMessage("Make sure you have both fields populated! Password must be at least 8 characters.");
        }
    };

    return (
        <main>
            {isLoading ?
                <div>
                    <Spinner variant='danger'></Spinner> 
                </div>
            :
                <form id='password-update' onSubmit={handleUpdate} autoComplete='off'>
                    <h2>Update password below</h2>
                    
                    <DangerAlert message={errorMessage} />
                    
                    <label htmlFor='team_name'>Team Name:</label>
                    <input id="team_name" name="team_name" type='text' onChange={handleChange} />

                    <label htmlFor='password'>Password:</label>
                    <input id='password' name="password" type='password' onChange={handleChange} />

                    <button type='submit'>Submit</button>
                </form>
            }
        </main>
    )

};

export default UpdatePassword;