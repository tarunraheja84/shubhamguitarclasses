import React, {useState} from 'react'
import {useNavigate} from 'react-router-dom'
import EyePassword from './EyePassword'
import '../css/logout.css'

function AdminLogout() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const navigate=useNavigate()
  const logoutSingle= async()=>{
      try{
          await fetch(`${process.env.REACT_APP_API}/logoutAdmin`,{
          method:"POST",
          headers:{
            Accept:"application/json",
            "Content-Type":"application/json"
          },
          body:JSON.stringify({mytoken:localStorage.getItem('jwtAdmin')})
          // credentials:"include"
        })
        localStorage.removeItem("jwtAdmin")
        navigate('/')
        window.location.reload()
      }
      catch(err){
        console.log(err)
      }
  }
  const logoutAllAdminDevices= async()=>{
    try{
        await fetch(`${process.env.REACT_APP_API}/logoutAllAdminDevices`,{
        method:"POST",
        headers:{
          Accept:"application/json",
          "Content-Type":"application/json"
        },
        body:JSON.stringify({mytoken:localStorage.getItem('jwtAdmin')})
        // credentials:"include"
      })
      localStorage.removeItem("jwtAdmin")
      navigate('/')
      window.location.reload()
    }
    catch(err){
      console.log(err)
    }
}
  const updateAdminPassword = async (e) => {
    e.preventDefault()

      if(password!==confirmPassword){
        window.alert("passwords do not match")
      }
    try {
       const mytoken=localStorage.getItem('jwtAdmin')
       const response=await fetch(`${process.env.REACT_APP_API}/updateAdminPassword`, {
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
    <form  id="password-confirm-form" onSubmit={updateAdminPassword}>
      <h2 id="signup-h2">Change Password</h2>
     
        <div className="form-group">
        <label className="signup-label" htmlFor="password">New Password:</label>
        <EyePassword value={password} onChange={((e)=>setPassword(e.target.value))}/>
      </div>
      <div className="form-group">
        <label className="signup-label" htmlFor="confirm-password">Confirm New Password:</label>
        <EyePassword value={confirmPassword} onChange={(e)=>{setConfirmPassword(e.target.value)}}/>
      </div>
        <div>
        <button  id="signup-button" type="submit">Change Password</button>
        </div>
    </form>
  </div>
    <div className="container">
      <div className="adminLogoutBtn">
      <button className="btn my-2" id="logoutOneBtn" onClick={logoutSingle} type="button">
          Logout
      </button>
      </div>
      <div className="adminLogoutBtn">
      <button className="btn my-2 mx-auto" id="logoutAllBtn" onClick={logoutAllAdminDevices} type="button">
        Logout from all devices
      </button>
      </div>
    </div>
    </>
  )
}

export default AdminLogout
