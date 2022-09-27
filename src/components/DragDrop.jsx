import React, { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Link } from 'react-router-dom';



let random = () => { }

const fileSize = (file) =>{
  // console.log("The file",file)
  if(file.type > 10 * 1048576){
    return {
      message: "Image shoudldn't be larger than 10 MB"
    }
  }
  return null
}
export default function DropAllFile({ image, onSave, setTrainingData, setErrors, setFetchedCoverImage = random, title = "Image" , setUploadError = () => {} }) {

  const [data, setData] = useState([]);
  const [currentURI, setCurrentURI] = useState();
  const [theImage, setTheImage] = useState()

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    // acceptedFiles.forEach(file => {
    //   setData(file);
    // });
    setData(acceptedFiles)
  }, []);

  const { getRootProps, getInputProps,fileRejections } = useDropzone({
    onDrop,
    maxFiles: 1,
    multiple: false,
    accept: {
      'image/png': ['.png', '.jpg', '.jpeg'],
    },
    validator:fileSize
  });

  const handleFileDelete = (file) => {
    let temp = [...data];
    temp.splice(temp.indexOf(file), 1);
    setData(temp);
  }
  const handleDelete = () => {
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
  const fileRejectionItems = fileRejections.map(({ file, errors }) => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
      <ul>
        {errors.map(e => (
          <li key={e.code}>{e.message}</li>
        ))}
      </ul>
    </li>
  ));

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
  useEffect(() => {
    setTheImage(image)
  }, [image])
  useEffect(() => {
    let rejectionArray = fileRejections.map(d => ({
      error: d.errors.map(e => e)
    }));
    console.log(rejectionArray);
    setUploadError(rejectionArray);
  }, [fileRejections]);
  return (
    <div className="file-upload-form">
      <div {...getRootProps({ className: 'dropzone' })}>
        <input {...getInputProps()} />
        <span className="text-center uploadfile cursor">
          <img src="../img/bi_cloud-upload.png" className="me-2" alt="" /> Add {title}
        </span>
      </div>
      <div className="showfiles">
        <ul>
          {
            data.map((file, index) => (
              <li className="mt-3" key={index}>
                <img src={getBase64(file) || currentURI || image} style={{ maxWidth: "150px", height: "auto" }} alt="cover_file" />
                <span className="ms-2">
                <ul>{fileRejectionItems}</ul>

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

