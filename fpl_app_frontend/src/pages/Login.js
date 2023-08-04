import React, { useState } from 'react';
import DangerAlert from '../alerts/FormAlerts/danger';
import Spinner from 'react-bootstrap/Spinner';

const Login = () => {
    const [formState, setFormState] = useState({
        team_name: "",
        password: ""
    });
    const [errorMessage, setErrorMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormState({
            ...formState,
            [name]: value
        });
    };

    const handleLogin = async (event) => {
        event.preventDefault();

        setIsLoading(true);

        const team_name = document.getElementById("team_name").value.trim();
        const password = document.getElementById("password").value.trim();

        if (team_name && password) {
            let currentOrigin = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_prodOrigin : "http://localhost:5000";
            await fetch(`${currentOrigin}/api/owners/login`, {
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
                setIsLoading(false);

                document.location.replace("/dashboard");
    
            }).catch((err) => {
                setIsLoading(false);
                setErrorMessage("There was an issue with the submission. Please try again.");
                err.text().then(message => alert(message));
            });
        }
        else {
            setErrorMessage("Make sure you have both fields populated!");
        }
    };

    return (
        <main>
            <section>
                {isLoading ?
                    <div>
                        <Spinner variant='danger'></Spinner>
                    </div>
                :
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
                }
            </section>
        </main>
    )
};

export default Login;