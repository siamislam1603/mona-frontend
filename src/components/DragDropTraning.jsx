import React, { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Link } from 'react-router-dom';

const temp = () => { };

export default function DragDropTraning({ onSave, setPopupVisible, croppedImage, setCroppedImage, fetchedPhoto = "", setFormErrors = temp }) {

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
        if (croppedImage) {
            setCurrentURI(croppedImage.src);
            setData([]);
        }
    }, [croppedImage]);

    return (
        <div className="file-upload-form">
            <div {...getRootProps({ className: 'dropzone' })}>
                <input {...getInputProps()} />
                <span className="text-center uploadfile cursor">
                    <img src="../img/bi_cloud-upload.png" className="me-2" alt="" /> Add Image
                </span>
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
                            : data.map((file, index) => (
                                <div className="imgcol" key={index}>
                                    <img src={getBase64(file) || currentURI} alt="AAAAAAAAAA" />
                                    <span className="ms-2">
                                        <Link to="#" onClick={() => handleFileDelete(file)}>
                                            <img src="../img/removeIcon.svg" alt="" />
                                        </Link>
                                    </span>
                                </div>
                            )) : <></>
                }
            </div>
        </div>
    );
}
    