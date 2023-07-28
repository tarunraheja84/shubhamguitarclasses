import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import EyePassword from '../../Admin/Components/EyePassword'
import Spinner from './Spinner'
import '../css/signup.css';

const UserSignup = ({progress,setProgress}) => {
  const [fname, setFname] = useState('');
  const [address, setAddress] = useState('');
  const [phoneno, setPhoneno] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [OTP, setOTP] = useState('4193');

  const addUser = async (e) => {
    e.preventDefault()

    if(phoneno.length!==10 && phoneno.length!==13){
      window.alert("Invalid Phone no.")
      return
      }

      if(phoneno.length===13 && phoneno[0]!=='+'){
        window.alert("Invalid Phone no.")
        return
      }

      if(password!==confirmPassword){
        window.alert("passwords do not match")
        return
      }
    try {
      setProgress(50)
       const response=await fetch(`${process.env.REACT_APP_API}/userSignup`, {
        method: 'post',
        headers:{
          Accept:"application/json",
          "Content-Type":"application/json"
        },
        body: JSON.stringify({name: fname, address: address, phoneno: phoneno, password:password, confirmPassword:confirmPassword, OTP:OTP }),
        // credentials:'include'
      });
      const token=await response.text()
      localStorage.setItem("jwt",token)
      setProgress(100)
      if(response.ok){
        alert('You have signed up successfully. Please Login');
      }
      else
        alert("You have already signed up")
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
    {progress!==100 &&  <Spinner/>} 
    {progress!==100 &&  <h4 className="userSignup-h4 text-center my-2">Please wait, It will take some time</h4>}
    <div className="signup-form my-5">
      <form  id="signup-form" onSubmit={addUser}>
        <h2 id="signup-h2">Sign Up</h2>
       
        <div className="form-group">
            <label htmlFor="fname" className="form-label">
              Name:
            </label>
            <input
              type="text"
              value={fname}
              onChange={(e) => {
                setFname(e.target.value);
              }}
              className="form-control form-input"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="address" className="form-label">
              Address:
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => {
                setAddress(e.target.value);
              }}
              className="form-control form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="phoneno" className="form-label">
              Phoneno:
            </label>
            <input
              type="text"
              value={phoneno}
              onChange={(e) => {
                setPhoneno(e.target.value);
              }}
              className="form-control form-input"
              required
            />
          </div>
          <div className="form-group">
          <label className="signup-label" htmlFor="password">Password:</label>
          <EyePassword value={password} onChange={((e)=>setPassword(e.target.value))}/>
        </div>
        <div className="form-group">
          <label className="signup-label" htmlFor="confirm-password">Confirm Password:</label>
          <EyePassword value={confirmPassword} onChange={(e)=>{setConfirmPassword(e.target.value)}}/>
        </div>
        <div className="form-group">
          <label className="signup-label" htmlFor="password">Fees Paid Confirmation OTP:</label>
          <EyePassword value={OTP} onChange={((e)=>setOTP(e.target.value))}/>
        </div>
          <div>
          <button  id="signup-button" type="submit">Sign Up</button>
          </div>
        <div className="form-group">
          <p className="userSignup-a">
            Already have an account? <Link className="signup-a" to="/">Log in</Link>
          </p>
        </div>
      </form>
    </div>
    </>
  );
};

export default UserSignup;
