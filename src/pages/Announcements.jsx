import React, { useState, useEffect } from "react";
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

const Announcements = () => {
  const [allAnnouncement, setAllAnnouncement] = useState([])
  const [tabLinkPath, setTabLinkPath] = useState("/all-announcements");
  // const [search,setSearch]=useState("");
  const [searchData, setSearchData] = useState([])
  const [searchword, setSearchWord] = useState("");
  const [selectedFranchisee, setSelectedFranchisee] = useState("all");
  // const [franchiseeData,setFranchiseeData]=useState('');
  const [theLoadOffSet, setTheLoadOffSet] = useState(0)
  const [offset, setOffSet] = useState(0)
  const [page, setPage] = useState(0);
  const [mypage, setMyPage] = useState(0);
  const [loadMoreData, setLoadMoreData] = useState([])
  const [theCount, setCount] = useState(null)
  const [theCommon, setTheCommon] = useState(null)
  const [myAnnouncementData, setMyAnnouncementData] = useState([])
  const [myLoadData, setMyLoadData] = useState([])
  const [myDataLength, setMyDataLength] = useState('')
  const [myCount, setMyCount] = useState('');
  const handleLinkClick = event => {
    let path = event.target.getAttribute('path');
    setTabLinkPath(path);
  }

  // NEW CODE
  let searchvalue = ""
  let loadError = " "
  let count = ""

  const handleSearchOnChange = (e) => {
    e.preventDefault();
    if (tabLinkPath === "/all-announcements") {
      console.log("THE SEARCH ALL ANNOUNCMENT")
      AllannoucementData(e)
    }
    else {
      console.log("THE SEARCH IN MY ANNOUNCEMENT")
      myAnnnoucementData(e)
    }
    // fetchUserDetails(e)    //  console.log("The api_url",api_url)
  };
  const handleLoadMyAnnouncement = (e) => {
    e.preventDefault()
    LoadMoreMyData()

  }
  const LoadMoreMyData = async () => {
    console.log("THE MY DATA LOAD MORE", mypage)
    try {

      setMyPage(mypage + 5)
      console.log("THE SETMYPAGE", mypage)
      let api_url = '';
      let usedId = localStorage.getItem("user_id")

      api_url = `${BASE_URL}/announcement/createdAnnouncement/${usedId}/?franchiseeAlias=${selectedFranchisee}&search=${searchvalue === " " ? "" : searchvalue}&offset=${mypage}&limit=5`
      // api_url = `${BASE_URL}/announcement/?franchiseeAlias=${selectedFranchisee}&search=${searchvalue === " " ? "":searchvalue}&offset=${page}&limit=5`
      console.log("THE API URL Mydata", api_url)
      const response = await axios.get(api_url, {
        headers: {
          authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      let myData = response.data.data.searchedData
      console.log("THE MY RESPONSE LOAD MORE", response)
      setMyLoadData((prev) => ([
        ...prev,
        ...myData
      ]))
    } catch (error) {
      console.log("THE  My MORE DATA", error)
    }
  }
  const myDataCount = async () => {
    let api_url = ' '
    let franhiseAlias = "all"
    let usedId = localStorage.getItem("user_id")
    api_url = `${BASE_URL}/announcement/createdAnnouncement/${usedId}/?franchiseeAlias=${franhiseAlias}&search=&offset=0&limit=5`

    // api_url = `${BASE_URL}/announcement/?franchiseeAlias=${selectedFranchisee}&search=${searchvalue === " " ? "":searchvalue}&offset=0&limit=5`
    const response = await axios.get(api_url, {
      headers: {
        authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    // console.log("The reponse for count",response.data.result)
    //  console.log("THE COUNT OF MY DATA",response.data.data)
    setMyCount(response.data.data.count)
  }
  const handelLoadMore = (e) => {
    e.preventDefault()
    LoadMoreALl()

  }
  const LoadMoreALl = async () => {
    console.log("THE PAGE Outside", page)

    try {
      if (tabLinkPath === "/all-announcements") {
        // if(page>5){
        //   setPage(5);
        // }
        // else if(page === 5){
        //   setPage(5)
        // }

        setPage(page + 5)

        console.log("THE LOAD MORE DATA ", loadMoreData)

        console.log("THE PAGE INSIDE", page)
        let api_url = '';
        api_url = `${BASE_URL}/announcement/?franchiseeAlias=${selectedFranchisee}&search=${searchvalue === " " ? "" : searchvalue}&offset=${page}&limit=5`
        console.log("THE API URL LOADMOREALL", api_url)
        const response = await axios.get(api_url, {
          headers: {
            authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        console.log("THE RESPONSE IN LOADMORE ALL", response.data)
        let newre = response.data.result.searchedData
        // setCount(allAnnouncement.length)
        console.log("THE LOAD MROE DATA AFTER ALL-ANNOUCNEMENT PATH", response.data.result)

        console.log("THE New Load More adat,", loadMoreData)
        setLoadMoreData((prev) => ([
          ...prev,
          ...newre
        ]));
      }
    } catch (error) {
      console.log(" THE LOADMORE ERROR", error)
    }
  }
  //ALL Announcement API CALL


  const AllannoucementData = async (e) => {
    try {
      // console.log("THE ALL ANNOUNCEMENT DATA CALL")
      if (e) {
        searchvalue = e.target.value
      }
      let api_url = ' '
      if (searchvalue) {
        console.log("NO search value ", searchvalue)
        api_url = `${BASE_URL}/announcement/?franchiseeAlias=${selectedFranchisee}&search=${searchvalue === " " ? "" : searchvalue}&offset=0&limit=${theCount}`
        const response = await axios.get(api_url, {
          headers: {
            authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        if (response.status === 200 && response.data.status === "success") {
          setAllAnnouncement(response.data.result.searchedData);

        }
        else {
          console.log("NO DATA TO SEARCH")
        }
      }
      else {
        console.log("THE PAGE for lloadMoreoad ", page)
        setPage(5)
        //  if(loadMoreData>5){
        setLoadMoreData(loadMoreData.slice(0, 5))
        // }
        //  setLoadMoreData([])
        // console.log("THE ELSE",loadMoreData)
        //  setLoadMoreData(loadMoreData.slice(0,5))
        //  LoadMoreALl()
        console.log("THE SEARCH VLAUE NOW EMPTY")
        console.log("THE lenght", theCommon, count, page)
        api_url = `${BASE_URL}/announcement/?franchiseeAlias=${selectedFranchisee}&search=${searchvalue === " " ? "" : searchvalue}&offset=0&limit=5`
        const response = await axios.get(api_url, {
          headers: {
            authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        console.log("THE else serach", response)
        // LoadMoreALl()

        if (response.status === 200 && response.data.status === "success") {
          setAllAnnouncement(response.data.result.searchedData);
          setTheCommon(allAnnouncement.length)

        }
      }
    } catch (error) {
      if (error.response.status === 404) {
        // console.log("The code is 404")
        setAllAnnouncement([])
      }

    }
  }
  const onLoadAnnouncement = async () => {
    try {

      console.log("ON LOAD ALL ANNOUCEMENT CALL FUNCTON")
      let api_url = " "
      api_url = `${BASE_URL}/announcement/?franchiseeAlias=${selectedFranchisee}&search=${searchvalue === " " ? "" : searchvalue}&offset=0&limit=5`
      console.log("THE API_URL ONLOAD ANNOUCNEMENT", api_url)
      const response = await axios.get(api_url, {
        headers: {
          authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      console.log("The franhise change and ", response.data)
      if (response.status === 200 && response.data.status === "success") {
        setAllAnnouncement(response.data.result.searchedData);
        //  console.log("THE DATA INSIDE SELECT FRANHSIE",response.data.result)
        setTheCommon(response.data.result.searchedData.length)
        setCount(response.data.result.count)
        console.log("THE PAGE DSADA", page, response.data.result.searchedData.length)
        //  console.log("THE COUNT AFTER ",response.data.result.count)
        //  setLoadMoreData(loadMoreData.slice(0,5))
        //  setPage(5)
        if (response.data.result.searchedData.length > 5) {
          console.log(" DATA LENGTH IS GREATER THEN 5")
          setPage(0)
        }
        else {
          console.log(" DATA IS NOT FREATER THEN LENGTH 5")
          setPage(5)
        }
      }
      else {
        console.log('NOT DATA AVIABKLE in thi franhsi')
        setAllAnnouncement([])
      }

    } catch (error) {
      console.log("THE ERROR INSIDE ON LOAD ANNOUNCEMNET", error)
      setAllAnnouncement([])
      setCount(0)
      setTheCommon(0)

    }
  }

  const onLoadMyAnnouncement = async () => {

    try {
      let usedId = localStorage.getItem("user_id")
      let api_url = " "
      api_url = `${BASE_URL}/announcement/createdAnnouncement/${usedId}/?franchiseeAlias=${selectedFranchisee}&search=${searchvalue === " " ? "" : searchvalue}&offset=0&limit=5`
      // api_url = `${BASE_URL}/announcement/?franchiseeAlias=${selectedFranchisee}&search=${searchvalue === " " ? "":searchvalue}&offset=0&limit=5`
      console.log("API_URL ONLOAD MY ANNOUCNEMENT", api_url)
      const response = await axios.get(api_url, {
        headers: {
          authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      console.log("ON LOAD MY ANNOUNCEMENT ", response.data, response.data.data.searchedData.length, myDataLength)
      if (response.status === 200 && response.data.status) {
        setMyAnnouncementData(response.data.data.searchedData)
        let datalength = response.data.data.searchedData.length
        console.log("THE LENGHT", datalength)
        setMyDataLength(datalength)
        setMyCount(response.data.data.count)
        // setMyLoadData(myLoadData.slice(0,5))
        if (datalength > 5) {
          setPage(0)
        }
        else {
          setMyPage(5)

        }
      }
    } catch (error) {
      console.log("There is no data")
      setMyAnnouncementData([])
    }
  }
  const myAnnnoucementData = async (e) => {
    setPage(0)
    try {
      let api_url = ' ';
      // setPage(0)
      if (e) {
        searchvalue = e.target.value
      }
      if (searchvalue) {
        console.log("THE SERACH VALUE IN MY", searchvalue)
        let usedId = localStorage.getItem("user_id")
        api_url = `${BASE_URL}/announcement/createdAnnouncement/${usedId}/?franchiseeAlias=${selectedFranchisee}&search=${searchvalue === " " ? "" : searchvalue}&offset=0&limit=1000`

        // api_url = `${BASE_URL}/announcement/createdAnnouncement/${usedId}/?franchiseeAlias=${selectedFranchisee}&search=${search === " " ? "":search}&offset${offset}=&limit=5`

        const response = await axios.get(api_url, {
          headers: {
            authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        console.log("THE MY ANNOUCOUNCEMENT", response)
        if (response.status === 200 && response.data.status === "success") {
          setMyAnnouncementData(response.data.data.searchedData)
        }
        else {
          console.log("THE DATA NOTE FOUNC")
        }
      }
      else {
        console.log("NO SEARCH VALUE")
        // setMyPage(5)
        setMyLoadData(myLoadData.slice(0, 5))
        let usedId = localStorage.getItem("user_id")
        api_url = `${BASE_URL}/announcement/createdAnnouncement/${usedId}/?franchiseeAlias=${selectedFranchisee}&search=${searchvalue === " " ? "" : searchvalue}&offset=0&limit=5`
        const response = await axios.get(api_url, {
          headers: {
            authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        console.log("THE MY ANNOUNCEMENT DATA", response)
        console.log("THE MY SEARCH URL ", api_url)
        console.log("THE Search value have nothing", myAnnouncementData)
        if (response.status === 200 && response.status === "success") {

          setMyAnnouncementData(response.data.data.searchedData)
          setMyDataLength(myAnnouncementData.length)
        }
      }
    } catch (error) {
      // console.log("THE ERROR INSIDE MY ANNOUNCEMENT",error)
      setMyAnnouncementData([])
    }
  }
  const TheCount = async () => {
    let api_url = ' '
    api_url = `${BASE_URL}/announcement/?franchiseeAlias=${selectedFranchisee}&search=${searchvalue === " " ? "" : searchvalue}&offset=0&limit=5`
    const response = await axios.get(api_url, {
      headers: {
        authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    console.log("The reponse for count", response.data.result.count)
    setCount(response.data.result.count)
  }
  // useEffect(() =>{
  //   console.log("THE TBALINK PATH",tabLinkPath)
  //   if(tabLinkPath==="/all-announcements"){
  //     console.log("ALL ANNOUNCEMENT CALL TAB")
  //     onLoadAnnouncement()
  //     // console.log("LL-ANNOUCEM All annoucement LENGTH",allAnnouncement)
  //     // console.log("THe ALL ANNOUNCEMENT LENGTH",allAnnouncement)
  //     // setTheCommon(allAnnouncement.length)

  //     // setCount(count)
  //     setLoadMoreData(loadMoreData.slice(0,5))
  //     setPage(page+5)
  //     setMyPage(5)
  //     console.log("THE ALL ANNOUNCEMENT",loadMoreData)


  //   }
  //   else if(tabLinkPath==="/my-announcements"){
  //     // setPage(0)
  //     // myAnnnoucementData()
  //     onLoadMyAnnouncement()
  //     if(mypage>5){
  //       setMyPage(0);
  //     }

  //     setMyLoadData(myLoadData.slice(0,5))
  //     // setMyDataLength(myAnnouncementData.length)
  //     console.log("MY ANNOUNCEMENT CALL TAB",mypage)
  //     // console.log(" All annoucement LENGTH in MYANNOUCNEMT",allAnnouncement.length)
  //     // setLoadMoreData(loadMoreData.slice(0,5))
  //     // setLoadMoreData([])
  //     // LoadMoreALl()

  //   }
  // },[tabLinkPath])

  useEffect(() => {
    if (selectedFranchisee && tabLinkPath === "/all-announcements") {
      onLoadAnnouncement()
      console.log(" SELECT FRANHSIE ON LOADANNOUNCEMENT", loadMoreData, allAnnouncement)
      // console.log()
      // setPage(0)
      // setLoadMoreData([])
      // console.log("THE TAB ANNOUCE",allAnnouncement)
    }
    else if (selectedFranchisee && tabLinkPath === "/my-announcements") {
      // console.log("INSIDE MY ANNOUNCEMENT USEEFFCT")
      onLoadMyAnnouncement()
      // setLoadMoreData(loadMoreData.slice(0,5))
      // setPage(0)
    }
  }, [selectedFranchisee])
  useEffect(() => {
    LoadMoreALl()
    TheCount()
    LoadMoreMyData()
    myDataCount()
  }, [])
  useEffect(() => {
    setTheCommon(loadMoreData.length)
    console.log("ALL CNN ", loadMoreData)
  }, [loadMoreData])
  useEffect(() => {
    setMyDataLength(myLoadData.length)

  }, [myLoadData])


  console.log("THE COUNT AND COMMON", theCount, theCommon)
  // console.log("MY COUNT AND MY data lenght",myCount,myDataLength)
  // console.log("THE LOAD MORE MY DATA",myLoadData)
  console.log("PAGE", page)
  console.log("THE New Load More adat,", loadMoreData)


  // console.log("THE LENGHT PLEASE", theLoadOffSet)
  // console.log("THE SEATCH VALUE",searchvalue)
  // console.log("The ALL ANNOUCNEMENT DTATA DKL M",allAnnouncement,loadMoreData)
  return (
    <>
      <div id="main">
        <section className="mainsection">
          <Container>
            <div className="admin-wrapper">
              <aside className="app-sidebar">
                <LeftNavbar />
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
                      <li><a onClick={handleLinkClick} path="/all-announcements" className={`${tabLinkPath === "/all-announcements" ? "active" : ""}`}>All Announcements</a></li>
                      <li><a onClick={handleLinkClick} path="/my-announcements" className={`${tabLinkPath === "/my-announcements" ? "active" : ""}`} >My Announcements</a></li>

                    </ul>
                  </div>

                  {/* searchValue={search} franchisee ={franchiseeData} loadData={loadMoreData} */}
                  <div className="training-column">
                    {tabLinkPath === "/all-announcements"
                      && <AllAnnouncements allAnnouncement={allAnnouncement} loadMoreData={loadMoreData} search={searchvalue} />}
                    {tabLinkPath === "/my-announcements"
                      && <MyAnnouncements myAnnouncementData={myAnnouncementData} myLoadData={myLoadData} />}
                  </div>
                  {/* {franchiseeData && franchiseeData.searchedData.length} */}
                  {/* {theCommon && theCommon ===theCount ? (
                    null
                  ):(
                    <button type="button" onClick={handelLoadMore} class="btn btn-primary">Load More</button>

                  ) } */}
                  {/* {
                    tabLinkPath=== "/all-announcements" ? 
                      {theCommon ===theCount ? (
                        null
                      ):(
                        <button type="button" onClick={handelLoadMore} class="btn btn-primary">Load More</button>
    
                      ) }
                    :(
                      <h1>My Annoucnement</h1>
                    )
                  } */}
                  {
                    tabLinkPath === "/all-announcements" ?
                      (
                        <>
                          {theCommon === theCount ? (
                            null
                          ) : (
                            <button type="button" onClick={handelLoadMore} class="btn btn-primary">Load More</button>

                          )}</>
                      )
                      : (
                        <>
                          {myDataLength === myCount ? (
                            null
                          ) :
                            (
                              <button type="button" onClick={handleLoadMyAnnouncement} class="btn btn-primary">Load More My</button>

                            )

                          }
                        </>

                      )

                  }
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
