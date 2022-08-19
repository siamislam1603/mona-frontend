import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { BASE_URL } from '../components/App'
import { Button, Container } from "react-bootstrap";
import LeftNavbar from "../components/LeftNavbar";
import TopHeader from "../components/TopHeader";
import CircularProgress from '@material-ui/core/CircularProgress';
import { Form, Dropdown, Accordion, Row, Col } from "react-bootstrap";

const SearchResult = (props) => {
  const [announcement,setAnnouncement] = useState([])
  const [fileRepository,setFileRepository] = useState([])
  const [franchise,setFranchise] = useState([])
  const [operatingMannual,setOperatingMannual] = useState([])
  const [training,setTraining] = useState([])
  const [user,setUser] = useState([])
  const [isLoading, setIsLoading] = useState(true)



  const queryParams = new URLSearchParams(window.location.search)
  let term = queryParams.get("query")
  // const location = queryParams.get("query")

  const GlobalSearch = async() =>{
    let token = localStorage.getItem('token');
    const response  = await axios.get(`${BASE_URL}/globalSearch/?search=${term}`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    console.log("Search value",response.data.data) 
    if(response.status === 200 && response.data.status === "success"){
      setAnnouncement(response.data.data[0].announcement) 
      setFileRepository(response.data.data[0].fileRepository)
      setFranchise(response.data.data[0].franchise)
      setOperatingMannual(response.data.data[0].operatingMannual)
      setTraining(response.data.data[0].training)
      setUser(response.data.data[0].user)
      setIsLoading(false)
      if(announcement?.length<1 && fileRepository?.length<1 && franchise?.length<1 && operatingMannual?.length<1  ){
        console.log("NO DATA FOUND")
      }
    }
  
    
  }
  useEffect(() =>{
    GlobalSearch()

  },[term])
  console.log("Announcement",announcement)

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

              <div className="entry-container searchresult-sec">
                  <header className="title-head">
                    <h1 className="title-lg">Search Result</h1>
                  </header>
             
                  {announcement?.length>0 &&
                  <div>
                      <Accordion defaultActiveKey="0">
                        
                                <div >
                              <Accordion.Item >
                                <Accordion.Header>
                                  <div className="head-title">
                                    <div className="ico"><img src="../img/announcements-ico.png" alt=""/></div>
                                    <div className="title-xxs">Announcements</div>
                                  
                                  </div>
                                </Accordion.Header>
                                <Accordion.Body>
                                  <Row className="mb-4">
                                    
                                  {announcement?.map((data) => (
                        <div className="search-item">
                        <div className="search-user-pic">
                          <a href="/announcements">
                            <figure className="figure"><img alt="" src="/img/related-pic3.png" className="figure-img img-fluid" /></figure>
                          </a>
                        </div>
                        <div className="search-user-detail">
                          <h2 className="title-md text-capitalize"><a href="/announcements">{data?.title}</a></h2>
                          <div className="totalview mb-2">
                            <span className="style-scope meta-block">
                              <strong>Shared Time:</strong> <time>38 minutes ago</time>
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
                    <Accordion.Item >
                      <Accordion.Header>
                        <div className="head-title">
                          <div className="ico"><img src="../img/announcements-ico.png" alt=""/></div>
                          <div className="title-xxs">Trainings</div>
                       
                        </div>
                      </Accordion.Header>
                      <Accordion.Body>
                        <Row className="mb-4">
                          
                        {training?.map((data) => (
                          <div className="search-item">
                          <div className="search-user-pic">
                            <a href="/announcements">
                              <figure className="figure"><img alt="" src="/img/related-pic3.png" className="figure-img img-fluid" /></figure>
                            </a>
                          </div>
                          <div className="search-user-detail">
                            <h2 className="title-md text-capitalize"><a href="/announcements">{data?.title}</a></h2>
                            <div className="totalview mb-2">
                              <span className="style-scope meta-block">
                                <strong>Shared Time:</strong> <time>38 minutes ago</time>
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

                  {fileRepository?.length>0 &&
                   <div >
                   
                   <Accordion defaultActiveKey="0">
                     
                     <div >
                    <Accordion.Item >
                      <Accordion.Header>
                        <div className="head-title">
                          <div className="ico"><img src="../img/announcements-ico.png" alt=""/></div>
                          <div className="title-xxs">File Repository</div>
                       
                        </div>
                      </Accordion.Header>
                      <Accordion.Body>
                        <Row className="mb-4">
                          
                        {fileRepository?.map((data) => (
                          <div className="search-item">
                          <div className="search-user-pic">
                            <a href="/announcements">
                              <figure className="figure"><img alt="" src="/img/related-pic3.png" className="figure-img img-fluid" /></figure>
                            </a>
                          </div>
                          <div className="search-user-detail">
                            <h2 className="title-md text-capitalize"><a href="/announcements">{data?.title}</a></h2>
                            <div className="totalview mb-2">
                              <span className="style-scope meta-block">
                                <strong>Shared Time:</strong> <time>38 minutes ago</time>
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

                  {/* - ---- ---- FRANHISESS  ----------------------------------*/}

                    {franchise?.length>0 &&
              
                   <div >
                   
                   <Accordion defaultActiveKey="0">
                     
                     <div >
                    <Accordion.Item >
                      <Accordion.Header>
                        <div className="head-title">
                          <div className="ico"><img src="../img/announcements-ico.png" alt=""/></div>
                          <div className="title-xxs">Franchises</div>
                       
                        </div>
                      </Accordion.Header>
                      <Accordion.Body>
                        <Row className="mb-4">
                          
                        {franchise?.map((data) => (
                          <div className="search-item">
                          <div className="search-user-pic">
                            <a href="/announcements">
                              <figure className="figure"><img alt="" src="/img/related-pic3.png" className="figure-img img-fluid" /></figure>
                            </a>
                          </div>
                          <div className="search-user-detail">
                            <h2 className="title-md text-capitalize"><a href="/announcements">{data?.franchisee_name}</a></h2>
                            <div className="totalview mb-2">
                              <span className="style-scope meta-block">
                                <strong>Shared Time:</strong> <time>38 minutes ago</time>
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
                  
                
                    {operatingMannual?.length>0 &&
                      <div >
                   
                      <Accordion defaultActiveKey="0">
                        
                        <div >
                       <Accordion.Item >
                         <Accordion.Header>
                           <div className="head-title">
                             <div className="ico"><img src="../img/announcements-ico.png" alt=""/></div>
                             <div className="title-xxs">Operating Mannual</div>
                          
                           </div>
                         </Accordion.Header>
                         <Accordion.Body>
                           <Row className="mb-4">
                             
                           {operatingMannual?.map((data) => (
                             <div className="search-item">
                             <div className="search-user-pic">
                               <a href="/announcements">
                                 <figure className="figure"><img alt="" src="/img/related-pic3.png" className="figure-img img-fluid" /></figure>
                               </a>
                             </div>
                             <div className="search-user-detail">
                               <h2 className="title-md text-capitalize"><a href="/announcements">{data?.title}</a></h2>
                               <div className="totalview mb-2">
                                 <span className="style-scope meta-block">
                                   <strong>Shared Time:</strong> <time>38 minutes ago</time>
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
                    {user?.length>0 &&
                
                   <div >
                   
                   <Accordion defaultActiveKey="0">
                     
                     <div >
                    <Accordion.Item >
                      <Accordion.Header>
                        <div className="head-title">
                          <div className="ico"><img src="../img/announcements-ico.png" alt=""/></div>
                          <div className="title-xxs">Users</div>
                       
                        </div>
                      </Accordion.Header>
                      <Accordion.Body>
                        <Row className="mb-4">
                          
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
                     
                        </Row>
                      </Accordion.Body>
                    </Accordion.Item>
                     </div> 
                   </Accordion>
                 </div>
                  }

            </div>
          </div>
        </div>
      </Container>
    </div>
  )
}

export default SearchResult