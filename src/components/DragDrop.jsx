import React from "react";
import { useDropzone } from "react-dropzone";

export default function DropAllFile({ onChange, setPopupVisible, imageToCrop }) {

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
    <div className="file-upload-form mt-3">
      <div {...getRootProps({ className: "dropzone" })}>
        <input {...getInputProps()} type="file" name="" />
        <span className="text-center uploadfile">
          <img src="../img/bi_cloud-upload.png" className="me-2" alt=""/> Add Files
        </span>
        <div className="showfiles">
          <ul>{files}</ul>
        </div>
      </div>
    </div>
  );
}
