import React from "react";
import { useDropzone } from "react-dropzone";

export default function DragDropRepository({ onChange, setPopupVisible, imageToCrop }) {

  const { acceptedFiles, getRootProps, getInputProps } =
    useDropzone({
      maxFiles: 1,
      multiple: false,
      onDrop: (acceptedFiles) => {
        onChange(acceptedFiles);
        setPopupVisible(true);
      },
    });
    const files = acceptedFiles.map(file => (
      <li className="mt-3" key={file.path}>
        {file.path} - {file.size} bytes
        <span className="ms-2"><a href=""><img src="../img/removeIcon.svg" alt=""/></a></span>
      </li>
    ));

  return (
    <div className="repositorydrag">
      <div {...getRootProps({ className: "dropzone" })}>
        <input {...getInputProps()} type="file" name="" />
        <div className="text-center uploadfile">
          <span>Please Select a file to share : <span className="btn btn-primary">Choose File</span> <br/> <small>Accepted file types : doc, pdf, mp3, png, jpg</small></span>
        </div>
        <div className="showfiles">
          <ul>{files}</ul>
        </div>
      </div>
    </div>
  );
}
