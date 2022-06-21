import React, { useState, useEffect } from "react";
import { Button, Col, Container, Row, Form, Dropdown,Modal } from "react-bootstrap";
const VideoPop = (props) => {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
  return (
    <div style={{width:"180px"}}>
        
    <img   src={props.img} alt="" onClick={handleShow}   />
    <Modal
        className="training-modal"
        size="lg"
        show={show}
        onHide={handleClose}
      >
        <Modal.Header closeButton>
        </Modal.Header>
        <Modal.Body>
          <div className="form-settings-content">
            <Row>
            {/* <iframe width={200} height={200} src={props.data.newvideo} title="YouTube video player" frameBorder="0"  allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen  ></iframe> */}
            <iframe src={props.data.newvideo} frameborder="0"  allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture  object-fit: contain;" allowFullScreen  ></iframe>
           
            </Row>   
          </div>
        </Modal.Body>
      </Modal> 
    </div>

  )
}
export default VideoPop
