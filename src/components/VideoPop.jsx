import React, { useState, useEffect } from "react";
import { PlayerSdk } from '@api.video/player-sdk'
import { Button, Col, Container, Row, Form, Dropdown, Modal } from "react-bootstrap";

const VideoPop = ({ data, title, duration }) => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <div className="item mb-3">
        <div className="vidcol">
          <div className="d-flex align-items-center" onClick={handleShow}>
            <div className="pic"><img src={data.thumbnail} alt="" /></div>
            <div className="vid-title">
              {title}<span className="time">{duration}</span>
            </div>
          </div>
          <Modal
            size="lg"
            show={show} className="training-modal"
            onHide={handleClose}
            aria-labelledby="example-modal-sizes-title-lg"
          >
            <Modal.Header closeButton>
              <Modal.Title id="example-modal-sizes-title-lg">
                {title}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="embed-responsive embed-responsive-16by9">
                <iframe title="video file" className="embed-responsive-item" src={data.file} frameborder="0" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
              </div>
            </Modal.Body>
          </Modal>
        </div>
      </div>
    </>
  )
}
export default VideoPop
