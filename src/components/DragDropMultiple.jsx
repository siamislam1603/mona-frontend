import React, { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Link } from 'react-router-dom';

export default function DropAllFile({ onSave,Files }) {
 
  const [data, setData] = useState([]);
  const [theFiles,setTheFiles] = useState();
  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    acceptedFiles.forEach(file => {
      setData(prevState => [...prevState, file]);
    });
  }, []);
   

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    maxFiles: 5,
    multiple: true,
  });

  const handleFileDelete = (file) => {
    let temp = [...data];
    temp.splice(temp.indexOf(file), 1);
    setData(temp);
  }
  const handleDelete =(file) =>{
    console.log("The file e4",file)
    let temp = [...theFiles];
    temp.splice(temp.indexOf(file), 1);
    setTheFiles(temp);
    console.log("The",theFiles.length)

    if(theFiles.length<2){
      setTheFiles(null)
      console.log("The new lenght",theFiles.length)
    }
  }

  useEffect(() => {
    onSave(data);
  }, [data]);
  useEffect(() =>{
    setTheFiles(Files)
  },[Files])
  return (
    <div className="file-upload-form mt-3">
      <div {...getRootProps({ className: 'dropzone' })}>
        <input {...getInputProps()} />
        <span className="text-center uploadfile cursor" style={{ display: 'inline-block', marginBottom: '10px' }}>
          <img src="../img/bi_cloud-upload.png" className="me-2" alt="" /> Add
          Files
        </span>
      </div>

      {theFiles ? (
         <div className="showfiles">
         <ul>
           {
             theFiles.map((file, index) => (
               <li className="mt-3" key={index}>
                 <p>{file.path}</p>
                 {file.id}
                 <span className="ms-2">
                   <Link to="#" onClick={() => handleDelete(file)}>
                       <img src="../img/removeIcon.svg" alt="" />
                   </Link>
                 </span>
               </li>
             ))
           }
         </ul>
       </div>
      ) : (
        <div className="showfiles">
        <ul>
          {
            data.map((file, index) => (
              <li className="mt-3" key={index}>
                {file.path}
                <span className="ms-2">
                  <Link to="#" onClick={() => handleFileDelete(file)}>
                      <img src="../img/removeIcon.svg" alt="" />
                  </Link>
                </span>
              </li>
            ))
          }
        </ul>
      </div>
      )

      }
      {/* <div className="showfiles">
        <ul>
          {
            data.map((file, index) => (
              <li className="mt-3" key={index}>
                {file.path}
                <span className="ms-2">
                  <Link to="#" onClick={() => handleFileDelete(file)}>
                      <img src="../img/removeIcon.svg" alt="" />
                  </Link>
                </span>
              </li>
            ))
          }
        </ul>
      </div> */}
    </div>
  );
}
