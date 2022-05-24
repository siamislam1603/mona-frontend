import React from "react";
import { useDropzone } from "react-dropzone";

export default function DragDropSingle(props) {
  const { getRootProps, getInputProps } =
    useDropzone({
      accept: "image/jpeg, image/png",
      maxFiles: 1,
      onDrop: (acceptedFiles) => {
        props.setFile({
          ...props.file,
          file: acceptedFiles,
        });
      },
    });

  return (
    <div className="file-upload-form">
      <div {...getRootProps({ className: "dropzone" })}>
        <input {...getInputProps()} multiple={false} name="profilepic" />
        <div className="picimg">
          <img src="../img/upload.jpg" alt="" />
        </div>
        <span className="text-center infotxt">
          Upload profile image for this user here
        </span>
      </div>
    </div>
  );
}
