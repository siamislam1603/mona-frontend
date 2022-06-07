import React from "react";
import { useDropzone } from "react-dropzone";

export default function DropFile({ onChange, setPopupVisible, imageToCrop }) {

  const { getRootProps, getInputProps } =
    useDropzone({
      accept: "image/jpeg, image/png, image/jpg",
      maxFiles: 1,
      multiple: false,
      onDrop: (acceptedFiles) => {
        onChange(acceptedFiles);
        setPopupVisible(true);
      },
    });

  return (
    <div className="file-upload-form">
      <div {...getRootProps({ className: "dropzone" })}>
        <input {...getInputProps()} type="file" name="" />
        <div className="picimg">
          <img src={imageToCrop || "../img/upload.jpg"} alt="" />
        </div>
        <span className="text-center infotxt">
          Upload profile image for this user here
        </span>
      </div>
    </div>
  );
}
