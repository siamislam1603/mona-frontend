import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { BASE_URL } from '../components/App'
import { Button, Container } from "react-bootstrap";
import LeftNavbar from "../components/LeftNavbar";
import TopHeader from "../components/TopHeader";
import CircularProgress from '@material-ui/core/CircularProgress';
import { Form, Dropdown, Accordion, Row, Col } from "react-bootstrap";
import moment from "moment";
import CardImg from '../assets/img/card.png'




const SearchResult = (props) => {
  const [announcement,setAnnouncement] = useState([])
  const [fileRepository,setFileRepository] = useState([])
  const [franchise,setFranchise] = useState([])
  const [operatingMannual,setOperatingMannual] = useState([])
  const [training,setTraining] = useState([])
  const [user,setUser] = useState([])
  const [formData,setFormData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error,setError] = useState("")



  const queryParams = new URLSearchParams(window.location.search)
  console.log("query params",window.location)

  let term = queryParams.get("query")
  console.log("TEM VALE",term)
  // const location = queryParams.get("query")

  const GlobalSearch = async() =>{
    let token = localStorage.getItem('token');
    // let  url = `${BASE_URL}/globalSearch/?search=${term}`
    const response  = await axios.get(`${BASE_URL}/globalSearch/`, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "search":`${term}`
      }
    });
    // console.log("THE BASEURL",BASE_URL)
    console.log("Search value",response) 
    // let res = response.data.data[0].fileRepository[0];

    if(response.status === 200 && response.data.status === "success"){

      if(response.data.data[0].announcement.length==0 && response.data.data[0].fileRepository.length==0 && response.data.data[0].franchise.length==0 && response.data.data[0].operatingMannual.length==0 && response.data.data[0].training.length==0 && response.data.data[0].user.length==0 ){
        console.log("NO DATA FOUND")
        setError("No data found")
        setIsLoading(false)
      }
      else{
        setAnnouncement(response.data.data[0].announcement) 
        setFileRepository(response.data.data[0].fileRepository)
        setFranchise(response.data.data[0].franchise)
        setOperatingMannual(response.data.data[0].operatingMannual)
        setTraining(response.data.data[0].training)
        setUser(response.data.data[0].user)
        setFormData(response.data.data[0].form)
        setIsLoading(false)
      }
      
    }
   
    
  }
  useEffect(() =>{
    GlobalSearch()

  },[term])
  console.log("Form data",formData)

  return (
    <div className="announcement-accordion">

<Container>
            <div className="admin-wrapper">
              <aside className="app-sidebar">
              <LeftNavbar />
              </aside>
              <div className="sec-column">
                <TopHeader 
                  notificationType='Child Enrollment'/>
                {
                  isLoading ? 
                  <div>
                    <header className="title-head">
                  <h1 className="title-lg mt-5">Search Result</h1>
                 
                </header>
                 <div className="text-center mb-5 mt-5">
                 <CircularProgress/>
               </div>
                    </div>
                  : (
                    <div className="entry-container searchresult-sec">
                    <header className="title-head">
                      <h1 className="title-lg">Search Result</h1>
                    </header>
                    {/* <img src=""/> */}
                    {announcement?.length>0 &&
                    <div>
                        <Accordion defaultActiveKey={['0']} alwaysOpen>
                          
                                  <div >
                                <Accordion.Item eventKey="0" >
                                  <Accordion.Header>
                                    <div className="head-title">
                                      {/* <div className="ico"><img src="../img/announcements-ico.png "  alt=""/></div> */}
                                      <div className="title-xxs">Announcements</div>
                                    
                                    </div>
                                  </Accordion.Header>
                                  <Accordion.Body>
                                    <Row className="mb-4">
                                      
                                    {announcement?.map((data) => (
                          <div className="search-item">
                          <div className="search-user-pic">
                            <a href="/announcements">
                              <figure className="figure"><img alt="" src={data?.coverImage ? data?.coverImage : "../img/announcements-ico.png "} className="figure-img img-fluid" /></figure>
                            </a>
                          </div>
                          <div className="search-user-detail">
                            <h2 className="title-md text-capitalize"><a href="/announcements">{data?.title}</a></h2>
                            <div className="totalview mb-2">
                              <span className="style-scope meta-block">
                                <strong>Created At:</strong> <time>
                                  <strong>
                                  {moment(data?.createdAt).fromNow()}
  
                                  </strong>
  
                                </time>
                              </span>
                            </div>
                            <div className="user-link mt-4"><a href="/announcements">View Details</a></div>
                          </div>
                        </div>
                        
                        ))}
                                  
                                    </Row>
                                  </Accordion.Body>
                                </Accordion.Item>
                                  </div> 
                                
                              
                          </Accordion>
                        </div>
                    }
                   
  
                    {/* TRAINING MOUDLE */}
                  
                   { training?.length>0 &&
                     <div >
                     
                     <Accordion defaultActiveKey="0">
                       
                       <div >
                       <Accordion.Item eventKey="0" >
  
                        <Accordion.Header>
                          <div className="head-title">
                            {/* <div className="ico"><img src="../img/announcements-ico.png" alt=""/></div> */}
                            <div className="title-xxs">Trainings</div>
                         
                          </div>
                        </Accordion.Header>
                        <Accordion.Body>
                          <Row className="mb-4">
                            
                          {training?.map((data) => (
                            <div className="search-item">
                            <div className="search-user-pic">
                           
 
                              <a href={`${BASE_URL}/training-detail/${data.trainingId}`}>
                                
                              <figure className="figure"><img alt="" src={data?.coverImage ? data?.coverImage : "/img/related-pic3.png"} className="figure-img img-fluid" /></figure>
                              </a>
                            </div>
                            
                            <div className="search-user-detail">
  
                              <h2 className="title-md text-capitalize"><a href={`/training-detail/${data.trainingId}`}>{data?.training?.title}</a></h2>
                              <div className="totalview mb-2">
                              <span className="style-scope meta-block">
                                <strong>Created At:</strong> <time>
                                  <strong>
                                  {moment(data?.createdAt).fromNow()}
  
                                  </strong>
  
                                </time>
                              </span>
                            </div>
                              <div className="user-link mt-4"><a href={`/training-detail/${data.trainingId}`}>View Details</a></div>
                            </div>
                            
                          </div>
              
                       ))}
                       
                          </Row>
                        </Accordion.Body>
                      </Accordion.Item>
                       </div> 
                      
                    
               </Accordion>
                   </div>
                }
  
                    {fileRepository?.length>0 &&
                     <div >
                     
                     <Accordion defaultActiveKey="0">
                       
                       <div >
                      <Accordion.Item eventKey="0" >
                        <Accordion.Header>
                          <div className="head-title">
                            {/* <div className="ico"><img src="../img/announcements-ico.png" alt=""/></div> */}
                            <div className="title-xxs">File Repository</div>
                         
                          </div>
                        </Accordion.Header>
                        <Accordion.Body>
                          <Row className="mb-4">
                            
                          {fileRepository?.map((data,index) => (
                            <div className="search-item">
                            
                            <div className="search-user-pic">
                              <a href={`/file-repository-List/${data?.repository?.repository_files[0]?.categoryId}`}>
                                {data?.repository?.repository_files[0]?.fileType === "video/mp4" ?
                                <figure className="figure"><img alt="" src={ "/img/video-image.png" } className="figure-img img-fluid" /></figure>
                                :
                                <figure className="figure"><img alt="" src={data?.repository?.repository_files[0]?.categoryId?.filesPath ? data?.repository?.repository_files[0]?.categoryId?.filesPath: "/img/related-pic3.png" } className="figure-img img-fluid" /></figure>
                              }
                                {/* <figure className="figure"><img alt="" src={data?.repository_files[0]?.filesPath ? data?.repository_files[0]?.filesPath: "/img/related-pic3.png" } className="figure-img img-fluid" /></figure> */}
                              </a>
                            </div>
                            <div className="search-user-detail">
                              <h2 className="title-md text-capitalize"><a href={`/file-repository/`}>{data?.repository?.title}</a></h2>
                              <div className="totalview mb-2">
                              <span className="style-scope meta-block">
                                <strong>Created At:</strong> <time>
                                  <strong>
                                  {moment(data?.createdAt).fromNow()}
  
                                  </strong>
  
                                </time>
                              </span>
                            </div>
                              <div className="user-link mt-4"><a href={`/file-repository-List/${data?.repository?.repository_files[0]?.categoryId}`}>View Details</a></div>
                            </div>
                          </div>
              
                       ))}
                       
                          </Row>
                        </Accordion.Body>
                      </Accordion.Item>
                       </div> 
                     </Accordion>
                   </div>
                    }
  
                    {/* - ---- ---- FRANHISESS  ----------------------------------*/}
  
                      {franchise?.length>0 &&
                
                     <div >
                     
                     <Accordion defaultActiveKey="0">
                       
                       <div >
                      <Accordion.Item eventKey="0" >
                        <Accordion.Header>
                          <div className="head-title">
                            {/* <div className="ico"><img src="../img/announcements-ico.png" alt=""/></div> */}
                            <div className="title-xxs">Franchises</div>
                         
                          </div>
                        </Accordion.Header>
                        <Accordion.Body>
                          <Row className="mb-4">
                            
                          {franchise?.map((data) => (
                            <div className="search-item">
                            <div className="search-user-pic">
                              <a href="/all-franchisees">
                                <figure className="figure"><img alt="" src={CardImg} className="figure-img img-fluid" /></figure>
                              </a>
                            </div>
                            <div className="search-user-detail">
                              <h2 className="title-md text-capitalize"><a href="/all-franchisees">{data?.franchisee_name}</a></h2>
                              <div className="totalview mb-2">
                              <span className="style-scope meta-block">
                                <strong>Created At:</strong> <time>
                                  <strong>
                                  {moment(data?.createdAt).fromNow()}
  
                                  </strong>
  
                                </time>
                              </span>
                            </div>
                              <div className="user-link mt-4"><a href="/all-franchisees">View Details</a></div>
                            </div>
                          </div>
              
                       ))}
                       
                          </Row>
                        </Accordion.Body>
                      </Accordion.Item>
                       </div> 
                     </Accordion>
                   </div>
                    
                    }
                    
                  
                      {operatingMannual?.length>0 &&
                        <div >
                     
                        <Accordion defaultActiveKey="0">
                          
                          <div >
                         <Accordion.Item eventKey="0" >
                           <Accordion.Header>
                             <div className="head-title">
                               {/* <div className="ico"><img src="../img/announcements-ico.png" alt=""/></div> */}
                               <div className="title-xxs">Operating Mannual</div>
                            
                             </div>
                           </Accordion.Header>
                           <Accordion.Body>
                             <Row className="mb-4">
                               
                             {operatingMannual?.map((data) => (
                               <div className="search-item">
                               <div className="search-user-pic">
                                 <a href={`/operatingmanual/?selected=${data.id}`}>
                                   <figure className="figure"><img alt="" src={data?.cover_image ? data?.cover_image: "/img/related-pic3.png"} className="figure-img img-fluid" /></figure>
                                 </a>
                               </div>
                               <div className="search-user-detail">
                                 <h2 className="title-md text-capitalize"><a href={`/operatingmanual/?selected=${data.id}`}>{data?.operating_manual?.title}</a></h2>
                                 <div className="totalview mb-2">
                              <span className="style-scope meta-block">
                                <strong>Created At:</strong> <time>
                                  <strong>
                                  {moment(data?.createdAt).fromNow()}
  
                                  </strong>
  
                                </time>
                              </span>
                            </div>
                                 <div className="user-link mt-4"><a href={`/operatingmanual/?selected=${data.id}`}>View Details</a></div>
                               </div>
                             </div>
                 
                          ))}
                          
                             </Row>
                           </Accordion.Body>
                         </Accordion.Item>
                          </div> 
                        </Accordion>
                      </div>
                    }
                    {/* <div className='cloumn-card'>
                      
                    {user?.map((data) => (
                            <div className="search-item">
                            <div className="search-user-pic">
                              <a href="/announcements">
                                <figure className="figure"><img alt="" src="/img/related-pic3.png" className="figure-img img-fluid" /></figure>
                              </a>
                            </div>
                            <div className="search-user-detail">
                              <h2 className="title-md text-capitalize"><a href="/announcements">{data?.fullname}</a></h2>
                              <div className="totalview mb-2">
                                <span className="style-scope meta-block">
                                  <strong>Shared Time:</strong> <time>38 minutes ago</time>
                                </span>
                              </div>
                              <div className="user-link mt-4"><a href="/announcements">View Details</a></div>
                            </div>
                          </div>
              
                       ))}
  
                    </div> */}
                      {user?.length>0 &&
                  
                     <div >
                     
                     <Accordion defaultActiveKey="0">
                       
                       <div >
                      <Accordion.Item eventKey="0">
                        <Accordion.Header>
                          <div className="head-title">
                            {/* <div className="ico"><img src="../img/announcements-ico.png" alt=""/></div> */}
                            <div className="title-xxs">Users</div>
                         
                          </div>
                        </Accordion.Header>
                        <Accordion.Body>
                          <Row className="mb-4">                            
                          {user?.map((data) => (
                            <div className="search-item">
                            <div className="search-user-pic">
                              <a href={`/view-user/${data.id}`}>
                                <figure className="figure"><img alt="" src={data?.profile_photo ? data?.profile_photo: "/img/related-pic3.png"} className="figure-img img-fluid" /></figure>
                              </a>
                            </div>
                            <div className="search-user-detail">
                              <h2 className="title-md text-capitalize"><a href={`/view-user/${data.id}`}>{data?.fullname}</a></h2>
                              <div className="totalview mb-2">
                              <span className="style-scope meta-block">
                                <strong>Created At:</strong> <time>
                                  <strong>
                                  {moment(data?.createdAt).fromNow()}
                                  </strong>
                                </time>
                              </span>
                            </div>
                              <div className="user-link mt-4"><a href={`/view-user/${data.id}`}>View Details</a></div>
                            </div>
                          </div>
              
                       ))}
                       
                          </Row>
                        </Accordion.Body>
                      </Accordion.Item>
                       </div> 
                     </Accordion>
                   </div>
                    }
                     {formData?.length>0 &&
                    <div>
                        <Accordion defaultActiveKey={['0']} alwaysOpen>
                          
                                  <div >
                                <Accordion.Item eventKey="0" >
                                  <Accordion.Header>
                                    <div className="head-title">
                                      {/* <div className="ico"><img src="../img/announcements-ico.png "  alt=""/></div> */}
                                      <div className="title-xxs">Form</div>
                                    
                                    </div>
                                  </Accordion.Header>
                                  <Accordion.Body>
                                    <Row className="mb-4">
                                      
                                    {formData?.map((data) => (
                          <div className="search-item">
                          <div className="search-user-pic">
                            <a href={`/form/dynamic/${data?.form?.form_name}`}>
                              <figure className="figure"><img alt="" src={data?.coverImage ? data?.coverImage : "../img/blue_survey.png "} className="figure-img img-fluid" /></figure>
                            </a>
                          </div>
                          <div className="search-user-detail">
                            <h2 className="title-md text-capitalize"><a href={`/form/dynamic/${data?.form?.form_name}`}>{data?.form?.form_name}</a></h2>
                            <div className="totalview mb-2">
                              <span className="style-scope meta-block">
                                <strong>Created At:</strong> <time>
                                  <strong>
                                  {moment(data?.createdAt).fromNow()}
  
                                  </strong>
  
                                </time>
                              </span>
                            </div>
                            <div className="user-link mt-4"><a href={`/form/dynamic/${data?.form?.form_name}`}>View Details</a></div>
                          </div>
                        </div>
                        
                        ))}
                                  
                                    </Row>
                                  </Accordion.Body>
                                </Accordion.Item>
                                  </div> 
                                
                              
                          </Accordion>
                        </div>
                    }
               <div className="text-center mb-5 mt-5"> <strong>{error}</strong> </div>

              </div>

                  )
                }
             
          </div>
        </div>
      </Container>
    </div>
  )
}

export default SearchResult