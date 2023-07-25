import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import EyePassword from './EyePassword';
import Spinner from './Spinner'
import '../css/login.css';


const AdminLogin = ({progress,setProgress}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const navigate=useNavigate()
  
  const login= async (e)=>{
    e.preventDefault()
    setProgress(50)
    try{
      const response = await fetch(`{process.env.REACT_APP_API}/loginAdmin`,{
        method:'POST',
        headers:{
          Accept:"application/json",
          "Content-Type":"application/json"
        },
        body:JSON.stringify({
          email:email,
          password:password
        }),
        // credentials:'include'
      })
      const token=await response.text()
      localStorage.setItem("jwtAdmin",token)
      setProgress(100)
      if(response.ok){
        navigate('/') 
        window.location.reload()
      }
      else
        alert("Invalid login credentials")
    }catch(err){
      console.log(err)
    }
  }

  return (
    <>
    {progress!==100 &&  <Spinner/>} 
    <div className="login-form">
      <form id="login-form" onSubmit={login}>
        <h2 id="login-h2">Admin Login</h2> 
        <div className="form-group">
          <label className="login-label" htmlFor="email">Email:</label>
          <input
            type="email"
            id='login-input-email'
            autoComplete="username"
            value={email}
            onChange={(e)=>{setEmail(e.target.value)}}
            required
          />
        </div>      
        <div className="form-group">
          <label className="login-label" htmlFor="password">Password:</label>
          <EyePassword value={password} onChange={(e)=>{setPassword(e.target.value)}}/>
        </div>
          <div>
          <button id="login-button" type="submit" >Login</button>
          </div>
        <div className="form-group">
          <p></p>
          <p>
          <Link className="login-a" to="/">Login as user</Link>
          </p>
          {/* <p>
            <Link className="login-a" to="">Forgot password?</Link>
          </p> */}
        </div>
      </form>
    </div>
    </>
  );
};
export default AdminLogin;
