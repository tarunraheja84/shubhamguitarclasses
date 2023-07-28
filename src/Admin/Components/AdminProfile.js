import React, { useState, useEffect } from 'react';
import profileImage from '../images/profile.png';
import '../css/profile.css';

const AdminProfile = ({setProgress}) => {
  const [base64Data, setBase64Data] = useState(null);
  const [filename, setFilename] = useState('');
  const [src,setSrc]=useState(profileImage)
  const [email,setEmail]=useState('')


  const convertImageToBase64Data = async (file) => {
    const buffer = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const buffer = new Uint8Array(reader.result);
        resolve(buffer);
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });

    const base64Data = btoa(
      new Uint8Array(buffer).reduce(
        (data, byte) => data + String.fromCharCode(byte),
        ''
      )
    );
    setBase64Data(base64Data);
    return base64Data;
  };

  const deleteImage = async () => {
    try {
      await fetch(`${process.env.REACT_APP_API}/deleteAdminImage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          image: base64Data,
        }),
      });
      setSrc(profileImage); 
    } catch (err) {
      console.log(err);
    }
  };

  const updateImage = async () => {
    try {  
      setProgress(50)  
      await fetch(`${process.env.REACT_APP_API}/storeAdminImage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          image: base64Data,
        }),
      });
     
      setBase64Data(base64Data)
      setProgress(100)     
  
      retrieveAdminInfo();
    } catch (err) {
      console.log(err);
    }
  };


  useEffect(()=>{   
      retrieveAdminInfo();
      /*eslint-disable*/
  },[])

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    const base64Data = await convertImageToBase64Data(file); 
    setFilename(file.name);
    setBase64Data(base64Data)
  };

  const retrieveAdminInfo=async ()=>{
    try {
        setProgress(80)
        const token=localStorage.getItem('jwtAdmin')
        const response = await fetch(`${process.env.REACT_APP_API}/retrieveAdminInfo`,{
                method: 'post',
                headers:{
                  Accept:"application/json",
                  "Content-Type":"application/json"
                },
                body:JSON.stringify({mytoken:token})
            }
          );
          const result = await response.json();

          setEmail(result.email)
          if(result.image)
            setSrc(`data:image/jpeg;base64,${result.image}`)
          setProgress(100)
      } catch (err) {
        console.log(err);
      }
  }
  return (
    <div className="container" id="adminProfile-container">
      <div className="image-wrapper">
        <img
          id="profile-img"
          alt="profile-pic"
          src={src}
        />
      </div>
      <h2 className="profile-h1">Shubham Wadhwa</h2>
      <div className="adminInputImage d-flex flex-column align-items-center">
      <input type="file" className="my-2" onChange={handleFileChange}/>
      <div className="my-2">
      <button onClick={()=>{if(filename) updateImage()}}>Update Image</button>
      <button onClick={()=>{ const flag=window.confirm("Are you sure you want to delete?")
                      if(flag) deleteImage()}}> Delete Image</button>
      </div>
      </div>
    </div>
  );
};

export default AdminProfile;

