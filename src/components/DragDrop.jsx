import React from 'react';
import { useDropzone } from 'react-dropzone';

export default function DropAllFile({ onChange }) {
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    maxFiles: 1,
    multiple: false,
    onDrop: (acceptedFiles) => {
      onChange(acceptedFiles);
    },
  });
  const files = acceptedFiles.map((file) => (
    <li className="mt-3" key={file.path}>
      {file.path} - {file.size} bytes
      <span className="ms-2">
        <a href="">
          <img src="../img/removeIcon.svg" alt="" />
        </a>
      </span>
    </li>
  ));

  return (
    <div className="file-upload-form mt-3">
      <div {...getRootProps({ className: 'dropzone' })}>
        <input {...getInputProps()} type="file" name="" />
        <span className="text-center uploadfile">
          <img src="../img/bi_cloud-upload.png" className="me-2" alt="" /> Add
          Files
        </span>
       
      </div>
      <div className="showfiles">
          <ul>{files.name}</ul>  
          <aside style={thumbsContainer}>{thumbs}</aside> 
          
        </div>


    </div>
  );
}
const thumb = {
  display: "flex",

};
const thumbInner = {
  display: "flex",
  alignItems: "baseline"
 
};

const img = {
  display: "block",
  width: "150px",
  height: "100px",
  objectFit: "contain"
};
const thumbsContainer = {
  display: "flex",
  flexDirection: "row",
  flexWrap: "wrap",
  marginTop: 16
};

const button = {
  width: "20px",
  height: "20px",
  marginLeft: "20px"

}