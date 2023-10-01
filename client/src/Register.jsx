import React, { useState } from 'react';
import axios from "axios";

const Register = () => {
  const BASE_URL = "http://localhost:4000";
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const handleNameChange = (e) =>{
    setName(e.target.value);
  }

  const handlePassChange = (e) =>{
    setPassword(e.target.value);
  }

  const handleRegister = async () =>{
    //Make post request so database will store credentials for the new user.
    await axios.post(`${BASE_URL}/register`, {
      name,
      password
    });
    //After registering the user, forward the user to '/' so that the user can login with the registered details.
    document.location.replace("http://localhost:3000/");
  }

  return (
    <div>
      Register Here
      <input type="text" placeholder="Name" value={name} onChange={(e)=>handleNameChange(e)}/>
      <input type="password" placeholder="Password" value={password} onChange={(e)=>handlePassChange(e)}/>
      <button onClick={handleRegister}>Register</button>
    </div>
  )
}

export default Register
