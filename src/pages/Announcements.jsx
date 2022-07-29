import React, { useState,useEffect } from "react";
import { Button, Container, Form, Dropdown, Accordion, Row, Col } from "react-bootstrap";
import LeftNavbar from "../components/LeftNavbar";
import TopHeader from "../components/TopHeader";
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import { BASE_URL } from "../components/App";
import axios from "axios";
import AllAnnouncements from "./AllAnnouncements";
import MyAnnouncements from "./MyAnnouncements";
import { debounce } from 'lodash';




const animatedComponents = makeAnimated();
const training = [
  {
    value: "sydney",
    label: "Sydney",
  },
  {
    value: "melbourne",
    label: "Melbourne",
  },
];

const Announcements =  () => {
  const [announcementDetails,setAnnouncementDetail] = useState("")
  const [tabLinkPath, setTabLinkPath] = useState("/all-announcements");
  // const [search,setSearch]=useState("");
  const [searchData,setSearchData] = useState([])
  const[searchword,setSearchWord] = useState(""); 
  const [selectedFranchisee, setSelectedFranchisee] = useState(localStorage.getItem('selectedFranchisee'));
  const [franchiseeData,setFranchiseeData]=useState('');
   
  const handleLinkClick = event => {
    let path = event.target.getAttribute('path');
    setTabLinkPath(path);
  }


  // const onFilter = debounce(() => {
  //   fetchUserDetails();
  // }, 200);
  let search = " "
  const fetchSearchData = async(e) =>{
    try {
      let api_url = '';
      const userId = localStorage.getItem("user_id")
       search = e.target.value;
       if(!search){
        search = " "
       } 
       console.log('SEARCH:', search);
      if (search) {   
        //  api_url =   `${BASE_URL}/announcement/createdAnnouncement/${userId}/?search=${search}`;
        // api_url = `${BASE_URL}/announcement/?franchiseeAlias=${franchiseeFormat}&search=${search}`
        
      }
       console.log("The api Url", api_url)
  
       let response = await axios.get(api_url, {
        headers: {
          authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      console.log("The reponse of serach",response.data.data.searchedData)
      setSearchData(response.data.data.searchedData)
    } catch (error) {
      console.log("The error in search APi",error)
    }
  }
  const handleSearchOnChange =(e) => {
    e.preventDefault();
    // fetchSearchData(e)
      fetchUserDetails(e)    //  console.log("The api_url",api_url)
  };
  const fetchUserDetails = async (e) => {
    try {
      let api_url = '';
      if(e){
        search = e.target.value;
      }
       if(!search){
        search = " "
       } 
    let franchiseeFormat = selectedFranchisee
      .split(',')[0]
      .split(' ')
      .map((dt) => dt.charAt(0).toLowerCase() + dt.slice(1))
      .join('_')
      .toLowerCase();
    if(!franchiseeFormat){
      franchiseeData = "all"
    }
    if(selectedFranchisee){
       api_url = `${BASE_URL}/announcement/?franchiseeAlias=${franchiseeFormat}&search=${search}`
    }

    let response = await axios.get(api_url, {
      headers: {
        authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
      if(response.status === 200 && response.data.status === "success"){
          console.log("The response",response)
          setFranchiseeData(response.data)

      }     
    } catch (error) {
      //  if(error.response.status === 404){
      //   console.log("The error",error)
      //   setFranchiseeData(error.response.data)
      //  }
      console.log("The error",error)
    }
  
  };
  
  useEffect(() =>{
    if(selectedFranchisee){
      fetchUserDetails()
    }
  },[selectedFranchisee])
  return (
    <>
      <div id="main">
        <section className="mainsection">
          <Container>
            <div className="admin-wrapper">
              <aside className="app-sidebar">
                <LeftNavbar/>
              </aside>
              <div className="sec-column">
              <TopHeader
                  selectedFranchisee={selectedFranchisee}
                  setSelectedFranchisee={setSelectedFranchisee}
                />
                <div className="entry-container">
                  <header className="title-head">
                    <h1 className="title-lg">Announcements</h1>
                    <div className="othpanel">
                      <div className="extra-btn">
                        <div className="data-search me-3">
                          <label for="search-bar" className="search-label">
                            <input 
                                  id="search-bar" 
                                  type="text" 
                                  className="form-control" 
                                  placeholder="Search"
                                 onChange={handleSearchOnChange}
                                  />
                          </label>
                        </div>
                        
                        <a href="/new-announcements" className="btn btn-primary me-3">+ Add New</a>
                      </div>
                    </div>
                  </header>
                  <div className="training-cat mb-3">
                    <ul>
                      <li><a onClick={handleLinkClick}  path="/all-announcements" className={`${tabLinkPath === "/all-announcements" ? "active" : ""}`}>All Announcements</a></li>
                      <li><a onClick={handleLinkClick} path="/my-announcements" className={`${tabLinkPath === "/my-announcements" ? "active" : ""}`} >My Announcements</a></li>
                  
                    </ul>
                  </div>
                 

            <div className="training-column">
                    {tabLinkPath === "/all-announcements" 
                      && <AllAnnouncements  searchValue={search} franchisee ={franchiseeData}/>}
                    {tabLinkPath === "/my-announcements" 
                      && <MyAnnouncements  searchValue={search} franchisee ={franchiseeData}
                             />}
                
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </section>
      </div>
    </>
  );
};

export default Announcements;
