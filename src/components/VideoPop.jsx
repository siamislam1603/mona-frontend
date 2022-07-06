import React, { useState, useEffect } from "react";
import { Button, Col, Container, Row, Form, Dropdown,Modal } from "react-bootstrap";

const VideoPop = (props) => {
    
  const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
  
    return (
    <>
    <div className="item mb-3">
      <div className="vidcol">
        <div className="d-flex align-items-center" onClick={handleShow}>
          <div className="pic"><img src={props.img} alt="" /></div>
          <div className="vid-title">
            Video title 1 <span className="time">3 Hours</span>
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
              Video Title
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="embed-responsive embed-responsive-16by9">
              <iframe title="video file" className="embed-responsive-item" src={props.data} frameborder="0"  allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
            </div>
          </Modal.Body>
        </Modal> 
      </div>
    </div>
    <div className="item mb-3">
      <div className="vidcol">
        <div className="d-flex align-items-center" onClick={handleShow}>
          <div className="pic"><img src={props.img} alt="" /></div>
          <div className="vid-title">
            Video title 2 <span className="time">3 Hours</span>
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
              Video Title
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="embed-responsive embed-responsive-16by9">
              <iframe title="video file" className="embed-responsive-item" src={props.data} frameborder="0"  allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
            </div>
          </Modal.Body>
        </Modal> 
      </div>
    </div>
    <div className="item mb-3">
      <div className="vidcol">
        <div className="d-flex align-items-center" onClick={handleShow}>
          <div className="pic"><img src={props.img} alt="" /></div>
          <div className="vid-title">
            Video title 3 <span className="time">3 Hours</span>
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
              Video Title
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="embed-responsive embed-responsive-16by9">
              <iframe title="video file" className="embed-responsive-item" src={props.data} frameborder="0"  allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
            </div>
          </Modal.Body>
        </Modal> 
      </div>
    </div>
    </>
  )
}
export default VideoPop
