import React, { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Link } from 'react-router-dom';


let random = () => {}

export default function DropAllFile({ image,onSave, setTrainingData, setErrors, setFetchedCoverImage=random, title="Files" }) {
  
  const [data, setData] = useState([]);
  const [currentURI, setCurrentURI] = useState();
  const [theImage,setTheImage] = useState()

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
      'image/png': ['.png', '.jpg', '.jpeg'],
    },
  });

  const handleFileDelete = (file) => {
    let temp = [...data];
    temp.splice(temp.indexOf(file), 1);
    setData(temp);
  }
  const handleDelete = () =>{
    console.log("Handle Delete")
    setTheImage(null)
  }

  // Converting the current image to BASE-64 URI string,
  // so that it could be used with <Img>:src tag.
  const getBase64 = (file) => {
    let reader = new FileReader(); 
    // console.log("The reader",reader)
    reader.readAsDataURL(file);
    // console.log(reader)
    reader.onload = function () {
      setCurrentURI(reader.result);
    };
  }

  useEffect(() => {
    onSave(data);
    // setErrors(prevState => ({
    //   ...prevState,
    //   coverImage: null
    // }));
    setFetchedCoverImage(null);
    // setTrainingData(prevState => ({
    //   ...prevState,
    //   cover_image: data[0]
    // }))

  }, [data]);
  useEffect(() =>{
    setTheImage(image)
  },[image])
  return (
    <div className="file-upload-form">
      <div {...getRootProps({ className: 'dropzone' })} style={{ width: "110px" }}>
        <input {...getInputProps()} />
        <span className="text-center uploadfile cursor" style={{ display: 'inline-block', marginBottom: '10px' }}>
          <img src="../img/bi_cloud-upload.png" className="me-2" alt="" /> Add {title}
        </span>
      </div>
      
     {/* {
      theImage ? (
        <div className="showfiles">
        
          {
              <div className="mt-3">
                <img src={theImage} style={{ maxWidth: "150px", height: "auto" }} alt="cover_file 1" />
                <span className="ms-2">
                  <Link to="#" onClick={() => handleDelete()}>
                      <img src="../img/removeIcon.svg" alt="" />
                  </Link>
                </span>
              </div>
            
          }
     
      </div>
      ):( */}
        <div className="showfiles">
        <ul>
          {
            data.map((file, index) => (
              <li className="mt-3" key={index}>
                <img src={getBase64(file) || currentURI ||image} style={{ maxWidth: "150px", height: "auto" }} alt="cover_file" />
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

