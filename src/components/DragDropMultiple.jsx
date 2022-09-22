import React, { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Link } from 'react-router-dom';

const bytesToMegaBytes = bytes => bytes / (1024 ** 2);

function fileSizeValidator(file) {
  let fileType = file.type.split("/")[0];

  if(fileType === 'video') {
    console.log('FILE IS A VIDEO!');
    let fileSize = bytesToMegaBytes(file.size);
    console.log('FILE SIZE:', fileSize);
    if(fileSize > 1024) {
      return {
        code: "file-too-large",
        message: `File shoudldn't be larger than ${1}GB`
      };
    }
  } else if(fileType === 'application') {
    console.log('FILE IS A DOCUMENT!');
    let fileSize = bytesToMegaBytes(file.size);
    console.log('FILE SIZE:', fileSize);
    if(fileSize > 5) {
      return {
        code: "file-too-large",
        message: `File should be less than ${5}MB`
      };
    }
  }

  return null
}

export default function DropAllFile({ onSave, Files, setErrors, title="Files", type="file",  module="usual", fileLimit=5, supportFormDetails=null, setUploadError=() => {} }) {

  let typeObj;

  if(type === "video") {
    typeObj = {
      'video/*': ['.mp4', '.flv', '.mkv']
    }
  } else {
    typeObj = {
      'text/*': ['.pdf', '.doc', '.xlsx', '.xlsm', '.docx', '.ppt', '.ods', '.pptx', '.xls', '.html', '.htm', '.txt']
    }
  }
  
  const [data, setData] = useState([]);
  const [theFiles,setTheFiles] = useState();
  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    acceptedFiles.forEach(file => {
      setData(prevState => [...prevState, file]);
    });
  }, []);
   

  const { getRootProps, getInputProps, fileRejections } = useDropzone({
    onDrop,
    maxFiles: fileLimit,
    multiple: fileLimit === 1 ? false : true,
    accept: typeObj,
    validator: fileSizeValidator
  });

  const handleFileDelete = (file) => {
    let temp = [...data];
    temp.splice(temp.indexOf(file), 1);
    setData(temp);
  }

  const fileRejectionItems = fileRejections.map(({ file, errors }) => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
      <ul>
        {errors.map(e => (
          <li key={e.code}>{e.message}</li>
        ))}
      </ul>
    </li>
  ));

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

  useEffect(() => {
    if(supportFormDetails) {
      setData([]);
    }
  }, [supportFormDetails])
    
  // Setting Errors
  useEffect(() => {
    let rejectionArray = fileRejections.map(d => ({
      error: d.errors.map(e => e)
    }));
    console.log(rejectionArray);
    setUploadError(rejectionArray);
  }, [fileRejections]);

  const getRelatedFileName = (str) => {
      let arr = str.split("/");
      let fileName = arr[arr.length - 1].split("_")[0];
      let ext =arr[arr.length-1].split(".")[1]
      let name = fileName.concat(".",ext)
      return name;
  }

  return (
    <div className="file-upload-form">
      <div {...getRootProps({ className: 'dropzone' })}>
        <input {...getInputProps()} />
        <span className="text-center uploadfile cursor">
          <img src="../img/bi_cloud-upload.png" className="me-2" alt="" /> {module === "user-management" ? "Upload": "Add" } {title}
        </span>
      </div>

      {theFiles ? (
         <div className="showfiles">
         <ul>
           {
             theFiles.map((file, index) => (
               <li className="mt-3" key={index}>
                 <p>{file.path}</p>
                 {getRelatedFileName(file.file)}
                 <span className="ms-2">
                  <ul>{fileRejectionItems}</ul>
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
            data && data?.map((file, index) => (
              <li className="mt-3" key={index}>
                {file.path}
                {/* {file.path} - {file.size} bytes */}
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
