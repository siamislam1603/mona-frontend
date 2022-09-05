import React, { useState, useEffect } from "react";
// import { PlayerSdk } from '@api.video/player-sdk'
import { Modal } from "react-bootstrap";

const FileRepoVideo = ({ data, title, duration, Src }) => {
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
                                Your browser does not support HTML video.
                            </video>
                            {/* <iframe title="video file" style={{ width: '200px' }} className="embed-responsive-item" src={data} frameborder="0" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe> */}
                            {/* <iframe title="video file" style={{ width: '200px' }} className="embed-responsive-item" src='https://youtu.be/NUhFD3j5xBA' frameborder="0" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe> */}
                        </div>
                        <div className="vid-title">
                            {title}<span className="time">{duration}</span>
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