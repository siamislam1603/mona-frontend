import React, { useState, useEffect } from 'react';
import { Col, Container, Form, Row, Button, Modal } from 'react-bootstrap';
import { BASE_URL } from "../components/App";
import TopHeader from '../components/TopHeader';
import LeftNavbar from '../components/LeftNavbar';
import Multiselect from 'multiselect-react-dropdown';
import MyEditor from './CKEditor';
import { useParams } from 'react-router-dom';

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
  
  const [userRole, setUserRole] = useState([]);
 
  const [fetchedCoverImage, setFetchedCoverImage] = useState();
  const [fileDeleteResponse, setFileDeleteResponse] = useState();

   const [createTrainingModal, setCreateTrainingModal] = useState(false);
  const [settingsModalPopup, setSettingsModalPopup] = useState(false);
  const [videoTutorialFiles, setVideoTutorialFiles] = useState([]);
  
  const [AnnouncementsSettings, setAnnouncementsSettings] = useState({ user_roles: [] });

  const [theRelatedFiles,setTheRelatedFiles] = useState([])
  const [fetchedRelatedFiles, setFetchedRelatedFiles] = useState([]);
  
  //Copy Announcement Data
  const [announcementCopyData,setAnnouncementCopyData] = useState({})
  const [announcementData,setAnnouncementData] = useState("")
  const [coverImage, setCoverImage] = useState({});
  const [theVideo,setTheVideo] = useState({})
  const [loader, setLoader] = useState(false);
  const [topErrorMessage, setTopErrorMessage] = useState(null);
  const [franchiseeData, setFranchiseeData] = useState(null);


  const { id } = useParams();

  const setOperatingManualField = (field, value) => {
    setAnnouncementCopyData({ ...announcementCopyData, [field]: value });
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
    setAnnouncementData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    setAnnouncementsSettings((announcementChangeData) =>({
      ...announcementChangeData,
      [name]:value
    }))
  };
  const onSubmit = (e) => {
    e.preventDefault();
 
    const newErrors = EditAnnouncementValidation(announcementData,coverImage,announcementData);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } 
    else{
      setErrors({})
      if(announcementData && coverImage) {
         console.log("After submit the buton",announcementData)
         let data = new FormData();
      
         for(let [ key, values ] of Object.entries(announcementData)) {
           data.append(`${key}`, values)
          }
          theVideo.forEach((file, index) => {
            data.append(`images`, file);
          });
          relatedFiles.forEach((file, index) => {
            data.append(`images`, file);
          });
          setCreateTrainingModal(true);
          setLoader(true)
          UpdateAnnouncement(data)
      }
    }
  };
  const deleteAnnouncemetFile =  async (fileId) =>{
    console.log(`The delete file with id : ${fileId}`)
    let token = localStorage.getItem('token')
    const deleteResponse = await axios.delete(`${BASE_URL}/announcement/?fileId=${fileId}`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    console.log("The Delete reponse",deleteResponse.status)
    if(deleteResponse.status === 200){
      console.log("Related file deleted")
      setFileDeleteResponse(deleteResponse)
    copyFetchedData();

    }
    // console.log("The deleted File",deleteResponse)
  }
  const UpdateAnnouncement = async(data) =>{
    // data.append("")
    const theres = await  axios.post('https://httpbin.org/anything', data);
        console.log("THE RESPONSE",theres)
    console.log("Updating Annoucement")
   const token = localStorage.getItem('token');
    
      const response = await axios.put(`${BASE_URL}/announcement/${id}`, data,{ 
      headers: {
        "Authorization": "Bearer " + token
      }
     });
     console.log("The response",response)
     if(response.status === 200 && response.data.status === "success"){
        const id = announcementData.id;
        console.log("The id",id)
       
        // const theres = await  axios.post('https://httpbin.org/anything', data);
        // console.log("THE RESPONSE",theres)
        // console.log("THE COVER IMAGE TYPE",typeof coverImage)
        if(typeof coverImage === "string"){
          console.log("The String type")
          let imageFile = await axios.put(`${BASE_URL}/announcement/createdAnnouncement/${id}`,{
            coverImage: coverImage
          },{
            headers: {
              "Authorization": "Bearer " + token
            }
          })
          if(imageFile.status === 200){
            console.log("Announcement update successfully ")
            window.location.href="/announcements";    

             
          }
        }
        else{
          console.log("The Object Type")
          let data = new FormData()
          data.append('id',id);
          data.append('image', coverImage[0]);
          let imgSaveResponse = await axios.post(
            `${BASE_URL}/training/coverImg?title=announcement`, data, {
              headers: {
                "Authorization": "Bearer " + token
              }
            }
          );
          console.log("The image",imgSaveResponse);
          if(imgSaveResponse.status === 201 && imgSaveResponse.data.status === "success") {            
            console.log('SUCCESS RESPONSE!');
            setLoader(false)
            localStorage.setItem('success_msg', 'Announcement Created Successfully!');
            localStorage.setItem('active_tab', '/created-announcement');
            window.location.href="/announcements";    
          }
          else{
                console.log('ERROR RESPONSE!');
                setTopErrorMessage("unable to save cover image!");
                setTimeout(() => {
                setTopErrorMessage(null);
              }, 3000)
          }
        }
     
      
      
     }
     else if(response.status === 200 && response.data.status === "fail") {
      console.log('ERROR RESPONSE!');
      const { msg } = response.data;
    
      console.log("Annoncement Already exit",msg)
      setTopErrorMessage(msg);
      setLoader(false);
      setCreateTrainingModal(false);
      setTimeout(() => {
        setTopErrorMessage(null);
      }, 3000)
    }
  
  }
  const fetchFranchiseeList = async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${BASE_URL}/role/franchisee`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    console.log("The franchiselist",response.data)
    if(response.status === 200 && response.data.status === "success") {
      let { franchiseeList } = response.data;

      setFranchiseeData(franchiseeList.map(franchisee => ({
        id: franchisee.id,
        value: franchisee.franchisee_alias,
        label: franchisee.franchisee_name
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
 const selectedfranhise = () =>{
  if(franchiseeData){
    console.log("Inside selectFranhi",franchiseeData)
  let size = franchiseeData.length
  console.log("INSIDE INSDEI",announcementData.franchise[0])
  // console.log("The SeletedFranhise", franchiseeData.length)
    for(let i=0;i<size;i++){
       if(franchiseeData[i] === announcementData.franchise[i]){
        console.log("The Rohan data",announcementData.franchise[i])
       }
    }
  }
 }
 const copyFetchedData = () =>{
  setAnnouncementCopyData(prevState =>({
    ...prevState,
    title: announcementData?.title,
    meta_description: announcementData?.meta_description,
    start_date: moment(announcementData?.scheduled_date).format('YYYY-MM-DD'),
    start_time: moment(announcementData?.scheduled_date).format('HH:mm'),
    
  }))
  console.log("The setAnnoucementdata inside cop",)
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
   
  console.log("FETCHED DATA COPIED",fetchedCoverImage)
 }
 const getRelatedFileName = (str) => {
  let arr = str.split("/");
  let fileName = arr[arr.length - 1].split("_")[0];
  let ext =arr[arr.length-1].split(".")[1]
  let name = fileName.concat(".",ext)
  return name;
}
 useEffect(() => {
  copyFetchedData();
}, [franchiseeData]);
 useEffect(() =>{
  AnnouncementDetails();
  const role = localStorage.getItem("user_role")
  setUserRole(role)       
  },[])
  useEffect(() => {
    fetchFranchiseeList();
  }, []);
  useEffect(() =>{
  selectedfranhise()
  },[franchiseeData])
  useEffect(() =>{
    setTheRelatedFiles(announcementData?.announcement_files?.filter(file => file.fileType !== '.mp4' && file.is_deleted === false))

  },[announcementData])
  useEffect(() =>{
    setAnnouncementData(announcementData)
  },[announcementData])

  useEffect(() =>{
    copyFetchedData();
},[fileDeleteResponse])
 
// console.log("The time",announcementData.scheduled_date.split("T")[1])
// console.log("The Image settig",coverImage,typeof coverImage)
  // selectedFranchisee && console.log('sds ->>>', selectedFranchisee);
  console.log("The COPY DATA",announcementCopyData )
  return (
    <>
      {/* {console.log('Annoucement--->', announcementData)}
      {console.log("The franhciess",franchiseeData)}
      {console.log('operating manual--->', announcementChangeData)} */}
      <div id="main">
        <section className="mainsection ">
          <Container>
            <div className="admin-wrapper">
              <aside className="app-sidebar">
                <LeftNavbar />
              </aside>
              <div className="sec-column">
                <div className="new_module">
                  <TopHeader/>
                  <Row>
                  <div className='entry-container'>
                <header className="title-head">
                    <h1 className="title-lg">Edit Announcement</h1>
                  </header>
                </div>
                <Form.Group className="col-md-6 mb-3" >
                          <Form.Label>Announcement Title</Form.Label>
                          <Form.Control 
                            type="text" 
                            name="title" 
                            // value={announcementChangeData?.title}
                            // value={announcementData.title || ""}
                            defaultValue={announcementCopyData.title}
                            placeholder="Enter Title"
                            onChange={(e) => {
                              setOperatingManualField(
                                e.target.name,
                                e.target.value
                              );
                            }}
                         
                            isInvalid={!!errors.title}
                            />
                          <Form.Control.Feedback type="invalid">
                            {errors.title}
                          </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="col-md-6 mb-3">
                            <Form.Label>Select Franchisee</Form.Label>

                            <div className="select-with-plus">
                            <Select
                              placeholder="Which Franchisee?"
                              closeMenuOnSelect={true}
                              isMulti
                              options={franchiseeData} 
                              value={franchiseeData && franchiseeData.filter(c => announcementData.franchise?.includes(c.id + ""))}
                              onChange={(selectedOptions) => {
                                setAnnouncementData((prevState) => ({
                                  ...prevState,
                                  franchise: [...selectedOptions.map(option => option.id + "")]
                                }));
                              }}
                            />
                         </div>      
                          </Form.Group>
                  </Row>
                  <div>
                    <Row>
                      <Col sm={12}>
                        <Form.Group>
                          <Form.Label className="formlabel">
                            Description
                          </Form.Label>
                          {/* <MyEditor
                              data={announcementData.meta_description} 
                              name ="meta_description"
                              operatingManual={{ ...announcementChangeData }}
                              errors={errors}
                              handleChange={(e,data) => {
                                setOperatingManualField(
                                 e,data
                                );
                              }}

                            /> */}
                        
                            <MyEditor
                              errors={errors}
                              name ="meta_description"
                              data={announcementData.meta_description} 

                              handleChange={(e, data) => {
                                setOperatingManualField(e, data);
                              }}
                            />
                           {errors.meta_description && <p className="form-errors">{errors.meta_description}</p>}
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
                        defaultValue={announcementCopyData&& announcementCopyData.start_date}
                        // defaultValue={ announcementData &&announcementData.scheduled_date.split("T")[0]}
                        onChange={handleAnnouncementsSettings}
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
                    </Row>
                    <div className="my-new-formsection">
                    <Row>
                      <Col sm={6}>
                        <Form.Group>
                          <Form.Label className="formlabel">
                            Upload Cover Image :
                          </Form.Label>
                          
                           <DropOneFile onSave={setCoverImage} 
                            isInvalid = {!!errors.coverImage}
                            setFetchedCoverImage={setFetchedCoverImage}
                          
                          />
                            {fetchedCoverImage && <img className="cover-image-style" src={fetchedCoverImage} alt="training cover image" />}

                           <span  className="error">
                            {errors.coverImage}
                           </span>
                           

                          {/* <p className="form-errors">{errors.cover_image}</p> */}
                        </Form.Group>
                       </Col>

  
                      <Col sm={6}>
                        <Form.Group>
                          <Form.Label className="formlabel">
                            Upload Reference Video Here :
                          </Form.Label>
                          {/* <DropOneFile onSave={setVideoTutorialFiles}

                           /> */}
                       <DropVideo onSave={setTheVideo}/>
                          <p className="form-errors">
                            {errors.reference_video}
                          </p>
                        </Form.Group>
                      </Col>
                    </Row>
  
                      
                     <Col md={6} className="mb-3">
                        <Form.Group>
                          <Form.Label>Upload Related Files :</Form.Label>
                          <DropAllFile onSave={setRelatedFiles}
                            // Files={theRelatedFiles}
                          />
                              {/* {
                                fetchedRelatedFiles &&
                                fetchedRelatedFiles.map((file, index) => {
                                  return (
                                    // <div className="file-container">
                                    //   {/* <img className="file-thumbnail-vector" src={`../img/file.png`} alt={`${file.videoId}`} /> */}
                                    {/* //   <p className="file-text">{`${getRelatedFileName(file.file)}`}</p>
                                    //   <img 
                                    //     onClick={() => deleteAnnouncemetFile(file.id)}
                                    //     className="file-remove" 
                                    //     src="../img/removeIcon.svg" 
                                    //     alt="" />
                                    // </div>
                                    <div>
                                       <h1>{file.id}</h1>
                                      </div>
                                  )
                                })
                              } */}
                            {/* </div> */} 
                        
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
                        </div>
                        </Form.Group>
                      </Col>
                  </div>
                  </div>
                  <Row>
                  <Row>
                    <Col sm={12}>
                      <div className="bottom_button">
                        <Button className="preview">Preview</Button>
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
   
    </>
  );
};

export default EditAnnouncement;
