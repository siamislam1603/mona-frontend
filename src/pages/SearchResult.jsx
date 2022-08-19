import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { BASE_URL } from '../components/App'
import { Button, Container } from "react-bootstrap";
import LeftNavbar from "../components/LeftNavbar";
import TopHeader from "../components/TopHeader";
import CircularProgress from '@material-ui/core/CircularProgress';

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
      setTimeout(()=>{
        setIsLoading(false)
      }, 2000)
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
                  
                  <div className="column-card">
                    <header className="entry-title mb-4">
                      <h2 className="title-xs">Announcements</h2>
                    </header>
                    
                    { announcement?.length>0 ? announcement?.map((data) =>(
                      <div className="search-item">
                      <div className="search-user-pic">
                        <a href="/">
                          <figure className="figure">
                            <img alt="" src={data?.coverImage} className="figure-img img-fluid" />
                            
                            </figure>
                        </a>
                      </div>
                      <div className="search-user-detail">
                        <h2 className="title-md text-capitalize"><a href="/">{data?.title}</a></h2>
                        <div className="totalview mb-2">
                          <span className="style-scope meta-block">
                            <strong>Shared Time:</strong> <time>38 minutes ago</time>
                          </span>
                        </div>
                        <div className="user-link mt-4"><a href="/">View Details</a></div>
                      </div>
                      
                    </div>
                    )) :(
                      <div className="text-center mb-5 mt-5"><strong>No data found !</strong></div>

                    )}
                  </div>
                  
                   <div className="column-card">
                   <header className="entry-title mb-4">
                     <h2 className="title-xs">Trainings</h2>
                   </header>
                   { training?.length>0 ?training?.map((data) => (
                     <div className="search-item">
                     <div className="search-user-pic">
                       <a href="/">
                         <figure className="figure"><img alt="" src="/img/related-pic3.png" className="figure-img img-fluid" /></figure>
                       </a>
                     </div>
                     <div className="search-user-detail">
                       <h2 className="title-md text-capitalize"><a href="/">{data?.title}</a></h2>
                       <div className="totalview mb-2">
                         <span className="style-scope meta-block">
                           <strong>Shared Time:</strong> <time>38 minutes ago</time>
                         </span>
                       </div>
                       <div className="user-link mt-4"><a href="/">View Details</a></div>
                     </div>
                   </div>
                   ))
                   :(
                    <div className="text-center mb-5 mt-5"><strong>No data found !</strong></div>

                   )
                  }
                  
                
                 </div>
                  

                  {fileRepository?.length>0 &&
                   <div className="column-card">
                   <header className="entry-title mb-4">
                     <h2 className="title-xs">File Repository</h2>
                   </header>
                   {fileRepository?.map((data) => (
                     <div className="search-item">
                     <div className="search-user-pic">
                       <a href="/">
                         <figure className="figure"><img alt="" src="/img/related-pic3.png" className="figure-img img-fluid" /></figure>
                       </a>
                     </div>
                     <div className="search-user-detail">
                       <h2 className="title-md text-capitalize"><a href="/">{data?.title}</a></h2>
                       <div className="totalview mb-2">
                         <span className="style-scope meta-block">
                           <strong>Shared Time:</strong> <time>38 minutes ago</time>
                         </span>
                       </div>
                       <div className="user-link mt-4"><a href="/">View Details</a></div>
                     </div>
                   </div>
                   ))}
                  
                
                 </div>
                  }

                  {/* - ---- ---- FRANHISESS  ----------------------------------*/}

                    {franchise?.length>0 &&
                   <div className="column-card">
                   <header className="entry-title mb-4">
                     <h2 className="title-xs">Franchises</h2>
                   </header>
                   {franchise?.map((data) => (
                     <div className="search-item">
                     <div className="search-user-pic">
                       <a href="/">
                         <figure className="figure"><img alt="" src="/img/related-pic3.png" className="figure-img img-fluid" /></figure>
                       </a>
                     </div>
                     <div className="search-user-detail">
                       <h2 className="title-md text-capitalize"><a href="/">{data?.franchisee_name}</a></h2>
                       <div className="totalview mb-2">
                         <span className="style-scope meta-block">
                           <strong>Shared Time:</strong> <time>38 minutes ago</time>
                         </span>
                       </div>
                       <div className="user-link mt-4"><a href="/">View Details</a></div>
                     </div>
                   </div>
                   ))}
                  </div>
                  }
                  
                  
                  {/* <div className="column-card">
                    <header className="entry-title mb-4">
                      <h2 className="title-xs">Traning</h2>
                    </header>
                    <div className="search-item">
                      <div className="search-user-pic">
                        <a href="/">
                          <figure className="figure"><img alt="" src="/img/related-pic3.png" className="figure-img img-fluid" /></figure>
                        </a>
                      </div>
                      <div className="search-user-detail">
                        <h2 className="title-md text-capitalize"><a href="/">Manita Vidyarthy</a></h2>
                        <div className="totalview mb-2">
                          <span className="style-scope meta-block">
                            <strong>Shared Time:</strong> <time>38 minutes ago</time>
                          </span>
                        </div>
                        <div className="user-link mt-4"><a href="/">View Details</a></div>
                      </div>
                    </div>
                    <div className="search-item">
                      <div className="search-user-pic">
                        <a href="/">
                          <figure className="figure"><img alt="" src="/img/related-pic4.png" className="figure-img img-fluid" /></figure>
                        </a>
                      </div>
                      <div className="search-user-detail">
                        <h2 className="title-md text-capitalize"><a href="/">Manita Vidyarthy</a></h2>
                        <div className="totalview mb-2">
                          <span className="style-scope meta-block">
                            <strong>Shared Time:</strong> <time>38 minutes ago</time>
                          </span>
                        </div>
                        <div className="user-link mt-4"><a href="/">View Details</a></div>
                      </div>
                    </div>
                  </div> */}
                    {operatingMannual?.length>0 &&
                   <div className="column-card">
                   <header className="entry-title mb-4">
                     <h2 className="title-xs">Operating Mannual</h2>
                   </header>
                   {operatingMannual?.map((data) => (
                     <div className="search-item">
                     <div className="search-user-pic">
                       <a href="/">
                         <figure className="figure"><img alt="" src="/img/related-pic3.png" className="figure-img img-fluid" /></figure>
                       </a>
                     </div>
                     <div className="search-user-detail">
                       <h2 className="title-md text-capitalize"><a href="/">{data?.title}</a></h2>
                       <div className="totalview mb-2">
                         <span className="style-scope meta-block">
                           <strong>Shared Time:</strong> <time>38 minutes ago</time>
                         </span>
                       </div>
                       <div className="user-link mt-4"><a href="/">View Details</a></div>
                     </div>
                   </div>
                   ))}
                  
                
                 </div>
                  }
                    {user?.length>0 &&
                   <div className="column-card">
                   <header className="entry-title mb-4">
                     <h2 className="title-xs">Users</h2>
                   </header>
                   {user?.map((data) => (
                     <div className="search-item">
                     <div className="search-user-pic">
                       <a href="/">
                         <figure className="figure"><img alt="" src="/img/related-pic3.png" className="figure-img img-fluid" /></figure>
                       </a>
                     </div>
                     <div className="search-user-detail">
                       <h2 className="title-md text-capitalize"><a href="/">{data?.fullname}</a></h2>
                       <div className="totalview mb-2">
                         <span className="style-scope meta-block">
                           <strong>Shared Time:</strong> <time>38 minutes ago</time>
                         </span>
                       </div>
                       <div className="user-link mt-4"><a href="/">View Details</a></div>
                     </div>
                   </div>
                   ))}
                  
                
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