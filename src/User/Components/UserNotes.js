import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Spinner from './Spinner'

function AddNotes({progress, setProgress}) {
  const [notes, setNotes] = useState([]);

  const retrieveNotes = async () => {
    setProgress(50)
    const response = await fetch(`${process.env.REACT_APP_API}/retrieveNotes`);
    const result = await response.json();
    setNotes(result);
    setProgress(100)
  };
  
  useEffect(() => {    
    retrieveNotes();  
    /*eslint-disable*/
  },[]);

  return (
    <div>

      <div className="container" id="addNotes-container">
        {notes.length !== 0 && (
          notes.map((note, index) => (
            <div key={index} className="card my-2 mx-2">
              <div className="card-body my-2">
                <h5 className="card-title">{note.filename}</h5>
                <h6>No. of Pages: {note.numPages}</h6>
                <Link to={`/viewNotes?filename=${note.filename}`}
                className='btn'
                id="note-btn"
              >
                View Notes
              </Link>
              </div>
            </div>
          ))
        )}
          {progress===100 && notes.length===0 && <h1 className="addNotes-h1">No Notes to display</h1>}
      </div>
        {progress!==100 &&  <Spinner/>} 
    </div>
  );
}

export default AddNotes;
