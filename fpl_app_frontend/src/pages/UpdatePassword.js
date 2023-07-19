import React, { useState } from 'react';

const UpdatePassword = () => {
    const [errorMessage, setErrorMessage] = useState("");
    const [formState, setFormState] = useState({
        team_name:"",
        password: ""
    });

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
            let currentOrigin = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_prodOrigin : "http://localhost:5000";
            const response = await fetch(`${currentOrigin}/api/owners`, {
                method: "put",
                body: JSON.stringify(formState),
                headers: { "Content-Type": "application/json"}
            })

            const data = await response.json();
            const ownerData = data[1][0];
            localStorage.setItem("current_user", JSON.stringify(ownerData));

            if (response.ok) {
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
            <form onSubmit={handleUpdate} autoComplete='off'>
                <h2>Update password below</h2>
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

export default UpdatePassword;