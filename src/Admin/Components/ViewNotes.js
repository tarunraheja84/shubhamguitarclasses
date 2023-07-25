import React, {useEffect, useState} from 'react';
import {useLocation} from 'react-router-dom'
import { Document, Page, pdfjs } from 'react-pdf';
import Spinner from '../Components/Spinner'
import '../css/viewNotes.css'

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

function ViewNotes({progress, setProgress}) {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  let [file,setFile]=useState(null)

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const filename = queryParams.get('filename');

  function onDocumentSuccess({numPages}){
  setNumPages(numPages)
  }
  const prevPage=()=>{
    setPageNumber(pageNumber<=1 ?1: pageNumber-1)
  }
  const nextPage=()=>{
    setPageNumber(pageNumber+1>numPages ?pageNumber: pageNumber+1)
  }

  const fetchFile=async()=>{
    let numChunks=0
    try{
      const response= await fetch(`{process.env.REACT_APP_API}/fetchNumChunks`,{
        method:"POST",
        headers:{
        Accept:"application/json",
        "Content-Type":"application/json"
      },
      body:JSON.stringify({filename:filename})
      })
      const result=await response.json()
      numChunks=result.numChunks
    }
    catch(err){
      console.log(err)
    }
  
    for(let i=1;i<=numChunks;i++){
      try{
        const response= await fetch(`{process.env.REACT_APP_API}/fetchChunk?chunkno=${i}`,{
          method:"POST",
          headers:{
            Accept:"application/json",
            "Content-Type":"application/json"
          },
          body:JSON.stringify({filename:filename})
        })
        const result=await response.json()
        
        if(i===1)
            setFile((result.file)[i-1])
        file=file+(result.file)[i-1];
      }
      catch(err){
        console.log(err)
      }
      setProgress((i/numChunks)*100)
    }
    setFile(file)   
}

  useEffect(()=>{
    fetchFile()
    /* eslint-disable*/
  },[])

  return (
    <>
    <div className="container" id="viewNotescontainer">
        <button className="btn mx-2 viewNotes-btn" type="button" onClick={prevPage}>Previous</button>
      <div>
        {progress!=100 &&  <Spinner/>} 
      <Document file={`data:application/pdf;base64,${file}`} onLoadSuccess={onDocumentSuccess}>
      <Page pageNumber={pageNumber}></Page>
      </Document>
      </div>
        <h6>{pageNumber}/{numPages}</h6>
        <button className="btn mx-2 viewNotes-btn" type="button" onClick={nextPage}>Next</button>
      </div>
    </>
  )
}

export default ViewNotes
