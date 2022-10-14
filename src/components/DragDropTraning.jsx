import React, { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Link } from 'react-router-dom';

const bytesToMegaBytes = bytes => bytes / (1024 ** 2);

function fileSizeValidator(file) {
    let fileType = file.type.split("/")[0];

    if (fileType === 'video') {
        let fileSize = bytesToMegaBytes(file.size);
        if (fileSize > 1024) {
            return {
                code: "file-too-large",
                message: `File should be less than ${1}GB`
            };
        }
    } else if (fileType === 'application') {
        let fileSize = bytesToMegaBytes(file.size);
        if (fileSize > 10) {
            return {
                code: "file-too-large",
                message: `File should be less than ${10}MB`
            };
        }
    } else if (fileType === "image") {
        let fileSize = bytesToMegaBytes(file.size);
        if (fileSize > 10) {
            return {
                code: "file-too-large",
                message: `Image should be less than ${10}MB`
            }
        }
    }

    return null
}

const temp = () => { };

export default function DragDropTraning({ onSave, coverImage, popupVisible, setPopupVisible, croppedImage, setCroppedImage, fetchedPhoto = "", setFormErrors = temp, setUploadError = () => { } }) {
    const [data, setData] = useState([]);
    const [currentURI, setCurrentURI] = useState();
    const empty = () => {
        if (popupVisible === false) {
            console.log('POPUP ISN\'T VISIBLE');
            croppedImage = ""
            setCroppedImage("")
            setPopupVisible(false)
        }
    }
    useEffect(() => {
        empty();
    })
    empty();

    const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
        acceptedFiles.forEach((file, index) => {
            console.log('FILE:>>>>>>>>>>>>>>>>>>>', file);
            console.log('COVER IMAGE:>>>>>>>>>>', coverImage);
            console.log('CROPPED IMAGE:>>>>>>>>>>', croppedImage);
            if(acceptedFiles.length - 1 === index) {
                setData(prevState => [file]);
                setPopupVisible(true);
            }
        });
    }, []);

    const { getRootProps, getInputProps, fileRejections } = useDropzone({
        onDrop,
        maxFiles: 1,
        multiple: false,
        accept: {
            'image/*': ['.png', '.jpg', '.jpeg'],
        },
        validator: fileSizeValidator
    });

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
        if (croppedImage) {
            setCurrentURI(croppedImage.src);
            setData([]);
        }
    }, [croppedImage]);

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
                    <img src="../img/bi_cloud-upload.png" className="me-2" alt="" /> Add Image
                </span>
                <small className="fileinput mt-1 mb-1">(png, jpg & jpeg)</small>
                <small className="fileinput mt-1 mb-1">(1162 x 402 resolution, less than 10MB)</small>
            </div>
            <div className="">
                {
                    (currentURI) ?
                        croppedImage ?
                            <div className="crop-sec">
                                <img src={currentURI} alt="cover_file" style={{ maxWidth: "150px", height: "auto" }} />
                                <span className="ms-2">
                                    <Link to="#" onClick={() => setCroppedImage(null)}>
                                        <img src="../img/removeIcon.svg" alt="" />
                                    </Link>
                                </span>
                            </div>
                            :<></>
                            :<></>
                            // : data.map((file, index) => (
                            //     <div className="imgcol" key={index}>
                            //         <img src={getBase64(file) || currentURI} alt="AAAAAAAAAA" />
                            //         <span className="ms-2">
                            //             <Link to="#" onClick={() => handleFileDelete(file)}>
                            //                 <img src="../img/removeIcon.svg" alt="" />
                            //             </Link>
                            //         </span>
                            //     </div>
                            // )) : <></>
                }
            </div>
        </div>
    );
}
