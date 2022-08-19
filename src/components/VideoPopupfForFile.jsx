import React, { useState, useEffect } from "react";
import { PlayerSdk } from '@api.video/player-sdk'
import { Button, Col, Container, Row, Form, Dropdown, Modal } from "react-bootstrap";

const VideoPopupfForFile = ({ data, title, name, duration }) => {
    console.log(data, 'cellcellcell')
    const [showVideo, setVideo] = useState(false);
    const handleVideoClose = () => setVideo(false);
    const handleVideoShow = () => setVideo(true);

    console.log(title, "Video")

    return (
        <>
            <div className="item mb-3">
                <div className="vidcol">
                    <div className="d-flex align-items-center" onClick={handleVideoShow}>
                        <div >
                            <img src={data.thumbnail} alt="" />
                            <img src="../img/video_icon.png" className="me-2" alt="" style={{ backgroundColor: "grey" }} />
                            {name}.mp4 <span className="time"></span>
                        </div>
                    </div>
                    {console.log(data, "Video Title")}
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
export default VideoPopupfForFile

