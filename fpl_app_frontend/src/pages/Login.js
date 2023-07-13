import React, { useState } from 'react';

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
            const response = await fetch("http://localhost:5000/api/owners/login", {
                method: "post",
                body: JSON.stringify(formState),
                headers: { "Content-Type": "application/json"}
            })

            const data = await response.json();
            localStorage.setItem("current_user", JSON.stringify(data));

            if (response.ok) {
                document.location.replace("/dashboard");
            }

            else {
                alert("Either your team name or password is not correct. Try again.");
            }
        }
        else {
            alert("Make sure you have both fields populated!");
        }
    };

    return (
        <section>
            <form onSubmit={handleLogin} autoComplete='off'>
                <h2>Welcome back to FPL Madness</h2>
                {errorMessage && <p>{errorMessage}</p>}

                <label htmlFor='team_name'>Team Name:</label>
                <input id="team_name" name="team_name" type='text' onChange={handleChange} />

                <label htmlFor='password'>Password:</label>
                <input id='password' name="password" type='password' onChange={handleChange} />

                <button type='submit'>Submit</button>
            </form>
        </section>
    )
};

export default Login;