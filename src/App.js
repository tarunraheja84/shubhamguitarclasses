import React from 'react';
import { BrowserRouter as Router, Routes , Route } from 'react-router-dom';
import {useState,useEffect} from 'react';
import LoadingBar from 'react-top-loading-bar'

//admin Components
import AdminHome from "./Admin/Components/AdminHome";
import AdminLogin from "./Admin/Components/AdminLogin";
import AdminNavbar from "./Admin/Components/AdminNavbar";
import AdminProfile from "./Admin/Components/AdminProfile";
import StudentsTable from "./Admin/Components/StudentsTable";
import AdminLogout from "./Admin/Components/AdminLogout";
import AddNotes from "./Admin/Components/AddNotes";
import ViewNotes from "./Admin/Components/ViewNotes";


//user Components
import UserHome from "./User/Components/UserHome"
import UserLogin from "./User/Components/UserLogin"
import UserNavbar from "./User/Components/UserNavbar"
import UserProfile from "./User/Components/UserProfile"
import UserSignup from "./User/Components/UserSignup"
import UserLogout from "./User/Components/UserLogout"
import UserNotes from "./User/Components/UserNotes"
import About from "./User/Components/About"

//other Components
import Extra from "./Admin/Components/Extra"


function App() {
  const [authenticated, setAuthenticated] = useState(false); 
  const [admin, setAdmin] = useState(false);
  const [progress,setProgress] =useState(0);

  const isAuthenticated = async () => {
    try {
      const response = await fetch(`{process.env.REACT_APP_API}/isAuthenticated`, {
        method: 'POST',
        headers:{
          Accept:"application/json",
          "Content-Type":"application/json"
        },
        body: JSON.stringify({ mytoken:localStorage.getItem("jwt") }),
        // credentials: 'include'
      });
      const result=await response.text()

      if (result==="authenticated user") {
        setAuthenticated(true); 
      } else {
        setAuthenticated(false); 
        localStorage.removeItem("jwt")
      }
    } catch {
      setAuthenticated(false); 
      localStorage.removeItem("jwt")
    }
  };
  const isAdmin = async () => {
    try {
      const response = await fetch(`{process.env.REACT_APP_API}/isAdmin`, {
        method: 'POST',
        headers:{
          Accept:"application/json",
          "Content-Type":"application/json"
        },
        body: JSON.stringify({ mytoken:localStorage.getItem("jwtAdmin") }),
        // credentials: 'include'
      });
      const result=await response.text()

      if (result==="admin authenticated") {
        setAdmin(true); 
      } else {
        setAdmin(false); 
        localStorage.removeItem("jwtAdmin")
      }
    } catch {
      setAdmin(false); 
      localStorage.removeItem("jwtAdmin")
    }
  };

  
  useEffect(() => {
    setProgress(50)
    isAuthenticated(); 
    isAdmin();
    setProgress(100)
  }, []); 

  if(admin){
    return (
      <Router>
      <AdminNavbar />
      <LoadingBar
        color='burlywood'
        position='sticky'
        progress={progress} 
      />
      <Routes>
        <Route exact path="/" element={<AdminHome/>} />
        <Route exact path="/viewStudents" element={<StudentsTable setProgress={setProgress}/>} />
        <Route exact path="/adminProfile" element={<AdminProfile setProgress={setProgress}/>} />
        <Route exact path="/addNotes" element={<AddNotes progress={progress} setProgress={setProgress}/>} />
        <Route exact path="/viewNotes" element={<ViewNotes progress={progress} setProgress={setProgress}/>} />
        <Route exact path="/adminLogout" element={<AdminLogout/>} />
        <Route exact path="*" element={<Extra/>} />
      </Routes>
    </Router>
    );
  }
  else if(authenticated){
    return (
      <Router>
      <UserNavbar />
      <LoadingBar
        color='burlywood'
        progress={progress} 
      />
      <Routes>
        <Route exact path="/" element={<UserHome setProgress={setProgress}/>} />
        <Route exact path="/userProfile" element={<UserProfile setProgress={setProgress}/>} />
        <Route exact path="/about" element={<About setProgress={setProgress}/>} />
        <Route exact path="/userSettings" element={<UserLogout setProgress={setProgress}/>} />
        <Route exact path="/userNotes" element={<UserNotes progress={progress} setProgress={setProgress}/>} />
        <Route exact path="/viewNotes" element={<ViewNotes progress={progress} setProgress={setProgress}/>} />
        <Route exact path="*" element={<Extra/>} />
      </Routes>
    </Router>
    );
  }
  else{
    return (
      <Router>
      <LoadingBar
        color='burlywood'
        progress={progress} 
      />
      <Routes>
        <Route exact path="/" element={<UserLogin progress={progress} setProgress={setProgress}/>} />
        <Route exact path="/adminLogin" element={<AdminLogin progress={progress} setProgress={setProgress}/>} />
        <Route exact path="/userSignup" element={<UserSignup progress={progress} setProgress={setProgress}/>} />
        <Route exact path="*" element={<UserLogin progress={progress} setProgress={setProgress}/>} />
      </Routes>
    </Router>
    );
  }
}

export default App;
