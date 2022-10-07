import React, { useState } from "react";
import { Modal } from "react-bootstrap";

const VideoPopupfForFile = ({ data, title, duration, name }) => {
    console.log(data, 'cellcellcell')
    const [showVideo, setVideo] = useState(false);
    const handleVideoClose = () => setVideo(false);
    const handleShow = () => setVideo(true);
    console.log(data, duration,)

    return (
        <>
            <div className="item mb-3">
                <div className="vidcol">
                    <div className="d-flex align-items-center" onClick={handleShow}>
                        <div className="pic">
                            <iframe title="video file" style={{ height: "70px" }} className="embed-responsive-item" src={data} frameborder="0" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                        </div>
                        <span className="user-name">
                            {name}
                        </span>
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
export default VideoPopupfForFile

