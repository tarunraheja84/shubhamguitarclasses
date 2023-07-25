import React, {useState} from 'react'
import {useNavigate} from 'react-router-dom'
import EyePassword from './EyePassword'
import '../css/logout.css'

function UserLogout() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [OTP, setOTP] = useState('');

  const navigate=useNavigate()
  const logoutUser= async()=>{
      try{
          await fetch(`${process.env.REACT_APP_API}/logoutUser`,{
          method:"POST",
          headers:{
            Accept:"application/json",
            "Content-Type":"application/json"
          },
          body:JSON.stringify({mytoken:localStorage.getItem('jwt')})
          // credentials:"include"
        })
        localStorage.removeItem("jwt")
        navigate('/')
        window.location.reload()
      }
      catch(err){
        console.log(err)
      }
  }

  const updateUser = async (e) => {
    e.preventDefault()

      if(password!==confirmPassword){
        window.alert("passwords do not match")
      }
    try {
       const mytoken=localStorage.getItem('jwt')
       const response=await fetch(`${process.env.REACT_APP_API}/updateUserPassword`, {
        method: 'post',
        headers:{
          Accept:"application/json",
          "Content-Type":"application/json"
        },
        body: JSON.stringify({token:mytoken, password:password}),
        // credentials:'include'
      });

      if(response.ok){
        alert('Password Changed successfully');
        setPassword('')
        setConfirmPassword('')
        setOTP('')
      }
      else
        alert("Some error occurred")
    } catch (err) {
      console.log(err);
    }
  };
  
  return (
    <>
    <div className="my-2">
    <form  id="password-confirm-form" onSubmit={updateUser}>
      <h2 id="signup-h2">Change Password</h2>
     
        <div className="form-group">
        <label className="signup-label" htmlFor="password">New Password:</label>
        <EyePassword value={password} onChange={((e)=>setPassword(e.target.value))}/>
      </div>
      <div className="form-group">
        <label className="signup-label" htmlFor="confirm-password">Confirm New Password:</label>
        <EyePassword value={confirmPassword} onChange={(e)=>{setConfirmPassword(e.target.value)}}/>
      </div>
      <div className="form-group">
          <label className="signup-label" htmlFor="password">Fees Paid Confirmation OTP:</label>
          <EyePassword value={OTP} onChange={((e)=>setOTP(e.target.value))}/>
        </div>
        <div>
        <button  id="signup-button" type="submit">Change Password</button>
        </div>
    </form>
  </div>
    <div className="container" id="userLogoutBtn">
      <button className="btn my-2 userLogoutBtn" onClick={logoutUser} type="button">
          Logout
        </button>
    </div>
    </>
  )
}

export default UserLogout
