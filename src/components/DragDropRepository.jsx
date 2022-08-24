import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Link } from "react-router-dom";

export default function DragDropRepository({ onChange, setPopupVisible, imageToCrop }) {
  const [myFiles, setMyFiles] = useState([])
  // NEW FUNCTION FOR ME********************************
  // const onDrop = useCallback(acceptedFiles => {
  //   setMyFiles([...myFiles, ...acceptedFiles])
  // }, [myFiles])
  const { acceptedFiles, getRootProps, getInputProps } =
    useDropzone
      ({
        onDrop: (acceptedFiles) => {
          setMyFiles([myFiles, ...acceptedFiles])
          onChange(acceptedFiles);
          setPopupVisible(false);
        },
        maxFiles: 1,
        multiple: false,
        accept: {
          'image/jpeg': ['.jpeg'],
          'image/jpg': ['.jpg'],
          'image/png': ['.png'],
          'text/html': ['.html'],
          'text/htm': ['.html'],
          'text/cvs': ['.cvs'],
          'text/.docx': ['.docx'],
          'text/.xlsx': ['.xlsx'],
          'text/doc': ['.doc'],
          'text/pdf': ['.pdf'],
          'video/mp4': ['video/mp4'],
          'audio/mpeg': ['.audio/mpeg', '.mp3']
        },
        useFsAccessApi: false,
      })
  const removeFile = file => () => {
    const newFiles = [myFiles]
    newFiles.splice(newFiles.indexOf(file), 1)
    setMyFiles(newFiles)
  }
  const files = myFiles.map((file, index) => {
    if (index != 0)
      return <>
        <li key={file.path} className="mt-3">
          {file.path} - {file.size} bytes{" "}
        </li>
        <Link to="#" onClick={removeFile(file)}>
          <img src="../img/removeIcon.svg" alt="" />
        </Link>
      </>
  })
  // NEW FUNCTION FOR ME************************************
  // const { acceptedFiles, getRootProps, getInputProps } =
  //   useDropzone({
  //     onDrop: (acceptedFiles) => {
  //       console.log("get input props---->", getInputProps);
  //       console.log("accept files----?", acceptedFiles);
  //       onChange(acceptedFiles);
  //       setPopupVisible(false);
  //     },
  //     maxFiles: 1,
  //     multiple: false,
  //     accept: '.doc, .pdf, .mp3, .png, .jpg',
  //     useFsAccessApi: false,
  //   });
  // const files = acceptedFiles.map(file => (
  //   <>
  //     <li className="mt-3" key={file.path}>
  //       {file.path} - {file.size} bytes
  //     </li>
  //     <Link to="#" onClick={() => handleFileDelete(file)}>
  //       <img src="../img/removeIcon.svg" alt="" />
  //     </Link>
  //   </>
  // ));
  // const handleFileDelete = (file) => {
  //   alert('Delete', acceptedFiles, file)
  // }
  return (
    <div className="repositorydrag text-center">
      {/* <div {...getRootProps({ className: "dropzone d-block" })} >
        <input {...getInputProps()} type="file" name="setting_file" />
        <div className="text-center uploadfile">
          <span>Please Select a file to share : <br /><span className="btn btn-primary" >Choose File</span> <br /> <small>Accepted file types : doc, pdf, mp3, png, jpg</small></span>
        </div>
      </div>
      <div className="showfiles">
        <ul>{files}</ul>
      </div> */}
      <div {...getRootProps({ className: "dropzone d-block" })}>
        <input {...getInputProps()} type="file" name="setting_file" />
        <div className="text-center uploadfile">
          <span>Please Select a file to share : <br /><span className="btn btn-primary" >Choose File</span> <br /> <small>Accepted file types : doc, pdf, mp3, png, jpg</small></span>
        </div>
      </div>
      <div className="showfiles">
        <ul>{files}</ul>
      </div>
      {/* {files.length > 0 && <button onClick={removeAll}>Remove All</button>} */}
    </div>
  );
}