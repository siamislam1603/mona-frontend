import React from "react";
import { useDropzone } from "react-dropzone";

export default function DragDropRepository({ onChange, setPopupVisible, imageToCrop }) {
  const { acceptedFiles, getRootProps, getInputProps } =
    useDropzone({
      onDrop: (acceptedFiles) => {
        console.log("get input props---->", getInputProps);
        console.log("accept files----?", acceptedFiles);
        onChange(acceptedFiles);
        setPopupVisible(false);
      },
      maxFiles: 1,
      multiple: false,
      accept: '.doc, .pdf, .mp3, .png, .jpg',
      useFsAccessApi: false,
    });

  const Delete = () => {
   return acceptedFiles = ""
  }

  const files = acceptedFiles.map(file => (
    <>
      <li className="mt-3" key={file.path}>
        {file.path} - {file.size} bytes
      </li>
      <span className="ms-2">
        <a href="javascipt:void(0)" onClick={Delete}>
          <img src="../img/removeIcon.svg" alt="" />
        </a>
      </span >
    </>
  ));

  return (
    <div className="repositorydrag text-center">
      <div {...getRootProps({ className: "dropzone d-block" })} >
        <input {...getInputProps()} type="file" name="setting_file" />
        <div className="text-center uploadfile">
          <span>Please Select a file to share : <br /><span className="btn btn-primary" >Choose File</span> <br /> <small>Accepted file types : doc, pdf, mp3, png, jpg</small></span>
        </div>
      </div>
      <div className="showfiles">
        <ul>{files}</ul>
      </div>
    </div>
  );
}
