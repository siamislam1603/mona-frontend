import React, { useState,  } from "react";
import { Modal } from "react-bootstrap";

const FileRepoVideo = ({ data, title, duration, name, Src }) => {
    const [showVideo, setVideo] = useState(false);
    const handleVideoClose = () => setVideo(false);
    const handleShow = () => setVideo(true);
    return (
        <>
            <div className="item mb-3">
                <div className="vidcol">
                    <div className="align-items-center" onClick={handleShow}>
                        <div className="pic2">
                            <video width="200" style={{ maxHeight: "250px" }}>
                                <source src={data} type="video/mp4" />
                                <source src={data} type="video/ogg" />
                            </video>
                            
                        </div>
                        <div className="vid-title">
                            {name}<span className="time">{duration}</span>
                        </div>
                    </div>
                    <Modal
                        size="lg"
                        show={showVideo} className="training-modal"
                        onHide={handleVideoClose}
                        aria-labelledby="example-modal-sizes-title-lg"
                    >
                        <Modal.Header closeButton>
                            <Modal.Title id="example-modal-sizes-title-lg">
                                {title}
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <div className="embed-responsive embed-responsive-16by9">
                                <iframe title="video file" className="embed-responsive-item" src={data} frameborder="0" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                            </div>
                        </Modal.Body>
                    </Modal>
                </div>
            </div>
        </>
    )
}


export default FileRepoVideo