
import React, { useState, useEffect } from "react";
import { Button, Container, Form, Dropdown, Accordion, Row, Col } from "react-bootstrap";
import { BASE_URL } from "../components/App";
import axios from "axios";
// import VideoPop from "../components/VideoPop";
import AnnouncementVideo from "./AnnouncementVideo";
import { debounce } from 'lodash';
import CircularProgress from '@material-ui/core/CircularProgress';
import moment from 'moment';
import { verifyPermission } from "../helpers/roleBasedAccess";
import { type } from "jquery";




const AllEvent = (props) => {

  let Active_acordian = Number(props.Rarams);

  console.log(typeof Active_acordian, "Active_acordian")
  const [allEventData, setAllEventData] = useState([])
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const [topMessage, setTopMessage] = useState(null);

  const [userRole, setUserRole] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  const [topErrorMessage, setTopErrorMessage] = useState(null);



  const userName = localStorage.getItem("user_name");
  const getRelatedFileName = (str) => {
    let arr = str.split("/");
    let fileName = arr[arr.length - 1].split("_")[0];
    let ext = arr[arr.length - 1].split(".")[1]
    let name = fileName.concat(".", ext)
    return name;
  }
  const getAddedTime = (str) => {
    const Added = moment(str).format('DD/MM/YYYY')
    var today = new Date();
    let d = new Date(today);
    let month = (d.getMonth() + 1).toString().padStart(2, '0');
    let day = d.getDate().toString().padStart(2, '0');
    let year = d.getFullYear();
    let datae = [day, month, year].join('/');
    //  const date1 = new Date(datae);
    //  const date2 = new Date(str);
    //  console.log("THE Date1",Added,datae)
    if (datae === Added) {
      return "Added today"
    }
    else if (Added < datae) {
      return Added
    }
    else {
      return Added
    }
    // return Added

  }
  // const getAddedTime = (str) =>{
  //   const Added= moment(str).format('DD/MM/YYYY')
  //   var today = new Date();
  //   let d = new Date(today);
  //   let month = (d.getMonth() + 1).toString().padStart(2, '0');
  //   let day = d.getDate().toString().padStart(2, '0');
  //   let year = d.getFullYear();
  //    let datae =  [year, month, day].join('/');

  //    if(datae == Added){
  //     return "Added today"
  //    }
  //    if(Added<datae){
  //     return Added
  //    }


  useEffect(() => {
    const user_role = localStorage.getItem("user_role")
    setUserRole(user_role)
  }, [])
  useEffect(() => {
    if (props.allEvent) {
      setAllEventData(props.allEvent)
      setIsLoading(false)
    }
  }, [props.allEvent])
  useEffect(() => {
    if (props?.loadEvent?.length > 0) {
      setAllEventData(props.loadEvent)
      setIsLoading(false)

    }
    else {

    }
  }, [props.loadEvent])
  useEffect(() => {
    setTimeout(() => {
      setTopErrorMessage(null);
    }, 3000)
  }, [topErrorMessage])
  useEffect(() =>{
    setIsLoading(true)
  },[])

  return (
    <div className="announcement-accordion">
      {topMessage && <p className="alert alert-success" style={{ position: "fixed", left: "50%", top: "0%", zIndex: 1000 }}>{topMessage}</p>}
      {topErrorMessage && <p className="alert alert-danger" style={{ position: "fixed", left: "50%", top: "0%", zIndex: 1000 }}>{topErrorMessage}</p>}

      <Accordion defaultActiveKey={Active_acordian}>
        {allEventData &&
          allEventData?.length !== 0 ? (
          allEventData.map((data, index) => (
            <Accordion.Item eventKey={index} key={index}>
              <Accordion.Header>
                <div className="head-title">
                  <div className="ico"><img src="../img/announcements-ico.png" alt="" /></div>
                  <div className="title-xxs">{data.title}<small><span>
                    <span className="timesec">{getAddedTime(data.createdAt)}</span>

                  </span>
                    {data.user.fullname[0].toUpperCase() + data.user.fullname.slice(1)}

                  </small></div>

                </div>
              </Accordion.Header>
              <Accordion.Body>
                <Row className="mb-4">
                  <Col xl={2} lg={3}>
                    <div className="head">Description :</div>
                  </Col>
                  <Col xl={10} lg={9}>
                    {/* <div className="cont"><p> {data.meta_description}</p></div> */}
                    <div
                      dangerouslySetInnerHTML={{
                        __html: data.meta_description
                          ? data.meta_description
                          : null,
                      }}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col lg={4}>
                    <div className="video-col">
                      {data?.announcement_files?.map((detail, index) => (
                        <>
                          {detail.fileType == ".mp4" || detail.fileType === ".mkv" || detail.fileType === ".flv" && !detail.is_deleted ? (
                            <AnnouncementVideo
                              data={detail}
                              title={`Annoucnement Video ${index + 1}`}
                              // duration={trainingDetails.completion_time} 
                              fun={handleClose} />
                          ) : (
                            null
                          )}
                        </>
                      ))}
                    </div>
                  </Col>
                  <Col lg={8}>
                    {data && data?.coverImage && <div className="head">Related Images :</div>
                    }
                    {data && data?.coverImage &&
                      <div className="cont">
                        <div className="related-images">

                          {/* <div className="item"><a href="/"><img src="../img/related-pic4.png" alt=""/></a></div> */}
                          <div className="item"><a href="/"><img src={data?.coverImage} alt="" /></a></div>

                        </div>
                      </div>
                    }

                    {data?.announcement_files?.length > 0 ? <>
                      {data?.announcement_files[0]?.fileType === ".mp4" || data?.announcement_files[0].fileType === ".mkv"  || data?.announcement_files[0].fileType === ".flv" ?
                        (
                          null
                        ) :
                        (
                          <div className="head">Related Files :</div>
                        )}

                    </>

                      : (
                        null
                      )

                    }




                    <div className="cont">
                      <div className="related-files">
                        {data?.announcement_files && data?.announcement_files?.map((detail, index) => (
                          <>
                            {detail.fileType !== ".mp4" &&  detail.fileType != '.mkv' && detail.fileType != '.flv' && !detail.is_deleted ? (
                              <div className="item"><a href={detail.file}><img src="../img/abstract-ico.png" alt="" /> <span className="name">
                                <p>{getRelatedFileName(detail.file)}</p>
                                <small>{getAddedTime(detail.createdAt)}</small></span></a></div>
                            ) : (null)} </>
                        ))}
                      </div>
                    </div>
                  </Col>
                </Row>
              </Accordion.Body>
            </Accordion.Item>
          ))
        )
          : (
            <div className="text-center mb-5 mt-5"> {isLoading === true && props.theloadevent === true ? (<CircularProgress />) : <strong>No data found</strong>}</div>
          )
        }

      </Accordion>
    </div>
  )
}

export default AllEvent