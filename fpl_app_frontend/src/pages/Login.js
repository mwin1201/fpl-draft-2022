import React, { useState } from 'react';
import DangerAlert from '../alerts/FormAlerts/danger';

const Login = () => {
    const [formState, setFormState] = useState({
        team_name: "",
        password: ""
    });
    const [errorMessage, setErrorMessage] = useState("");

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormState({
            ...formState,
            [name]: value
        });
    };

    const handleLogin = async (event) => {
        event.preventDefault();

        const team_name = document.getElementById("team_name").value.trim();
        const password = document.getElementById("password").value.trim();

        if (team_name && password) {
            let currentOrigin = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_prodOrigin : "http://localhost:5000";
            const response = await fetch(`${currentOrigin}/api/owners/login`, {
                method: "post",
                body: JSON.stringify(formState),
                headers: { "Content-Type": "application/json"}
            })

            const data = await response.json();
            localStorage.setItem("current_user", JSON.stringify(data));

            if (response.ok) {
                // let appURL = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_URL : "http://localhost:3000";
                // document.location.replace(`${appURL}/dashboard`);
                document.location.replace("/dashboard");
            }

            else {
                setErrorMessage("Either your team name or password is not correct. Try again.");
            }
        }
        else {
            setErrorMessage("Make sure you have both fields populated!");
        }
    };

    return (
        <section>
            <form className='login-form' onSubmit={handleLogin} autoComplete='off'>
                <h2>Welcome back to FPL Madness</h2>

                <DangerAlert message={errorMessage} />

                <label htmlFor='team_name'>Team Name:</label>
                <input id="team_name" name="team_name" type='text' onChange={handleChange} />

                <label htmlFor='password'>Password:</label>
                <input id='password' name="password" type='password' onChange={handleChange} />

                <button type='submit'>Submit</button>
                <a href='/update'>Forgot your password?</a>
            </form>
        </section>
    )
};

export default Login;