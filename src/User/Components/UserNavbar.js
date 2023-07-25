import React from 'react'
import { Link } from "react-router-dom";
import '../css/navbar.css'

function UserNavbar() {
  return (
    <div>
      <nav id="navbar-nav" className="navbar navbar-expand-lg">
  <div className="container-fluid">
    <a className="navbar-brand text-white" id="shubham-name" href="/">Shubham's Guitar Classes</a>
    <button id="submitBtn" className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
    <span className="navbar-toggler-icon row-sm"></span>
      </button>
    <div className="collapse navbar-collapse" id="navbarSupportedContent">
      <ul className="navbar-nav me-auto mb-2 mb-lg-0">
        <li className="nav-item navbar-li">
          <Link className="nav-link active text-white" aria-current="page" to="/">Home</Link>
        </li>
        <li className="nav-item navbar-li">
          <Link className="nav-link active text-white" aria-current="page" to="/about">About Tutor</Link>
        </li>
        <li className="nav-item navbar-li">
          <Link className="nav-link active text-white" to="/userNotes">View Notes</Link>
        </li>
        <li className="nav-item navbar-li">
          <Link className="nav-link active text-white" to="/userProfile">My Profile</Link>
        </li>
        <li className="nav-item navbar-li">
          <Link className="nav-link active text-white" to="/userSettings">Settings</Link>
        </li>
      </ul>
    </div>
  </div>
</nav>
    </div>
  )
}

export default UserNavbar
