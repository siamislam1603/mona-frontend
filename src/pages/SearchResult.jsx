import axios from 'axios'
import React, { useEffect } from 'react'
import { BASE_URL } from '../components/App'
import { Button, Container } from "react-bootstrap";
import LeftNavbar from "../components/LeftNavbar";
import TopHeader from "../components/TopHeader";

const SearchResult = (props) => {
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
    console.log("Search value",response)  
  }
  useEffect(() =>{
    GlobalSearch()
  },[term])

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
                      <h2 className="title-xs">Traning</h2>
                    </header>
                    <div className="search-item">
                      <div className="search-user-pic">
                        <a href="/">
                          <figure className="figure"><img alt="" src="/img/related-pic1.png" className="figure-img img-fluid" /></figure>
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
                          <figure className="figure"><img alt="" src="/img/related-pic2.png" className="figure-img img-fluid" /></figure>
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
                  </div>
                  
                  <div className="column-card">
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
                  </div>

            </div>
          </div>
        </div>
      </Container>
    </div>
  )
}

export default SearchResult