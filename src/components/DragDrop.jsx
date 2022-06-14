<<<<<<< HEAD
import React,{useState, useEffect} from "react";
import { useDropzone } from "react-dropzone";

export default function DropAllFile({ onChange,  imageToCrop, num,count, setCount }) {
  const [myFiles, setMyFiles] = useState([])
  const [mutliFiles,setMultiFiles] = useState();
  let extensionforimage ="";

  const [extensionforVideo , setVideo] = useState()

  useEffect(() =>{
   
     if(count.length > 1) {
    if(count == " "){
    
    }
    else{
      
      let name = count
      console.log("the name",  name, myFiles)
      if(name.file1){
        console.log("insdie",name.file1)
        extensionforimage = name.file1[0].path.split(".")[1]
        // console.log("The image",extensionforimage)
      }
  
      if(name.file2){
        let ext =name.file2[0].path.split(".")[1]
     
        setVideo(ext.toString())
      }
      if(name.file3){
        let s =""
            for (let i= 0;i<name.file3.length;i++) {
               s = name.file3[i].name.split(".")[1];
              // console.log("The s",s)
              setMultiFiles(s);     
        }
      }
    }
}
  },[myFiles])

  const { acceptedFiles, getRootProps, getInputProps } =
    useDropzone({
    
      maxFiles: (num == 1 ? 1: 5),
      multiple: (num ==1 ? false:true),
      onDrop: (acceptedFiles) => {

        // setCount(prevState => ({
        //   ...prevState,
        //   [acceptedFiles[0].name.split('.')[1]]: acceptedFiles
        // }));
        setCount(acceptedFiles)
        setMyFiles([...myFiles, ...acceptedFiles])
        // setPopupVisible(true);
        // setFIles(acceptedFiles)
        setMyFiles(
          acceptedFiles.map(file =>
            Object.assign(file, {
              preview: URL.createObjectURL(file)
            })
          )
        );
      },
    });
 
    const files = acceptedFiles.map((file, i) => (
      <li key={file.path} className="selected-file-item">
        {/* {file.path}  <button onClick={() => remove(i)}>d</button> */}
      </li>
    ));
    const Para = (file) =>{
      <>
        <p>{file}</p>
      </>
      setVideo(null)
    }
  
   
    const removeFile = file => () => {
      const newFiles = [...myFiles]
      newFiles.splice(newFiles.indexOf(file), 1)
      setMyFiles(newFiles)
      setCount({...newFiles})
    
    }
    console.log("My files",myFiles)


    const thumbs = myFiles.map(file => (
      <div style={thumb} key={file.name}>
        <div style={thumbInner}>
          {/* {console.log("Multiflis",mutliFiles)} */}
          {/* {extensionforVideo == "mp4" ? (extensionforimage == " " ?(mutliFiles == " " ?<p>{file.name}</p>:<p>{file.name}</p>):(mutliFiles ?<p>{file.name}</p>:<p>{file.name}</p>)): <img src={file.preview} style={img} />  } */}
          {/* {extensionforVideo == "mp4" ? (extensionforimage == " " ?(mutliFiles == " " ?<p>{file.name}</p>:<p>{file.name}</p>):(mutliFiles ?<p>{file.name}</p>:<p>{file.name}</p>)): (mutliFiles == " " ? <p>{file.name}</p>: <p>{file.name}</p>  ) } */}
          {/* {extensionforVideo == "mp4"? (extensionforVideo == " " ? (mutliFiles == " "  ? <img src={file.preview} style={img} />: <p>{file.name}</p>):(<img src={file.preview} style={img} />) ): (mutliFiles == " " ? (extensionforimage == " "?<img src={file.preview} style={img} />:<p>{file.name}</p>):<img src={file.preview} style={img} />) } */}
          
          {extensionforVideo == "mp4" ?(mutliFiles == " "? (<p>e</p>) :(extensionforVideo == "mp4" ? <p>{file.name}</p> : <img src={file.preview} style={img} />)):(mutliFiles?  <p>{file.name}</p>:<img src={file.preview} style={img} />)}
          
          
          {/* {extensionforVideo == "mp4" ? (extensionforimage == " " ? () : ) :<p>{file.name}</p>): <img src={file.preview} style={img} /> } */}

          {/* { extensionforimage == " " ? (extensionforVideo === "mp4" ? <p>{file.name}</p>: <p>not mp4</p>) : <img src={file.preview} style={img} />} */}
          {/* {extensionforVideo && !extensionforimage? <p>{file.name}</p>:null}
          {extensionforimage ? <img src={file.preview} style={img} /> : null} */}
          {/* <img src={file.preview} style={img} /> */}
          

        {/* {extensionforVideo == "mp4" ? <p>{file.name}</p>: null} */}
        {/* {extensionforimage != " " ?<img src={file.preview} style={img} /> : (extensionforVideo == "mp4" ? <p>{file.name}</p>: null)} */}
        <img style={button} onClick={removeFile(file)} src="../img/removeIcon.svg" alt=""/>

        </div>

      </div>
    ))
=======
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
>>>>>>> origin/master

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