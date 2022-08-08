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
  const [allAnnouncement,setAllAnnouncement] = useState([])
  const [tabLinkPath, setTabLinkPath] = useState("/all-announcements");
  // const [search,setSearch]=useState("");
  const [searchData,setSearchData] = useState([])
  const[searchword,setSearchWord] = useState(""); 
  const [selectedFranchisee, setSelectedFranchisee] = useState("all");
  // const [franchiseeData,setFranchiseeData]=useState('');
  const [theLoadOffSet,setTheLoadOffSet] = useState(0)
  const [offset,setOffSet] = useState(0)
  const [page,setPage]= useState(0);
  const [loadMoreData,setLoadMoreData]= useState([])
  const [theCount,setCount]= useState(null)
  const [theCommon,setTheCommon] = useState(null)
  const [myAnnouncementData,setMyAnnouncementData]= useState([])

  const handleLinkClick = event => {
    let path = event.target.getAttribute('path');
    setTabLinkPath(path);
  }


  // const onFilter = debounce(() => {
  //   fetchUserDetails();
  // }, 200);
let searchvalue  = " "
  let loadError = " "
  let count =""

  const handleSearchOnChange =(e) => {
    e.preventDefault();
    if(tabLinkPath === "/all-announcements"){
      console.log("THE SEARCH ALL ANNOUNCMENT")
      AllannoucementData(e)
    }
    // fetchUserDetails(e)    //  console.log("The api_url",api_url)
  };
  // const loadMore = async (e) =>{
  //   try {
  //     console.log("THE SEARCH ")
  //   setPage(page+5);  
  //   let franchiseeFormat 
  //   franchiseeFormat = selectedFranchisee && selectedFranchisee
  //   .split(',')[0]
  //   .split(' ')
  //   .map((dt) => dt.charAt(0).toLowerCase() + dt.slice(1))
  //   .join('_')
  //   .toLowerCase();
  //   if(!franchiseeFormat || franchiseeFormat === "undefined"){
  //     // console.log("The if elese",franchiseeFormat)
  //     franchiseeFormat = "all"
  //   }
  //   // console.log("The loadmore franhsie fomrat",franchiseeFormat)
  //   let api_url = '';
  //   api_url = `${BASE_URL}/announcement/?franchiseeAlias=${selectedFranchisee}&search=${search === " " ? "":search}&offset=${page}&limit=5`
  //   console.log("Teh api url",api_url)
    // const response = await axios.get(api_url, {
    //   headers: {
    //     authorization: `Bearer ${localStorage.getItem('token')}`,
    //   },
    // });
  //   console.log("THE REPONSE IN LOAD MORE ",response.data.result)
  //   let newre = response.data.result.searchedData
  //   // console.log("THE LENGTH",response.data.result.searchedData.length)
  //   setCount(response.data.result.count)
  //   // console.log("THE LENGTH inside Load",response.data.result.searchedData.length)
  //   // console.log("The new data",newre)
  //   // console.log("The response",response) 
    
  //   // console.log("Load more button reponse",response)
  //   await setLoadMoreData((prev)=> ([
  //   ...prev,
  //   ...newre
  //   ])); 
  //   // setTheCommon(loadMoreData.length)
  //   loadMoreData.length>0 && console.log("THE LOAD MORE DATA INSIDE",loadMoreData)
  //   } catch (error) {
  //     loadError = error;
  //     console.log("The error insdie load More",error)
  //     console.log("THE OFFSET CALL",offset)
  //     setOffSet(0)
      
  //   }

  //   // fetchUserDetails(e)
  // }
  // const fetchUserDetails = async (e) => {
  //   // e.preventDefault()
  //   try {
  //     let api_url = '';
  //     if(e){
  //       search = e.target.value;
  //     }
  //     // console.log("The e event",e)

  //     console.log("The search value", search)
  //     let franchiseeFormat ="all"
  //     franchiseeFormat = selectedFranchisee && selectedFranchisee
  //     .split(',')[0]
  //     .split(' ')
  //     .map((dt) => dt.charAt(0).toLowerCase() + dt.slice(1))
  //     .join('_')
  //     .toLowerCase();
  //     // console.log("The franhiseFormat",franchiseeFormat)
  //   if(!franchiseeFormat || franchiseeFormat === "undefined"){
  //     // console.log("The if elese",franchiseeFormat)
  //     franchiseeFormat = "all"
  //   }
  //   console.log("The franhiseeFormat",selectedFranchisee)
  //   let offst =0;
  //   let limit =10

  //     // console.log("The franhsie Format",search)
      //  api_url = `${BASE_URL}/announcement/?franchiseeAlias=${selectedFranchisee}&search=${search === " " ? "":search}&offset${offset}=&limit=5`
    

  //   // console.log("The api url",api_url)
    // const response = await axios.get(api_url, {
    //   headers: {
    //     authorization: `Bearer ${localStorage.getItem('token')}`,
    //   },
    // });
  //   // console.log("The data after franchees select",response)

  //     if(response.status === 200 && response.data.status === "success"){
  //         setFranchiseeData(response.data.result)


  //     }    
      
  //     setCount(response.data.result.count)
  //     // setTheCommon(response.data.result.searchedData.length)

  //     // console.log("The franshise count",response.data.result.searchedData.)
  //   } catch (error) {
  //      if(error.response.status === 404){
  //       console.log("The error franchise",error)
  //       setFranchiseeData(error.response.data)
  //      }
  //     // console.log("The error inside franhsie",error)
  //   }
  
  // };
  
  // useEffect(() =>{
  //   if(selectedFranchisee){
  //     // console.log("The franchise user cahnge")
  //     fetchUserDetails()
  //   }
  // },[selectedFranchisee])
  // useEffect(() =>{
  //   loadMore()
  // },[])
  // useEffect(() =>{
  //   setOffSet(10)
  // },[search,selectedFranchisee])

  // useEffect(() =>{
  //   let countc = loadMoreData.length
  //   setTheCommon(countc)
  // },[loadMoreData])

  // useEffect(() =>{
  //   setTheCommon(franchiseeData?.searchedData?.length)
  // },[franchiseeData])

  // useEffect(() =>{
  //   setTheCommon(loadMoreData.length)
  //   setOffSet(0)
  //   loadMore()
  // },[tabLinkPath === "/all-announcements"])
  // console.log("The selectd franhise ",selectedFranchisee)

  // console.log("The frnahsie Data",franchiseeData)
  // // console.log("The id",selectedFranchisee)
  // // console.log("THE PAGE", page)
  //  console.log("THE COMMON LENGHT",theCommon)
  // console.log("The window location",)
  // console.log("THE LOAD MORE DATA",loadMoreData)
  // 

  // let search = ""
  // NEW CODE
  const LoadMoreALl = async() =>{
    // setPage(0);

      try {
        if(tabLinkPath === "/all-announcements"){

          setPage(page+10); 
          
          let api_url = '';
          api_url = `${BASE_URL}/announcement/?franchiseeAlias=${selectedFranchisee}&search=${searchvalue === " " ? "":searchvalue}&offset=${page}&limit=10`
          console.log("THE API URL",api_url)
          const response = await axios.get(api_url, {
            headers: {
              authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          });
          let newre = response.data.result.searchedData
          // setCount(allAnnouncement.length)
          console.log("THE LOAD MROE DATA AFTER ALL-ANNOUCNEMENT PATH",response.data.result) 
          
          console.log("THE NEWRE DATA,",newre)
          setLoadMoreData((prev)=> ([
            ...prev,
            ...newre
           ])); 

           
          
        }
      } catch (error) {
        console.log(" THE LOADMORE ERROR",error)
      }
  }
  const AllannoucementData  = async(e) =>{
    try {
      // let search = ' '
      // setPage(0)
      // console.log("Announcement detial API",page)
      // console.log("THE PAGE NUMBER INSIDE ALLANNOUNCEMENT",page)
      if(e){
          // search = 
          searchvalue = e.target.value 
      }
      // console.log("THE SEARCH INSIDE ALL ANNONCEM",searchvalue)
      let api_url = ' '
      const token = localStorage.getItem('token');
      console.log("INDIA",theLoadOffSet,count)
      api_url = `${BASE_URL}/announcement/?franchiseeAlias=${selectedFranchisee}&search=${searchvalue === " " ? "":searchvalue}&offset=0&limit=5`
      console.log("THE API ALL ANNOUNCEMET",api_url)
      const response = await axios.get(api_url, {
        headers: {
          authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
    //  console.log("THE FRANCHISEE",selectedFranchisee)
     
      console.log("ALL-ANNOUNCEMENT DATA",response.data.result);
      setCount(response.data.result.count)
      // setCount(response.data.result.count)
    //  let newre = response.data.result.searchedData
    //  console.log("THE NEWRE",newre);

      if(response.status === 200 && response.data.status === "success") {
        setAllAnnouncement(response.data.result.searchedData);
       
      }
    } catch (error) {
        if(error.response.status === 404){
          // console.log("The code is 404")
          setAllAnnouncement([])
        }

    }
  }

  const myAnnnoucementData = async() =>{
    try {
      let api_url = ' ';
      // let search = ' '
      console.log("FRANHSIEE NAME INDIE MY ANNOUNCEMENT",selectedFranchisee)
      let usedId = localStorage.getItem("user_id")
      api_url = `${BASE_URL}/announcement/createdAnnouncement/${usedId}/?franchiseeAlias=${selectedFranchisee}&search=${searchvalue === " " ? "":searchvalue}&offset${offset}=&limit=${theLoadOffSet}`

      // api_url = `${BASE_URL}/announcement/createdAnnouncement/${usedId}/?franchiseeAlias=${selectedFranchisee}&search=${search === " " ? "":search}&offset${offset}=&limit=5`

      const response = await axios.get(api_url, {
        headers: {
          authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      // console.log("THE MY ANNOUNCEMENT DATA",response.data.data.searchedData)
      setMyAnnouncementData(response.data.result)
      

    } catch (error) {
        console.log("THE ERROR INSIDE MY ANNOUNCEMENT",error)
    }
  }
  useEffect(() =>{
    if(tabLinkPath==="/all-announcements"){
      console.log("ALL ANNOUNCEMENT CALL TAB")
      AllannoucementData()
      // console.log("LL-ANNOUCEM All annoucement LENGTH",allAnnouncement.length)
      // console.log("THe ALL ANNOUNCEMENT LENGTH",allAnnouncement)
      setTheCommon(allAnnouncement.length)
      // setLoadMoreData(loadMoreData.slice(0,5))
      setPage(page+10)
    }
    else{
      console.log("MY ANNOUNCEMENT CALL TAB")
      setPage(0)
      myAnnnoucementData()
      // setLoadMoreData(loadMoreData.slice(0,5))
      
      // setLoadMoreData([])
      // LoadMoreALl()

    }
  },[tabLinkPath])
  useEffect(() =>{
    if(selectedFranchisee && tabLinkPath==="/all-announcements"){
      AllannoucementData()
      setPage(0)
      // setLoadMoreData([])
    }
    else if(selectedFranchisee && tabLinkPath==="/my-announcements" ){
      // console.log("INSIDE MY ANNOUNCEMENT USEEFFCT")
      myAnnnoucementData()
      setLoadMoreData(loadMoreData.slice(0,5))
      setPage(0)
     }
  },[selectedFranchisee])
  useEffect(() =>{
    LoadMoreALl()
    // setTheCommon(allAnnouncement.length)
    // AllannoucementData()
    // console.log("THE LOAD MORE IS CALLING")
  },[])
  useEffect(()=>{
    setTheCommon(loadMoreData.length)
    setAllAnnouncement(loadMoreData)
    setTheLoadOffSet(loadMoreData.length)
    // setCount(allAnnouncement.length)
  },[loadMoreData])
  // useEffect(()=>{
  //   console.log("THE ANNOUCNEMENT COUNT 2124",allAnnouncement.length)
  //   setCount(allAnnouncement.length) 
  // },[allAnnouncement])
  

  // console.log("THE LENGHT LOAD MORE DATA",loadMoreData)
  // console.log("The page NUMBER",page)
   console.log("THE COUNT AND COMMON",theCount,theCommon)
  // console.log("THE LENGHT PLEASE", theLoadOffSet)
  // console.log("THE SEATCH VALUE",searchvalue)
  console.log("The ALL ANNOUCNEMENT DTATA DKL M",allAnnouncement,loadMoreData)
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
                 
                  {/* searchValue={search} franchisee ={franchiseeData} loadData={loadMoreData} */}
            <div className="training-column">
                    {tabLinkPath === "/all-announcements" 
                      && <AllAnnouncements allAnnouncement={allAnnouncement} loadMoreData ={loadMoreData} search = {searchvalue} />}
                    {tabLinkPath === "/my-announcements" 
                      && <MyAnnouncements />}
                
                  </div>
                  {/* {franchiseeData && franchiseeData.searchedData.length} */}
                  {theCommon && theCommon ===theCount ? (
                    null
                  ):(
                    <button type="button" onClick={LoadMoreALl} class="btn btn-primary">Load More</button>

                  ) }
                  {/* {theCommon === theCount ? (
                    <h1>Equal</h1>
                  ):(
                      <h1>unequal</h1>
                    )
                } */}
                 
                
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
