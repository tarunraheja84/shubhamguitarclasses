import React from 'react';
import '../css/home.css';

function UserHome() {
  return (
    <div className="container" id="userHome-container">
      <div className="image-container">
        <div className="text-container">
          <h1 id="home-h1">Learn Guitar with a chance to play Live</h1>
          <h3 id="home-h3">Model Town, Near Shivaji Stadium, Panipat</h3>
        </div>
        <div>
        <img className="rounded-image left-image" src={require("../images/guitarist.jpg")} alt="guitarist 1" />
        <img className="rounded-image right-image" src={require("../images/guitarist2.jpg")} alt="guitarist 2" />
        </div>
      </div>
    </div>
  );
}

export default UserHome;
