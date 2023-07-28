import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Document, Page, pdfjs } from 'react-pdf';
import Spinner from '../Components/Spinner';
import '../css/viewNotes.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
pdfjs.GlobalWorkerOptions.workerPort = null;

function ViewNotes({ progress, setProgress }) {
  const [file, setFile] = useState(null);
  const [arr, setArr] = useState([]);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const filename = queryParams.get('filename');

  function onDocumentSuccess({ numPages }) {
    const pagesArr = [];
    for (let i = 1; i <= numPages; i++) {
      pagesArr.push(i);
    }
    setArr(pagesArr);
  }

  const fetchFile = async () => {
    setProgress(2);
    let numChunks = 0;
    try {
      const response = await fetch(`${process.env.REACT_APP_API}/fetchNumChunks`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ filename: filename }),
      });
      const result = await response.json();
      numChunks = result.numChunks;
    } catch (err) {
      console.log(err);
    }

    let fullFile = '';
    for (let i = 1; i <= numChunks; i++) {
      try {
        const response = await fetch(`${process.env.REACT_APP_API}/fetchChunk?chunkno=${i}`, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ filename: filename }),
        });
        const result = await response.json();

        if (i === 1) {
          setFile(result.file[i - 1]);
        }
        fullFile = fullFile + result.file[i - 1];
      } catch (err) {
        console.log(err);
      }
      setProgress((i / numChunks) * 100);
    }
    setFile(fullFile);
  };

  useEffect(() => {
    fetchFile();
    /* eslint-disable */
  }, []);

  return (
    <>
      <div className="container" id="viewNotescontainer">
        <div>
          {progress !== 100 && <Spinner />}
          {progress !== 100 && <h4 className="viewNotes-h4 text-center my-2">{Math.ceil(progress)}%</h4>}
          <Document file={`data:application/pdf;base64,${file}`} onLoadSuccess={onDocumentSuccess}>
            {arr.map((pageNumber) => (
              <Page key={pageNumber} pageNumber={pageNumber} />
            ))}
          </Document>
        </div>
      </div>
    </>
  );
}

export default ViewNotes;
