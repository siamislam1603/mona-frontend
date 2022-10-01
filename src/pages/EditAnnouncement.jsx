import React, { useState, useEffect ,useRef } from 'react';
import { Col, Container, Form, Row, Button, Modal } from 'react-bootstrap';
import { BASE_URL } from "../components/App";
import TopHeader from '../components/TopHeader';
import LeftNavbar from '../components/LeftNavbar';
import Multiselect from 'multiselect-react-dropdown';
import MyEditor from './CkeditorAnnouncement';

import { useParams } from 'react-router-dom';
import * as ReactBootstrap from 'react-bootstrap';
// import DropAllFile from '../components/DragDropMultiple';

import moment from 'moment';

import { useLocation, useNavigate } from 'react-router-dom';
import Select from 'react-select';

import DropAllFile from "../components/DragDropMultiple";
import DropOneFile from '../components/DragDrop';
import DropVideo from '../components/DragDropVideo';
import {EditAnnouncementValidation} from '../helpers/validation';
import axios from 'axios';

const EditAnnouncement = () => {

  // const [announcementChangeData, setAnnoucementChangedata] = useState({
  //   related_files: [],
  // });
  const [errors, setErrors] = useState({});
 
  const [relatedFiles, setRelatedFiles] = useState([]);
  
  const [fetchedVideoTutorialFiles, setFetchedVideoTutorialFiles] = useState([]);
  const [docError, setDocError] = useState([]);
  
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);

  const [theMessage,setTheMessage] = useState("")
const [selectedFranchisee, setSelectedFranchisee] = useState();

const [docFileError, setDocFileError] = useState(null);
 
  const [fetchedCoverImage, setFetchedCoverImage] = useState();
  const [fileDeleteResponse, setFileDeleteResponse] = useState(false);
  const [allFranchise,setAllFranchise] = useState(false)

   const [updateAnnouncement, setUpdateAnnouncement] = useState(false);
  const [settingsModalPopup, setSettingsModalPopup] = useState(false);
  const [videoTutorialFiles, setVideoTutorialFiles] = useState([]);
  const [wordCount, setWordCount] = useState(0)
  const [videoFileErrorMessage, setVideoFileErrorMessage] = useState(null);
  
  const [AnnouncementsSettings, setAnnouncementsSettings] = useState({ user_roles: [] });

  const [theRelatedFiles,setTheRelatedFiles] = useState([])
  const [fetchedRelatedFiles, setFetchedRelatedFiles] = useState([]);
  const [videoError, setVideoError] = useState([]);
  
  //Copy Announcement Data
  const [announcementCopyData,setAnnouncementCopyData] = useState({
  is_event:0
  })
  const [announcementData,setAnnouncementData] = useState("")
  const [coverImage, setCoverImage] = useState({});
  const [theVideo,setTheVideo] = useState([])
  const [loader, setLoader] = useState(false);
  const [topErrorMessage, setTopErrorMessage] = useState(null);
  const [franchiseeData, setFranchiseeData] = useState();

  let title = useRef(null)
  let franchise = useRef(null)
  let meta_description = useRef(null)
  const { id } = useParams();

  const setAnnouncementFiled = (field, value) => {
    setAnnouncementCopyData({ ...announcementCopyData, [field]: value });
     
    if (field == "meta_description") {
      const text = value;
      if(value.includes("&nbsp")){
        
        setWordCount(text.length-12);
      }
      else{
        setWordCount(text.length-7);
      }
      console.log("WORD count",text.split(" ").length)
      if(value === ""){
        setWordCount(0)
      }
    }
    if (!!errors[field]) {
      setErrors({
        ...errors,
        [field]: null,
      });
    }
  };
  const handleAnnouncementsSettings = (event) => {
    const { name, value } = event.target;
    if (!!errors[name]) {
      setErrors({
        ...errors,
        [name]: null,
      });
    }
    setAnnouncementCopyData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    setAnnouncementsSettings((announcementChangeData) =>({
      ...announcementChangeData,
      [name]:value
    }))
  };
  const setAutoFocus = (errObj) =>{
    const errArray = Object.keys(errObj);
    console.log("ErrArrat",errArray)

    if(errArray.includes('title')) {
      console.log("Title",title.current.focus())

      title.current.focus();

    } 
    else if(errArray.includes('franchise')){
      // const executeScroll = () => franchise.current.scrollIntoView() 
      // executeScroll()
      // console.log("franhise", document.getElementById('franchise').focus())
      
      // franchise.current.focus();
      // document.getElementById('franchise').focus();
      window.scrollTo({
        top: franchise.current.offsetTop,
        behavior: "smooth",
        // You can also assign value "auto"
        // to the behavior parameter.
      });
    }
    else if(errArray.includes('meta_description')){
      // console.log("MEta description",document.getElementById('meta_description').current.focus())
      // meta_description.current.focus();
      // meta_description.current.focus();
      // document.getElementById('meta_description').focus();
      window.scrollTo({
        top: meta_description.current.offsetTop,
        behavior: "smooth",
        // You can also assign value "auto"
        // to the behavior parameter.
      });


    }
  
  }
  const onSubmit = (e) => {
    e.preventDefault();
 
    const newErrors = EditAnnouncementValidation(announcementCopyData,coverImage,announcementData,allFranchise,wordCount,relatedFiles);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setAutoFocus(newErrors)
    } 
    else{
      setErrors({})
      if(announcementCopyData ) {
         
         let data = new FormData();
      
         for(let [ key, values ] of Object.entries(announcementCopyData)) {
           data.append(`${key}`, values)
          }
          theVideo.forEach((file, index) => {
            data.append(`images`, file);
          });
          relatedFiles.forEach((file, index) => {
            data.append(`images`, file);
          });
          setUpdateAnnouncement(true);
          setLoader(true)
          UpdateAnnouncement(data)
      }
    }
  };
  const deleteAnnouncemetFile =  async (fileId) =>{
    let token = localStorage.getItem('token')
    const deleteResponse = await axios.delete(`${BASE_URL}/announcement/?fileId=${fileId}`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    if(deleteResponse.status === 200){
      setFileDeleteResponse(!fileDeleteResponse)

    }
  }
  const UpdateAnnouncement = async(data) =>{
    // data.append("")
    const theres = await  axios.post('https://httpbin.org/anything', data);
        try {
          const token = localStorage.getItem('token');
          setTheMessage("Uploading The Documents")
          
            const response = await axios.put(`${BASE_URL}/announcement/${id}`, data,{ 
            headers: {
              "Authorization": "Bearer " + token
            }
           });
           
           if(response.status === 200 && response.data.status === "success" && coverImage){
              const id = announcementData.id;
         
              if(typeof coverImage === "string"){
                setTheMessage("Uploading The Images and Videos")
      
                let imageFile = await axios.put(`${BASE_URL}/announcement/createdAnnouncement/${id}`,{
                  coverImage: coverImage
                },{
                  headers: {
                    "Authorization": "Bearer " + token
                  }
                })
                if(imageFile.status === 200){
                  window.location.href="/announcements";    
      
                   
                }
              }
              

              else if (typeof coverImage === "object" || coverImage === null || coverImage === "undefined"){
                if(Object.keys(coverImage).length === 0){
                    window.location.href="/announcements"; 
                    setCoverImage(null) 
                    setFetchedCoverImage(null)  

                }
                else{
                let data = new FormData()
                data.append('id',id);
                data.append('image', coverImage[0]);
                setTheMessage("Uploading Cover image")
      
                let imgSaveResponse = await axios.post(
                  `${BASE_URL}/training/coverImg?title=announcement`, data, {
                    headers: {
                      "Authorization": "Bearer " + token
                    }
                  }
                );
                if(imgSaveResponse.status === 201 && imgSaveResponse.data.status === "success") {            
                   setTheMessage(" ")
      
                  setLoader(false)
                  localStorage.setItem('success_msg', 'Announcement Created Successfully!');
                  localStorage.setItem('active_tab', '/created-announcement');
                  window.location.href="/announcements";    
                }
                else{
                      setTopErrorMessage("unable to save cover image!");
                      setTimeout(() => {
                      setTopErrorMessage(null);
                    }, 3000)
                }
                }
              }
           }
           else{
            window.location.href="/announcements";    

           }
         
          
        } catch (error) {


          if(error.response.status === 403 && error.response.data.status === "fail"){
          
            setUpdateAnnouncement(false)
            setTopErrorMessage("Announcement Already exit");
            // setLoader(false);
            // setUpdateAnnouncement(false);
            setTimeout(() => {
              setTopErrorMessage(null);
            }, 3000)
          }
        }
  }
  const fetchFranchiseeList = async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${BASE_URL}/role/franchisee`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    if(response.status === 200 && response.data.status === "success") {
      let { franchiseeList } = response.data;

      setFranchiseeData(franchiseeList.map(franchisee => ({
        id: franchisee.id,
        value: franchisee.franchisee_name,
        label: franchisee.franchisee_name,
        city: franchisee.franchisee_city,
        key: `${franchisee.franchisee_name}`

      })));  
    }
  }




  const AnnouncementDetails = async() => {
    let token = localStorage.getItem('token')
    const response = await axios.get(`${BASE_URL}/announcement/${id}`, {
     headers: {
       "Authorization": "Bearer " + token
     }
    })
    if(response.status === 200) {
      setAnnouncementData(response.data.data.all_announcements)


    }
 } 
 const getUniqueErrors = (arr) => {
  var result = [];
  arr.forEach(function(item) {
      if(result.indexOf(item) < 0) {
          result.push(item);
      }
  });

 return result;
}
 const copyFetchedData = () =>{
  setAnnouncementCopyData(prevState =>({
    ...prevState,
    title: announcementData?.title,
    meta_description: announcementData?.meta_description,
    start_date: moment(announcementData?.scheduled_date).format('YYYY-MM-DD'),
    start_time: moment(announcementData?.scheduled_date).format('HH:mm'),
    franchise: announcementData.franchise,
    is_event: announcementData.is_event,
  }))
  setAnnouncementsSettings(prevState =>({
    ...prevState,
    start_date: moment(announcementData?.scheduled_date).format('YYYY-MM-DD'),
      start_time: moment(announcementData?.scheduled_date).format('HH:mm:ss'),
    // start_date :announcementData&& announcementData?.scheduled_date.split("T")[0],
    // start_time: announcementData&& announcementData?.scheduled_date.split("T")[1].split(".")[0]
  }))
  setCoverImage(announcementData?.coverImage)
  setFetchedCoverImage(announcementData?.coverImage)
  setFetchedVideoTutorialFiles(announcementData?.announcement_files?.filter(file => file.fileType === ".mp4"));
  setFetchedRelatedFiles(announcementData?.announcement_files?.filter(file => file.fileType !== '.mp4'));
   
 }
 const getRelatedFileName = (str) => {
  let arr = str.split("/");
  let fileName = arr[arr.length - 1].split("_")[0];
  let ext =arr[arr.length-1].split(".")[1]
  let name = fileName.concat(".",ext)
  return name;
}
const selectFranhise = () =>{
  if(announcementData?.franchise?.length === 0){
    setAllFranchise(true)
  }
  else{
    setAllFranchise(false)
  }
}
 useEffect(() => {
  copyFetchedData();
  selectFranhise()
}, [announcementData]);
 useEffect(() =>{
  AnnouncementDetails();      
  },[])
  useEffect(() => {
    fetchFranchiseeList();
  }, []);

 

  useEffect(() =>{
    copyFetchedData();
    AnnouncementDetails()
},[fileDeleteResponse])
useEffect(() => {
  setDocError(docFileError?.map(errObj => (
    errObj?.error[0]?.message
  )));
}, [docFileError])
useEffect(() => {
  setVideoError(videoFileErrorMessage?.map(errObj => (
    errObj?.error[0]?.message
  )));
}, [videoFileErrorMessage])

useEffect(() =>{
  let count = announcementData?.meta_description?.length-7;
  console.log("The count",count)
  setWordCount(count)
},[announcementData?.meta_description])

  console.log("My annoucnement",announcementCopyData)
  console.log("ALL FRANHISE",allFranchise)

  console.log("THE ANNOUCNEMENt",announcementData?.meta_description,wordCount)
  
  return (
    <>
   
      <div id="main">
        <section className="mainsection ">
          <Container>
            <div className="admin-wrapper">
              <aside className="app-sidebar">
                <LeftNavbar />
              </aside>
              <div className="sec-column">
                <div className="new_module">
                  <TopHeader setSelectedFranchisee={setSelectedFranchisee} />

                  <Row>
                
                <header className="title-head">
                    <h1 className="title-lg">Edit Announcement</h1>
                  </header>
               
              
                <Form.Group className="col-md-6 mb-3" >
                          <Form.Label>Announcement Title</Form.Label>
                          <Form.Control 
                            type="text" 
                            ref={title} 
                            name="title" 
                            defaultValue={announcementCopyData.title}
                            placeholder="Enter Title"
                            onChange={(e) => {
                              setAnnouncementFiled(
                                e.target.name,
                                e.target.value
                              );
                            }}
                         
                            isInvalid={!!errors.title}
                            />
                          <Form.Control.Feedback type="invalid">
                            {errors.title}
                          </Form.Control.Feedback>
                          {topErrorMessage && <div className="error">{topErrorMessage}</div>} 

                        </Form.Group>

                        {
                          localStorage.getItem("user_role") === "franchisor_admin" ? (
                            <Col lg={3} sm={6}>
                            <Form.Group className="col-md-12">
                              <div className="btn-radio inline-col">
                       <Form.Label ref ={franchise} >Send to all Franchises </Form.Label>
                                <div>
                                <Form.Check
                                  type="radio"
                                  name="franchise"
                                  id="r"
                                  label="Yes"
                                  // checked={announcementData?.send_to_all_franchise === true}
                                  onChange={(event) =>{             
                                    setAnnouncementCopyData((prevState) => ({
                                      ...prevState,
                                      send_to_all_franchise: true,
                                      franchise: []
                                    }));
                                  setAllFranchise(true)
                                  }}
                                  // checked={announcementCopyData?.franchise?.length===0 }
                                  checked={allFranchise}
                                  
                                // defaultChecked = {allFranchise}
                                  
                                  
                                   />
                                <Form.Check
                                  type="radio"
                                  name="franchise"
                                  id="t"
                                  // checked={announcementData?.send_to_all_franchise === false}
                                  onChange={() =>{
                                    setAnnouncementCopyData(prevState => ({
                                      ...prevState,
                                      send_to_all_franchise: false,
                                     
                                      // franchise: [franchiseeData && franchiseeData.filter(c => announcementCopyData.franchise?.includes(parseInt(c.id) + ''))]
                                    }))
                                    setAllFranchise(false)
                                    copyFetchedData()
                                  }
                                  
                                }
                                checked={!allFranchise}
                                //  checked={announcementCopyData?.franchise?.length>0 || !allFranchise}
                                  label="No"
                                   />
                                   
                                </div>
                              
                              </div>
                            </Form.Group>
                          </Col>
                          )
                          :(
                            null
                          )
                        }
               
                        <Form.Group className="col-md-6 mb-3">
                            <Form.Label>Select Franchise(s)</Form.Label>
                          {
                            localStorage.getItem('user_role') === 'franchisor_admin' ? (
                              <div className="select-with-plus">
                                 <Multiselect
                                   disable={allFranchise === false?false:true}
                                    displayValue="key"
                                    selectedValues={allFranchise === false ? (franchiseeData && franchiseeData.filter(c => announcementCopyData.franchise?.includes(parseInt(c.id) + ''))):(franchiseeData && franchiseeData.filter(c => announcementCopyData.franchise?.includes(parseInt(c.id) + '')))}
                                    // selectedValues={franchiseeData?.filter(d => announcementData?.franchise?.includes(parseInt(d.id)))}
                                    className="multiselect-box default-arrow-select"
                                    onKeyPressFn={function noRefCheck() { }}
                                    onRemove={function noRefCheck(data) {
                                      setAnnouncementCopyData((prevState) => ({
                                        ...prevState,
                                        franchise: [...data.map(data => data.id + '')],

                                       
                                      }));
                                    }}
                                    onSelect={function noRefCheck(data) {
                                      setAnnouncementCopyData((prevState) => ({
                                        ...prevState,
                                         franchise: [...data.map(data => data.id+'')],

                                      }));
                                    }}
                                    options={franchiseeData}
                           />

                              
                         
                            </div>
  
                            ):(
                              <div className="select-with-plus">
                             
                              <Select
                                // placeholder="Which Franchisee?"
                                placeholder={franchiseeData?.filter(d => parseInt(d.id) === parseInt(selectedFranchisee))[0]?.label || "Which Franchisee?"}
                                isDisabled={true} 
                                // closeMenuOnSelect={true}
                                // options={franchiseeData}
                                // value={announcementCopyData.franchise}
                                value={franchiseeData && franchiseeData.filter(c => announcementCopyData.franchise?.includes(c.id + ""))}

                                onChange={(e) =>{                                  
                                  setAnnouncementCopyData((prevState) => ({
                                    ...prevState,
                                    franchise: [e.id+""]
                                  }));
                                }}
                              />
                              {/* { formErrors.role !== null && <span className="error">{formErrors.role}</span> } */}
                                </div>

                            )

                          }
                         


                         {allFranchise? null: <>
                            {   
                             errors.franchise && <p className="form-errors">{errors.franchise}</p>}

                           </>}
      

                      
                         
                          </Form.Group>
                  </Row>
                  <div>
                    <Row>
                      <Col sm={12} ref={meta_description}>
                        <Form.Group>
                          <Form.Label className="formlabel">
                          Announcement Description
                          </Form.Label>
                          {/* <MyEditor
                              data={announcementData.meta_description} 
                              name ="meta_description"
                              operatingManual={{ ...announcementChangeData }}
                              errors={errors}
                              handleChange={(e,data) => {
                                setAnnouncementFiled(
                                 e,data
                                );
                              }}

                            /> */}
                        
                            <MyEditor
                              errors={errors}
                              name ="meta_description"
                              data={announcementData.meta_description} 

                              handleChange={(e, data) => {
                                setAnnouncementFiled(e, data);
                              }}
                            />
                           {errors.meta_description && <p className="form-errors">{errors.meta_description}</p>}
                           <div className="text-left mb-4">Maximum character 1000</div>

                        </Form.Group>
                      </Col>
                    </Row>
                    <Row>
                    <Col lg={3} sm={6}>
                <Form.Group>
                  <Form.Label>Schedule Date</Form.Label>
                  <Form.Control  
                        type="date"
                        name="start_date"
                    min={new Date().toISOString().slice(0, 10)}

                        defaultValue={announcementCopyData&& announcementCopyData.start_date}
                        onChange={(e) => {
                          setAnnouncementFiled(
                            e.target.name,
                            e.target.value
                          );
                        }}
                      />
                </Form.Group>
                {errors.start_date && <p className="form-errors">{errors.start_date}</p>}
              </Col>
              <Col lg={3} sm={6} className="mt-3 mt-lg-0">
                <Form.Group>
                  <Form.Label>Schedule Time</Form.Label>
                  <Form.Control 
                    type="time"
                    name="start_time"
                    defaultValue={announcementCopyData&& announcementCopyData.start_time}
                    onChange={handleAnnouncementsSettings}
                  />
                </Form.Group>
                
                {errors.start_time && <p className="form-errors">{errors.start_time}</p>}

              </Col>
              <Col lg={3} sm={6}>
                  <Form.Group >
                    <div className="btn-radio inline-col">
                      <Form.Label>Event or Announcement</Form.Label>
                      <div>
                      <Form.Check
                        type="radio"
                        name="is_event"
                        id="a"
                        label="Announcement"
                        checked={announcementCopyData && announcementCopyData.is_event === 0}
                        onChange={(e) => {
                          setAnnouncementCopyData((prevState) => ({
                            ...prevState,
                            // [name]: value,
                            is_event:0
                          })); 
                        }}
                        
                        
                       
                         />
                      <Form.Check
                        type="radio"
                        name="is_event"
                        id="e"
                        checked={announcementCopyData && announcementCopyData.is_event === 1}

                        onChange={(e) => {
                          setAnnouncementCopyData((prevState) => ({
                            ...prevState,
                            // [name]: value,
                            is_event:1
                          })); 
                        }}
                        label="Event"
                         />
                      </div>
                    
                    </div>
                  </Form.Group>
                </Col>
                    </Row>
                    <div className="my-new-formsection">
                    <Row>
                      <Col sm={6}>
                        <Form.Group>
                          <Form.Label className="formlabel">
                            Upload Cover Image 
                          </Form.Label>
                          
                           <DropOneFile onSave={setCoverImage} 
                            isInvalid = {!!errors.coverImage}
                            setFetchedCoverImage={setFetchedCoverImage}
                          
                          />
                            {fetchedCoverImage && <img className="cover-image-style" src={fetchedCoverImage} alt="training cover image" />}
                            <small className="fileinput">(png, jpg & jpeg)</small>

                           <span  className="error">
                            {errors.coverImage}
                           </span>

                           

                          {/* <p className="form-errors">{errors.cover_image}</p> */}
                        </Form.Group>
                       </Col>

  
                      <Col sm={6}>
                        <Form.Group>
                          <Form.Label className="formlabel">
                            Upload Videos
                          </Form.Label>
                          {/* <DropOneFile onSave={setVideoTutorialFiles}

                           /> */}
                       <DropAllFile 
                        title="Videos"
                        onSave={setTheVideo}
                        type="video"
                        setUploadError={setVideoFileErrorMessage}
                        />


                          <p className="form-errors">
                            {errors.reference_video}
                          </p>
                          {
                              videoError  &&
                              getUniqueErrors(videoError).map(errorObj => {
                                return (
                                  <p style={{ color: 'tomato', fontSize: '12px' }}>{errorObj === "Too many files" ? "Only five video files allowed" : errorObj}</p>
                                )
                              })
                            }
                          <div className="media-container">
                              {
                                fetchedVideoTutorialFiles &&
                                fetchedVideoTutorialFiles.map((video, index) => (
                                  !video.is_deleted
                                  ?(
                                  
                                      <div className="file-container">
                                        <img className="file-thumbnail" src={`${video.thumbnail}`} alt={`${video.videoId}`} />
                                        <p className="file-text"><strong>{`Video ${videoTutorialFiles.length + (index + 1)}`}</strong></p>
                                        <img 
                                          onClick={() => deleteAnnouncemetFile(video.id)}
                                          className="file-remove" 
                                          src="../img/removeIcon.svg" 
                                          alt="" />
                                      </div>
                                    
                                  ):(null)

                               
                                ))
                              }
                            </div>
                         
                        </Form.Group>
                      </Col>
                    </Row>
  
                      
                     <Col md={6} className="mb-3">
                        <Form.Group>
                          <Form.Label>Upload Files </Form.Label>
                          <DropAllFile 
                              setUploadError={setDocFileError}
                            
                            onSave={setRelatedFiles}
                            />
                                                       {
                              docError  &&
                              getUniqueErrors(docError).map(errorObj => {
                                return (
                                  <p style={{ color: 'tomato', fontSize: '12px' }}>{errorObj === "Too many files" ? "Only five files allowed" : errorObj}</p>
                                )
                              })
                            }
                          <div className="media-container">

                          {fetchedRelatedFiles &&fetchedRelatedFiles.map((file) => (
                            !file.is_deleted
                              ? (
                                <div className="file-container">
                                {/* <img className="file-thumbnail-vector" src={`../img/file.png`} alt={`${file.videoId}`} /> */}
                                <p className="file-text">{`${getRelatedFileName(file.file)}`}</p>
                                <img 
                                  onClick={() => deleteAnnouncemetFile(file.id)}
                                  className="file-remove" 
                                  src="../img/removeIcon.svg" 
                                  alt="" />
                              </div>
                              )
                              : null
                          ))}
                          {/* {relatedFile} */}
                        
                          {!errors.relatedFile && relatedFiles?.length>5 &&<span className="form-errors">Max limit of files is 5</span> }
                          { errors.relatedFile && <span className="form-errors">{errors.relatedFile}</span> }
                        </div>
                        </Form.Group>
                      </Col>
                  </div>
                  </div>
                  <Row>
                  <Row>
                    <Col sm={12}>
                      <div className="bottom_button">   
                        <Button className="preview" onClick={() =>window.location.href="/announcements" }>Cancel</Button>
                        <Button className="saveForm" onClick={onSubmit}>
                          Save
                        </Button>
                      </div>
                    </Col>
                  </Row>
                  </Row>
                </div>
              </div>
            </div>
          </Container>
        </section>
      </div>
      {
        updateAnnouncement && 
        <Modal
        show={updateAnnouncement}
        onHide={() => setUpdateAnnouncement(false)}>
        <Modal.Header>
          <Modal.Title>
            Updating Announcement
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div className="create-training-modal" style={{ textAlign: 'center' }}>
            <p>This may take some time.</p>
            <p>{theMessage}</p>
          </div>
        </Modal.Body>

        <Modal.Footer style={{ display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        {
          loader === true && <div>
            <ReactBootstrap.Spinner animation="border" />
          </div>
        }
        </Modal.Footer>
      </Modal>
      }
  
   
    </>
  );
};

export default EditAnnouncement;
