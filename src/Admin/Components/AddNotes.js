import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {pdfjs} from 'react-pdf';
import Spinner from './Spinner'
import '../css/addNotes.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

function AddNotes({progress, setProgress}) {
  const [filename, setFilename] = useState('');
  const [numPages, setNumPages] = useState(0);
  const [notes, setNotes] = useState([]);
  let [chunks, setChunks] = useState([]);

  const navigate=useNavigate()

  const convertFileToChunks=async (base64Data)=>{
    const chunkSize = 1024 * 512;
    const chunks = [];
    for (let i = 0; i < base64Data.length; i += chunkSize) {
      chunks.push(base64Data.slice(i, i + chunkSize));
    }
    return chunks
  }

  async function countPdfPages(pdfUrl) {
    const loadingTask = pdfjs.getDocument(pdfUrl);
    const pdfDocument = await loadingTask.promise;
    const numPages = pdfDocument.numPages;
    setNumPages(numPages)
    return numPages;
  }

  const convertFileToBase64Data = async (file) => {
    const buffer = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async () => {
        const buffer = new Uint8Array(reader.result);
        resolve(buffer);
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });

    const base64Data = btoa(
      new Uint8Array(buffer).reduce((data, byte) => data + String.fromCharCode(byte), '')
    );
    return base64Data;
  };

  const addNotes = async () => {
    setProgress(2)
    let i=0;
    for(const chunk of chunks){
      try {
        const arr=[]
        arr.push(chunk)

        if(i===0){
          i++;
          await fetch(`${process.env.REACT_APP_API}/storeFirstChunk`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              filename: filename,
              numChunks:chunks.length,
              numPages: numPages,
              file: arr,
            }),
          })
        }
        else{
          i++;
          await fetch(`${process.env.REACT_APP_API}/storeOtherChunks`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              filename: filename,
              chunk: chunk,
            }),
          });
        }

        setProgress((i/chunks.length)*100)
        console.log(i===1?`${i} chunk sent`:`${i} chunks sent`);
      } catch (err) {
        console.log(err);
      }
    }
    retrieveNotes()
    window.alert("Notes added successfully")
  };

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

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const base64Data = await convertFileToBase64Data(file);
      setFilename(file.name);
      
      const numPages=await countPdfPages(`data:application/pdf;base64,${base64Data}`)
      setNumPages(numPages)
      const chunks=await convertFileToChunks(base64Data)
      setChunks(chunks)
    }
  };

  const deleteNote = async (filename) => {
    try {
      setProgress(50)
      await fetch(`${process.env.REACT_APP_API}/deleteNote/${filename}`, { method: 'DELETE' });
      const updatedNotesResponse = await fetch(`${process.env.REACT_APP_API}/retrieveNotes`);
      const updatedNotes = await updatedNotesResponse.json();
      setNotes(updatedNotes);
      setProgress(100)
    } catch (err) {
      console.log(err);
    }
  };
  
  return (
    <div>
       {progress !== 100 && <Spinner />}
        <input type="file" onChange={handleFile} />
        <button onClick={() => { if (filename) addNotes() }}>Add File</button>

      <div className="container" id="addNotes-container">
        {notes.length !== 0 && (
          notes.map((note, index) => (
            <div key={index} className="card my-2 mx-2">
              <div className="card-body my-2">
                <h5 className="card-title">{note.filename}</h5>
                <h6>No. of Pages: {note.numPages}</h6>
                <div>
                <Link to={`/viewNotes?filename=${note.filename}`}
                className='btn'
                id="note-btn"
              >
                View Notes
              </Link>
              </div>
              <div>
                <button
                className='btn my-2'
                id="notes-delete-btn"
                onClick={() => {
                  const flag=window.confirm("Are you sure you want to delete?")
                  if(flag)
                    deleteNote(note.filename);
                }}
              >
                Delete
              </button>
              </div>
              </div>
            </div>
          ))
        )}
          {progress===100 && notes.length===0 && <h1 className="addNotes-h1">No Notes to display</h1>}
      </div>
        {progress!=100 &&  <Spinner/>} 
    </div>
  );
}

export default AddNotes;
