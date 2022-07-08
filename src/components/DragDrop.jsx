import React, { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Link } from 'react-router-dom';

export default function DropAllFile({ onSave, setTrainingData }) {
  
  const [data, setData] = useState([]);
  const [currentURI, setCurrentURI] = useState();

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    acceptedFiles.forEach(file => {
      setData(prevState => [...prevState, file]);
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
    // setTrainingData(prevState => ({
    //   ...prevState,
    //   cover_image: data[0]
    // }))
  }, [data]);

  return (
    <div className="file-upload-form mt-3">
      <div {...getRootProps({ className: 'dropzone' })}>
        <input {...getInputProps()} />
        <span className="text-center uploadfile cursor">
          <img src="../img/bi_cloud-upload.png" className="me-2" alt="" /> Add
          Files
        </span>
      </div>
      
      <div className="showfiles">
        <ul>
          {
            data.map((file, index) => (
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

