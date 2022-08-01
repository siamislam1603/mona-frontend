import React, { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Link } from 'react-router-dom';

export default function DragDropSingle({ onSave, setPopupVisible, croppedImage, setCroppedImage, fetchedPhoto="" }) {
  
  const [data, setData] = useState([]);
  const [currentURI, setCurrentURI] = useState();

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    acceptedFiles.forEach(file => {
      setData(prevState => [...prevState, file]);
      setPopupVisible(true);
    });
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    maxFiles: 1,
    multiple: false,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg'],
    },
  });

  const handleFileDelete = (file) => {
    let temp = [...data];
    temp.splice(temp.indexOf(file), 1);
    setData(temp);
  }

  // Converting the current image to BASE-64 URI string,
  // so that it could be used with <Img>:src tag.
  const getBase64 = (file) => {
    let reader = new FileReader(); 
    reader.readAsDataURL(file);
    reader.onload = function () {
      setCurrentURI(reader.result);
    };
  }

  useEffect(() => {
    onSave(data);
  }, [data]);

  useEffect(() => {
    if(croppedImage) {
      setCurrentURI(croppedImage.src);
      setData([]);
    }
  }, [croppedImage]);

  return (
    <div className="file-upload-form mt-3">
      <div {...getRootProps({ className: 'dropzone' })} style={{ width: "150px" }}>
        <input {...getInputProps()} />
        <div className="picimg">
          {
            (currentURI) ?
            croppedImage ?
              <div className="crop-sec">
                <img src={currentURI} alt="cover_file" />
                <span className="ms-2">
                  <Link to="#" onClick={() => setCroppedImage(null)}>
                      <img src="../img/removeIcon.svg" alt="" />
                  </Link>
                </span>
              </div>
              : data.map((file, index) => (
              <div className="imgcol" key={index}>
                <img src={getBase64(file) || currentURI} alt="" />
                <span className="ms-2">
                  <Link to="#" onClick={() => handleFileDelete(file)}>
                      <img src="../img/removeIcon.svg" alt="" />
                  </Link>
                </span>
              </div>
            )) : <img src={fetchedPhoto || "../img/upload.jpg"} alt="" />
          }
        </div>
        <span className="text-center infotxt">Upload profile image for this user here</span>
      </div>
      
      {/* <div className="showfiles">
        <ul>
          {
            croppedImage ?
              <li className="mt-3">
                <img src={currentURI} style={{ maxWidth: "150px", height: "auto" }} alt="cover_file" />
                <span className="ms-2">
                  <Link to="#" onClick={() => setCroppedImage(null)}>
                      <img src="../img/removeIcon.svg" alt="" />
                  </Link>
                </span>
              </li>
               : data.map((file, index) => (
              <li className="mt-3" key={index}>
                <img src={getBase64(file) || currentURI} style={{ maxWidth: "150px", height: "auto" }} alt="cover_file" />
                <span className="ms-2">
                  <Link to="#" onClick={() => handleFileDelete(file)}>
                      <img src="../img/removeIcon.svg" alt="" />
                  </Link>
                </span>
              </li>
            ))
          }
        </ul>
        </div> */ }
    </div>
  );
}