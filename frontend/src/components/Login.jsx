import React, {useState, useContext} from "react";
import {UserContext} from "../context/UserContext";
import axios from "axios";
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';

function Login(props) {

  const [user, setUser] = useState({username:"", password:""});
  const [userContext, setUserContext] = useContext(UserContext);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");


  function handleChange(event) {
    setUser({...user, [event.target.name]:event.target.value});
  }


  //Login handler
  async function loginAction(event) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(""); 
    try {
      const res = await axios.post(process.env.REACT_APP_API_ENDPOINT+"user/login", JSON.stringify(user), {headers: { "Content-Type": "application/json" }});
      const data = res.data;
      setUserContext(prev => {
            return { ...prev, token: data.token, details: data }
      })
    }
    catch(err) {
      setIsSubmitting(false);
      ({...err}.response.status === 401)?setError("User name or Password incorrect!"):setError("Other Error");
    }

  }
  

  return (
    <div>
      {error}
    <div className="field grid">
      <label htmlFor="username" className="col-fixed" >User Name:</label>
        <div className="col">
        <InputText id="username" name="username" value={user.username} onChange={handleChange}/>
        </div>
    </div>
    <div className="field grid">
      <label htmlFor="password" className="col-fixed" >Password</label>
      <div className="col">
        <Password id="password" name="password" value={user.password} onChange={handleChange}/>
      </div>
    </div>
    <div className="field grid">
      <Button label="Login" icon="pi pi-check" iconPos="right" onClick={loginAction}/>
    </div>
    </div>
  )
}

export default Login;
