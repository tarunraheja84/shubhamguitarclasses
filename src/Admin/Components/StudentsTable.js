import React, { useEffect, useState } from 'react';
import '../css/table.css';

function StudentsTable({setProgress}) {
  const [students, setStudents] = useState([]);

  const fetchStudents = async () => {
    try {
      setProgress(50)
      const response = await fetch(`${process.env.REACT_APP_API}/fetchStudents`);
      const result = await response.json();
      setStudents(result);
      setProgress(100)
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchStudents();
    /*eslint-disable*/
  }, []);

  const deleteStudent = async (phoneno) => {
    try {
      await fetch(`${process.env.REACT_APP_API}/deleteStudent/${phoneno}`, { method: 'DELETE' });
      const updatedStudentsResponse = await fetch(`${process.env.REACT_APP_API}/fetchStudents`);
      const updatedStudents = await updatedStudentsResponse.json();
        setStudents(updatedStudents);
    } catch (err) {
      console.log(err);
    }
  };

  const logoutAllUserDevices= async(name,phoneno)=>{
        try{
            setProgress(50)
            const response=await fetch(`${process.env.REACT_APP_API}/logoutAllUserDevices`,{
            method:"POST",
            headers:{
              Accept:"application/json",
              "Content-Type":"application/json"
            },
            body:JSON.stringify({phoneno:phoneno})
            // credentials:"include"
          })
          setProgress(100)
        }
        catch(err){
          console.log(err)
        }
    }

  return (
    <div className="container" id="studentsTable-container">
      {(students.length !== 0) ? (
        <table className="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Name</th>
              <th scope="col">Address</th>
              <th scope="col">Phone no.</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody>
            {students.map((student, index) => (
              <tr key={index}>
                <th scope="row">{index + 1}</th>
                <td>{student.name}</td>
                <td>{student.address}</td>
                <td>{student.phoneno}</td>
                <td>
                  <button
                    type="button"
                    id="logoutbtn"
                    onClick={() => {
                      const flag=window.confirm(`${student.name} will logout from all devices, are you sure?`)
                      if(flag)
                      logoutAllUserDevices(student.name,student.phoneno)
                    }}
                    className="btn btn-primary"
                  >
                    Logout
                  </button>
                  <button
                    type="button"
                    id="deletebtn"
                    onClick={() => {
                      const flag=window.confirm("Are you sure you want to delete?")
                      if(flag)
                        deleteStudent(student.phoneno);
                    }}
                    className="btn btn-danger my-1"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ):<h1 id="table-h1">No students to display</h1>}
    </div>
  );
}

export default StudentsTable;
