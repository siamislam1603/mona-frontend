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
  const [selectedFranchisee, setSelectedFranchisee] = useState();
  const [franchiseeData,setFranchiseeData]=useState('');
  const [offset,setOffSet] = useState(0)
  const [loadMoreData,setLoadMoreData]= useState([])
  const handleLinkClick = event => {
    let path = event.target.getAttribute('path');
    setTabLinkPath(path);
  }


  // const onFilter = debounce(() => {
  //   fetchUserDetails();
  // }, 200);
  let search = " "

  const handleSearchOnChange =(e) => {
    e.preventDefault();
    fetchUserDetails(e)    //  console.log("The api_url",api_url)
  };
  const loadMore = async (e) =>{
    try {
    setOffSet(prevstate => prevstate+10);
    let api_url = '';
    api_url = `${BASE_URL}/announcement/?franchiseeAlias=all&search=${search === " " ? "":search}&offset=${offset}&limit=10`
    console.log("The load more button click",api_url)
    const response = await axios.get(api_url, {
      headers: {
        authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    let newre = response.data.searchedData
    console.log("The new data",newre)
    console.log("Load more button reponse",response)
    setLoadMoreData((prev)=> ([
    ...prev,
    ...newre
    ]));
    } catch (error) {
      console.log("The error insdie load More",error)
    }

    // fetchUserDetails(e)
  }
  const fetchUserDetails = async (e) => {
    // e.preventDefault()
    try {
      let api_url = '';
      if(e){
        search = e.target.value;
      }
      console.log("The search value", search)
      let franchiseeFormat 
      franchiseeFormat = selectedFranchisee&& selectedFranchisee
      .split(',')[0]
      .split(' ')
      .map((dt) => dt.charAt(0).toLowerCase() + dt.slice(1))
      .join('_')
      .toLowerCase();
      // console.log("The franhiseFormat",franchiseeFormat)
    if(!franchiseeFormat || franchiseeFormat === "undefined"){
      // console.log("The if elese",franchiseeFormat)
      franchiseeFormat = "all"
    }
    let offst =0;
    let limit =10
    if(selectedFranchisee){

      // console.log("The franhsie Format",search)
       api_url = `${BASE_URL}/announcement/?franchiseeAlias=${franchiseeFormat}&search=${search === " " ? "":search}&offset=${offst}&limit=${limit}`
    }

    console.log("The api url",api_url)
    const response = await axios.get(api_url, {
      headers: {
        authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    // console.log("The data after franchees select",response)

      if(response.status === 200 && response.data.status === "success"){
          setFranchiseeData(response.data)

      }     
    } catch (error) {
      //  if(error.response.status === 404){
      //   // console.log("The error",error)
      //   setFranchiseeData(error.response.data)
      //  }
      console.log("The error inside franhsie",error)
    }
  
  };
  
  useEffect(() =>{
    if(selectedFranchisee){
      console.log("The franchise user cahnge")
      fetchUserDetails()
    }
  },[selectedFranchisee])
  useEffect(() =>{
    loadMore()
    console.log("The load more inside useEffe")
    // setSelectedFranchisee("all")
    // setSelectedFranchisee(selectedFranchisee)
    // selectedFranchisee(selectedFranchisee)
    // console.log("The selected Franhsie".setSelectedFranchisee,selectedFranchisee)
  },[])
  // console.log("The selectd franhise ",selectedFranchisee)
  console.log("The Load More data" ,loadMoreData)
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
                      && <AllAnnouncements  searchValue={search} franchisee ={franchiseeData} loadData={loadMoreData}/>}
                    {tabLinkPath === "/my-announcements" 
                      && <MyAnnouncements  searchValue={search} franchisee ={franchiseeData}
                             />}
                
                  </div>
                    
                  <button onClick={loadMore} type="button" class="btn btn-primary">Load More</button>
                
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
