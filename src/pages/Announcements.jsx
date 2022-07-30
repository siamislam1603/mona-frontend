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
  const [selectedFranchisee, setSelectedFranchisee] = useState("All");
  const [franchiseeData,setFranchiseeData]=useState('');
  const [offset,setOffSet] = useState(0)
  const [page,setPage]= useState(0);
  const [loadMoreData,setLoadMoreData]= useState([])
  const [theCount,setCount]= useState(null)
  const [theCommon,setTheCommon] = useState([])

  const handleLinkClick = event => {
    let path = event.target.getAttribute('path');
    setTabLinkPath(path);
  }


  // const onFilter = debounce(() => {
  //   fetchUserDetails();
  // }, 200);
  let search = " "
  let loadError = " "
  let count =""

  const handleSearchOnChange =(e) => {
    e.preventDefault();
    fetchUserDetails(e)    //  console.log("The api_url",api_url)
  };
  const loadMore = async (e) =>{
    try {
      console.log("The offset before",page)
      setPage(page+5);
    console.log("The offsetvalue after",page)
    let franchiseeFormat 
    franchiseeFormat = selectedFranchisee && selectedFranchisee
    .split(',')[0]
    .split(' ')
    .map((dt) => dt.charAt(0).toLowerCase() + dt.slice(1))
    .join('_')
    .toLowerCase();
    if(!franchiseeFormat || franchiseeFormat === "undefined"){
      // console.log("The if elese",franchiseeFormat)
      franchiseeFormat = "all"
    }
    console.log("The loadmore franhsie fomrat",franchiseeFormat)
    let api_url = '';
    api_url = `${BASE_URL}/announcement/?franchiseeAlias=${selectedFranchisee}&search=${search === " " ? "":search}&offset=${page}&limit=5`
    console.log("Teh api url",api_url)
    const response = await axios.get(api_url, {
      headers: {
        authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    console.log("THE REPONSE IN LOAD MORE ",response.data.result)
    let newre = response.data.result.searchedData
    setCount(response.data.result.count)
    console.log("The count",response.data.result.count)
    // console.log("The new data",newre)
    // console.log("The response",response) 
    
    // console.log("Load more button reponse",response)
    setLoadMoreData((prev)=> ([
    ...prev,
    ...newre
    ]));
    
    } catch (error) {
      loadError = error;
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
      // console.log("The e event",e)

      console.log("The search value", search)
      let franchiseeFormat ="all"
      franchiseeFormat = selectedFranchisee && selectedFranchisee
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
    // console.log("The franhiseeFormat",franchiseeFormat)
    let offst =0;
    let limit =10

      // console.log("The franhsie Format",search)
       api_url = `${BASE_URL}/announcement/?franchiseeAlias=${selectedFranchisee}&search=${search === " " ? "":search}&offset=&limit=5`
    

    // console.log("The api url",api_url)
    const response = await axios.get(api_url, {
      headers: {
        authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    // console.log("The data after franchees select",response)

      if(response.status === 200 && response.data.status === "success"){
          setFranchiseeData(response.data.result)


      }    
      setCount(response.data.result.count)

      console.log("The franshise count",response.data.result.count)
    } catch (error) {
       if(error.response.status === 404){
        console.log("The error franchise",error)
        setFranchiseeData(error.response.data)
       }
      // console.log("The error inside franhsie",error)
    }
  
  };
  
  useEffect(() =>{
    if(selectedFranchisee){
      // console.log("The franchise user cahnge")
      fetchUserDetails()
    }
  },[selectedFranchisee])
  useEffect(() =>{
    loadMore()
    console.log("The load more inside useEffe")
    // fetchUserDetails()
    // setSelectedFranchisee("all")
    // setSelectedFranchisee(selectedFranchisee)
    // selectedFranchisee(selectedFranchisee)
    // console.log("The selected Franhsie".setSelectedFranchisee,selectedFranchisee)
  },[])
  useEffect(() =>{
    setOffSet(10)
  },[search,selectedFranchisee])
  // console.log("The selectd franhise ",selectedFranchisee)
  // console.log("The Load More data" ,loadMoreData)
  console.log("The frnahsie Data",franchiseeData)
  // console.log("The id",selectedFranchisee)
  console.log("The count outside", theCount)
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
                  {/* {franchiseeData && franchiseeData.searchedData.length} */}
                  {loadMoreData&& loadMoreData.length ===theCount ? (
                    null
                  ):(
                    <button onClick={loadMore} type="button" class="btn btn-primary">Load More</button>

                  ) }
                 
                
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
