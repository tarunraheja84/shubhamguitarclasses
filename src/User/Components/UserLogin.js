import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import EyePassword from './EyePassword'
import Spinner from './Spinner'
import '../css/login.css';


const UserLogin = ({progress,setProgress}) => {
  const [phoneno, setPhoneno] = useState('');
  const [password, setPassword] = useState('');
  const navigate=useNavigate()
  
  
  const login= async (e)=>{
    if(phoneno.length!==10 && phoneno.length!==13){
      window.alert("Invalid Phone no.")
      return
      }
  
      if(phoneno.length===13 && phoneno[0]!=='+'){
        window.alert("Invalid Phone no.")
        return
      }
    e.preventDefault()
    try{
      setProgress(50)
      const response = await fetch(`${process.env.REACT_APP_API}/login`,{
        method:'POST',
        headers:{
          Accept:"application/json",
          "Content-Type":"application/json"
        },
        body:JSON.stringify({
          phoneno:phoneno,
          password:password
        }),
        // credentials:'include'
      })
      setProgress(70)
      const token=await response.text()
      
      localStorage.setItem("jwt",token)
      setProgress(100)
      if(response.ok){
        navigate('/') 
        window.location.reload()
      }
      else if(response.status===405)
        alert("Someone has already logged into your account from some other device, Contact Tarun (9896079185)")
      else if(response.status===404)
        alert("Invalid login credentials")
      else
        alert("You have not signed up yet")
    }catch(err){
      console.log(err)
    }
  }

  return (
    <>
    {progress!==100 &&  <Spinner/>} 
    {progress!==100 &&  <h4 className="viewNotes-h4 text-center my-2">Please wait, It will take some time</h4>}
    <div className="login-form">
      <form id="login-form" onSubmit={login}>
        <h2 id="login-h2">Login</h2>
        <div className="form-group">
          <label className="login-label" htmlFor="phoneno">Phoneno:</label>
          <input
            type="text"
            id='login-input-phoneno'
            autoComplete="username"
            value={phoneno}
            onChange={(e)=>{setPhoneno(e.target.value)}}
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
          <p id="login-p-signup">
            Want to take admission? <Link className="login-a" to="/userSignup">Click Here</Link>
          </p>
          <p id="login-p-admin">
          <Link className="login-a" to="/adminLogin">Recruiter Login as admin</Link>
          </p>
          <div className="d-flex justify-content-center"><a className="login-a-tarun" href="https://drive.google.com/file/d/1ojZ285e2j5kfzoCFGpn0xjF6uLKN8nEQ/view?usp=drivesdk">Created By Tarun</a></div>
          {/* <p>
            <Link className="login-a" to="">Forgot password?</Link>
          </p> */}
        </div>
      </form>
    </div>
    </>
  );
};
export default UserLogin;
