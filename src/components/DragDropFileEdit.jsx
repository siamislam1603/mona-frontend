import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Link } from "react-router-dom";
import { Row, Col } from "react-bootstrap";
export default function DragDropFileEdit({ onChange, setPopupVisible, imageToCrop }) {
    const [myFiles, setMyFiles] = useState([])
    const [currentURI, setCurrentURI] = useState();

    const getBase64 = (file) => {
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
            setCurrentURI(reader.result);
        };
    }

    const { acceptedFiles, getRootProps, getInputProps } =
        useDropzone
            ({
                onDrop: (acceptedFiles) => {
                    setMyFiles([myFiles, ...acceptedFiles])
                    onChange(acceptedFiles);
                    setPopupVisible(false);
                },

                maxFiles: 1,
                multiple: false,
                accept: {
                    'image/*': ['.jpeg', '.png', '.jpg'],
                    'text/*': ['.html', '.htm', '.doc', '.pdf'],
                    'video/mp4': ['video/mp4'],
                    'audio/mpeg': ['.audio/mpeg', '.mp3']
                    // '.doc, .pdf, .mp3, .png, .jpg'
                },
                useFsAccessApi: false,
            })


    const removeFile = file => () => {
        const newFiles = { myFiles }
        newFiles.splice(newFiles.indexOf(file), 1)
        setMyFiles(newFiles)
    }
    const Filess = myFiles.map((file, index) => {
        if (index != 0)
            return <>

                {file.type === "image/jpeg" ? (<>
                    <img src={getBase64(file) || currentURI || acceptedFiles} style={{ maxWidth: "150px", height: "auto" }} alt="cover_file" />
                </>) : (<></>)}

                <Link to="#" onClick={removeFile(file)}>
                    <img src="../img/removeIcon.svg" alt="" />
                </Link>
            </>
    })

    return (
        <div className="repositorydrag text-center">
            <div {...getRootProps({ className: "dropzone d-block" })}>
                <input {...getInputProps()} type="file" name="setting_file" />
                <div className="text-center uploadfile">
                    <Row>
                        <Col md={6}>
                            <span>Please Select a file to share : <br /><span className="btn btn-primary" >Choose File</span> <br /> <small>Accepted file types : doc, pdf, mp3, png, jpg</small></span>
                        </Col>
                        <Col md={6}>
                            <div className="showfiles">
                                <ul>{Filess}</ul>
                            </div>
                        </Col>
                    </Row>
                </div>

            </div>

            {/* {console.log(myFiles[0].File, "sjh")} */}
            {/* {files.length > 0 && <button onClick={removeAll}>Remove All</button>} */}
        </div>
    );
}

