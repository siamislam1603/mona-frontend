import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Link } from "react-router-dom";

let random = () => { }

export default function DragDropFileEdit({ onSave, setPopupVisible, imageToCrop, setFetchedCoverImage = random }) {
    const [myFiles, setMyFiles] = useState([])
    const [currentURI, setCurrentURI] = useState();

    const getBase64 = (file) => {
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
            setCurrentURI(reader.result);
        };
    }
    // const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    //     acceptedFiles.forEach(file => {
    //       setData(prevState => [...prevState, file]);
    //     });
    //   }, []);
    const onDrop = useCallback((acceptedFiles) => {
        acceptedFiles.forEach(file => {
            setMyFiles(prevState => [prevState, file])
        })
        onSave(acceptedFiles);
        setPopupVisible(false);
    }, [])
    const { acceptedFiles, getRootProps, getInputProps } =
        useDropzone
            ({
                onDrop,
                maxFiles: 1,
                multiple: false,
                accept: {
                    'image/*': ['.jpeg', '.png', '.jpg'],
                    'text/*': ['.html', '.htm', '.doc', '.pdf'],
                    'video/mp4': ['video/mp4'],
                    'audio/mpeg': ['.audio/mpeg', '.mp3']
                },
                useFsAccessApi: false,
            })

    const removeFile = file => () => {
        const newFiles = { myFiles }
        newFiles.splice(newFiles.indexOf(file), 1)
        setMyFiles(newFiles)
    }
    return (

        <div className="file-upload-form" style={{ display: 'flex', width: '100%' }}>
            <div>
                <div {...getRootProps({ className: "dropzone d-block" })}>
                    <input {...getInputProps()} type="file" name="setting_file" />
                    <div className="text-center">
                        <span>Please Select a file to share : <br /><span className="btn btn-primary" >Choose File</span> <br /> <small>Accepted file types : doc, pdf, mp3, png, jpg</small></span>
                    </div>
                </div>
            </div>
            <div>
                <div className="showfiles">
                    <ul>
                        {console.log(acceptedFiles)}
                        {myFiles.map((file, index) => {
                            if (index != 0)
                                return <>
                                    <li className="mt-3" key={index}>
                                        {console.log(acceptedFiles, "currentURI")}
                                        {file ? (<>< img src={getBase64(file) || currentURI || acceptedFiles} style={{ maxWidth: "150px", height: "auto" }} alt="cover_file" /></>) : (<>zxd</>)}
                                        <span className="ms-2">
                                            <Link to="#" onClick={removeFile(file)}>
                                                <img src="../img/removeIcon.svg" alt="" />
                                            </Link>
                                        </span>
                                    </li>
                                </>
                        })}
                    </ul>
                </div>
            </div>
        </div >
    );
}
