import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  axios.defaults.withCredentials = true;
  const BASE_URL = "http://localhost:4000";

  //state for tracking whether user is logged in or not.
  const [login, setLogin] = useState(false);

  
  const [user, setUser] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const handleNameChange = (e) =>{
    setName(e.target.value);
  }

  const handlePassChange = (e) =>{
    setPassword(e.target.value);
  }

  //Get the login state from the backend
  const getLoginState = async () =>{
    const res = await axios.get(`${BASE_URL}/`);
    //Based on 'data.login' update state of login.
    if(res.data.login){
      //If the user is logged in, get the details of the user and set login as true.
      setUser(res.data.user.name);
      setLogin(true);
    }
    else setLogin(false);
  }

  const handleLogin = async () =>{
    //On clicking the 'Login' button, make a post request to '/login' which add 'token' to the cookie and 
    //user will be logged in.
    const res = await axios.post(`${BASE_URL}/login`, {
      name,
      password
    });

    //If the post request sent notRegistered as response it means the 'name' isn't registered yet, so 
    //forward the user to /register so that user can register.
    if(res.data.notRegistered) document.location.replace('http://localhost:3000/register');

    //If password entered by user is incorrect
    else if(res.data.password===false) alert("Wrong Password!");
    //Update the state of 'login'.
    getLoginState();
  }

  const handleLogout = async () =>{
    //On logging out, we want to delete the 'token' cookie.
    await axios.get(`${BASE_URL}/logout`);
    getLoginState();
    //Update the state of 'login'.
  }

  useEffect(()=>{
    //When the component renders, the state of 'login' should be updated. If cookie is present, the user 
    // should be logged in else logged out.
    getLoginState();
  });

  return (
    <>
      {
        login //If user is logged in, render the Logout button else, the Login button.
        ? (<>
            <p>Hi, {user}</p>
            <button onClick={handleLogout}>Logout</button>
          </>)
        : (<>
            <input type="text" placeholder="Name" value={name} onChange={(e)=>handleNameChange(e)}/>
            <input type="password" placeholder="Password" value={password} onChange={(e)=>handlePassChange(e)}/>
            <button onClick={handleLogin}>Login</button>
          </>)
        }
      </>
  );
}

export default App;
