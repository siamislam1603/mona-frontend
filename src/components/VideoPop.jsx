import React, { useState, useEffect } from "react";
import { Button, Col, Container, Row, Form, Dropdown,Modal } from "react-bootstrap";

const VideoPop = (props) => {
    
  const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
  
    return (
    <div style={{width:"180px"}}>
        
    <img src={props.img} alt="" onClick={handleShow}   />
    <Modal
        className="training-modal"
        size="lg"
        show={show}
        onHide={handleClose}
      >
        <Modal.Header closeButton>
        </Modal.Header>
        <Modal.Body style={{ width: "1200px", height: "500px" }}>
          <div className="form-settings-content" style={{ width: "inherit", height: "inherit" }}>
            <Row style={{ width: "80%", height: "90%" }}>
              <iframe title="video file" style={{ width: "100%", height: "100%" }} src={props.data} frameborder="0"  allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen  ></iframe>           
            </Row>   
          </div>
        </Modal.Body>
      </Modal> 
    </div>

  )
}
export default VideoPop
