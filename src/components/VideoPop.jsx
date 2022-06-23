import React, { useState, useEffect } from "react";
import { PlayerSdk } from '@api.video/player-sdk'
import { Button, Col, Container, Row, Form, Dropdown,Modal } from "react-bootstrap";
const VideoPop = (props,{time},event) => {
    // event.preventDefault();
   
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const [pause,setpause] = useState(false)
    // const handleShow =(event) =>{
    //   event.preventDefault();
    //   setShow(true)
             
    // }
  
   console.log("The data",props.data,props.video)

      useEffect(() =>{  
        // setpause(false)
        console.log("The ")

      },[show])
  return (
    <div style={{width:"180px"}}>
    <img   src={props.img} alt="" onClick={() => {setShow(true)}}   />
    <p>{props.time}</p>
    {/* <div id="target"></div> */}

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
            {/* <form onSubmit={(event) => { event.preventDefault()}}>
              <iframe src={props.video} frameBorder="0"   allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture  object-fit: contain;" allowFullScreen autoplay="false" ></iframe>
            </form> */}
              {/* <Playvideo/>
              z */}
          <iframe src={props.video}  width={500} height={500} frameborder="0"  allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture  object-fit: contain;" allowFullScreen autoPlay={pause} ></iframe>

          {/* <video width="500" height="500" controls>
                 <source src="https://embed.api.video/vod/vi54sj9dAakOHJXKrUycCQZp" type="video/mp4"/>
                 {/* <source src="movie.ogg" type="video/ogg"/> */}
          {/* </video> */} 
            </Row>   
          </div>
        </Modal.Body>
      </Modal> 
    </div>

  )
}
export default VideoPop
