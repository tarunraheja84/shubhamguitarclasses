import React, {useState,useEffect} from 'react'
import '../css/about.css'
import profileImage from '../images/profile.png';

function About({setProgress}) {
  const [adminImage,setAdminImage]=useState(profileImage)

  const updateImage=async ()=>{
    try{
      setProgress(50)
      const response=await fetch(`{process.env.REACT_APP_API}/retrieveFirstAdminInfo`)
      const result=await response.json()
      setAdminImage(`data:image/jpeg;base64,${result.image}`)
      setProgress(100)
    }catch(err){
      console.log(err)
    }
  }

  useEffect(()=>{
    updateImage();
    /*eslint-disable*/
  },[])

  return (
    <div>
      <div className="container">
      <div className="image-wrapper">
        <img
          id="about-profile-img"
          alt="profile-pic"
          src={adminImage}
        />
      </div>
      
    <div className='d-flex my-2' id="about-box">
      <div id="margin-left">
      <h2 className="about-h1">Name:</h2>
      <h2 className="about-h1">From:</h2>
      <h2 className="about-h1">Lives in:</h2>
      <h2 className="about-h1">Studied at:</h2>
      </div>
      <div id="margin-right">
      <h2 className="about-h1">Shubham Wadhwa</h2>
      <h2 className="about-h1">Panipat</h2>
      <h2 className="about-h1">Gurgaon</h2>
      <h2 className="about-h1">N.C. College of Engg.</h2>
      </div>
    </div>
    </div>
      </div>
  )
}

export default About
