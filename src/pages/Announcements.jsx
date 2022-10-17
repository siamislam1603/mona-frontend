import React, { useState, useEffect, useRef } from "react";
import { Button, Container, Form, Dropdown, Accordion, Row, Col } from "react-bootstrap";
import LeftNavbar from "../components/LeftNavbar";
import TopHeader from "../components/TopHeader";
import { BASE_URL } from "../components/App";
import axios from "axios";
import AllAnnouncements from "./AllAnnouncements";
import MyAnnouncements from "./MyAnnouncements";
import AllEvent from "./AllEvent";
import { verifyPermission } from '../helpers/roleBasedAccess';
import { useParams } from "react-router-dom";
import { useHistory ,useLocation } from 'react-router-dom';





const Announcements = () => {
  const Params = useParams();



  let ActiveLink = Params

  const [allAnnouncement, setAllAnnouncement] = useState([])
  const [theMyAnnouncement, setTheMyAnnoucemenet] = useState([])

  const [tabLinkPath, setTabLinkPath] = useState("/all-announcements");
  // console.log(tabLinkPath, "tabLinkPath")
  // const [search,setSearch]=useState(""); 
  const [userRole, setUserRole] = useState(null)
  const [selectedFranchisee, setSelectedFranchisee] = useState("all");
  // const [franchiseeData,setFranchiseeData]=useState('');
  const [page, setPage] = useState(0);
  const [mypage, setMyPage] = useState(0);
  const [loadMoreData, setLoadMoreData] = useState([])
  const [loadMoreEvent, setLoadMoreEvent] = useState([])
  const [pageEvent, setpageEvent] = useState(0)
  const [theCount, setCount] = useState(null)
  const [theCommon, setTheCommon] = useState(null)
  // const [myAnnouncementData,setMyAnnouncementData]= useState([])
  const [myLoadData, setMyLoadData] = useState([])
  const [myDataLength, setMyDataLength] = useState(null)
  const [myCount, setMyCount] = useState('');
  const [eventLength, setEventLength] = useState(null)
  const [eventCount, setEventCount] = useState(null)
  const [allEvent, setAllEvent] = useState([])
  const [topMessage, setTopMessage] = useState(null);

  const [loadMy, setLoadMy] = useState(true);
  const [loadEvent, setLoadEvent] = useState(true)
  const [loadAllAnnouncement, setLoadAllAnnouncement] = useState(true)
  const [topErrorMessage, setTopErrorMessage] = useState(null);

  const handleLinkClick = event => {
    let path = event.target.getAttribute('path');
    setTabLinkPath(path);

  }
  const [data, setData] = useState();
  const prevCountRef = useRef();


  // NEW CODE
  let searchvalue = ""
  let count = ""


  const handleSearchOnChange = (e) => {
    e.preventDefault();
    if (tabLinkPath === "/all-announcements") {
      // console.log("THE SEARCH ALL ANNOUNCMENT")
      AllannoucementData(e)
    }

    else if(tabLinkPath=== "/my-announcements"){
      myAnnnoucementData(e)  

    }
    

    else {
      // console.log("SEARCH IN EVENTS")
      AllEventSearch(e)
    }
    // fetchUserDetails(e)    //  console.log("The api_url",api_url)
  };
  const handleLoadMoreEvent = (e) => {
    e.preventDefault()
    LoadMoreEvent()
  }
  const LoadMoreEvent = async () => {
    try {

      setpageEvent(pageEvent + 5)
      let api_url = '';
      api_url = `${BASE_URL}/announcement/?franchiseeAlias=${selectedFranchisee}&&isEvent=1search=${searchvalue === " " ? "" : searchvalue}&offset=${pageEvent}&limit=5`
      // console.log("THE API URL LOADMOREALL", api_url)
      const response = await axios.get(api_url, {
        headers: {
          authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      let newData = response.data.result.searchedData
      setLoadMoreEvent((prev) => ([
        ...prev,
        ...newData
      ]))

    } catch (error) {
      
    }
  }
  const handleLoadMyAnnouncement = (e) => {
    e.preventDefault()
    LoadMoreMyData()

    // myDataCount()
  }
  const removeitem = async(id) =>{
    // let newData = myLoadData.filter(d => d.id !==id)
    // console.log("THE NEW DATA",newData)
    try{

      let usedId = localStorage.getItem("user_id")
  
      let api_url = '';
      api_url = `${BASE_URL}/announcement/created-announcement-events/${usedId}/?franchiseeAlias=${selectedFranchisee}&search=${searchvalue === " " ? "" : searchvalue}&limit=${myDataLength}`
  
      const response = await  axios.get(api_url, {
        headers: {
          authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      let myData = response.data.result.searchedData
      setMyLoadData(myData)
      setMyDataLength(myData?.length)
      myDataCount()
    }
    catch(error ){
      if(error.response.status === 404){
        myDataCount()
        onLoadMyAnnouncement()

      }
    }
    // setMyLoadData(newData)
    // LoadMoreMyData(id);

  }
  

  const LoadMoreMyData = async (data) => {
    //  setPage(0)
    try {
      let userId = localStorage.getItem("user_id")
      setMyPage(mypage + 5)
      let api_url = '';
     

          api_url = `${BASE_URL}/announcement/created-announcement-events/${userId}/?franchiseeAlias=${selectedFranchisee}&search=${searchvalue === " " ? "" : searchvalue}&offset=${mypage}&limit=5`
          // api_url = `${BASE_URL}/announcement/createdAnnouncement/${usedId}/?franchiseeAlias=${selectedFranchisee}&search=${searchvalue === " " ? "":searchvalue}&offset=${mypage}&limit=5`
          // api_url = `${BASE_URL}/announcement/?franchiseeAlias=${selectedFranchisee}&search=${searchvalue === " " ? "":searchvalue}&offset=${page}&limit=5`
          const response = await axios.get(api_url, {
            headers: {
              authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          });
          let myData = response.data.result.searchedData
          setMyLoadData((prev) =>(
            [
              ...prev,
              ...myData
            ]
           ))     
    } catch (error) {
      setMyCount(0)
      setMyDataLength(0)

    }
  }


  const myDataCount = async () => {
    try {
      
      let api_url = ' '
      let franhiseAlias = "all"
      let userId = localStorage.getItem("user_id")

      api_url = `${BASE_URL}/announcement/created-announcement-events/${userId}/?franchiseeAlias=${selectedFranchisee}&search=${searchvalue === " " ? "" : searchvalue}&offset=0&limit=5`

      // api_url = `${BASE_URL}/announcement/createdAnnouncement/${usedId}/?franchiseeAlias=${franhiseAlias}&search=&offset=0&limit=5`

      // api_url = `${BASE_URL}/announcement/?franchiseeAlias=${selectedFranchisee}&search=${searchvalue === " " ? "":searchvalue}&offset=0&limit=5`
      const response = await axios.get(api_url, {
        headers: {
          authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setMyCount(response.data.result.count)
      

    } catch (error) {
      setMyCount(0)
      setMyDataLength(0)
      setLoadMy(false)
      setMyLoadData([])
    }

  }
  const handelLoadMore = (e) => {
    e.preventDefault()
    LoadMoreALl()

  }
  const LoadMoreALl = async (e) => {

    try {
      if (tabLinkPath === "/all-announcements") {
        if(page>5){
           setPage(5);
        }
        else{
          setPage(page+5)
        }
        setPage(page + 5)


        // console.log("THE PAGE INSIDE", page)
        let api_url = '';
        api_url = `${BASE_URL}/announcement/?franchiseeAlias=${selectedFranchisee}&&isEvent=0search=${searchvalue === " " ? "" : searchvalue}&offset=${page}&limit=5`
        const response = await axios.get(api_url, {
          headers: {
            authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        let newre = response.data.result.searchedData
        setTheCommon(allAnnouncement.length)


        setLoadMoreData((prev) => ([
          ...prev,
          ...newre
        ]));
      }
    } catch (error) {
      setCount(0)
      setTheCommon(0)
    }
  }


  //ALL Announcement API CALL


  const AllannoucementData = async (e) => {
    setPage(0)
    try {
      // console.log("THE ALL ANNOUNCEMENT DATA CALL")
      if (e) {
        searchvalue = e.target.value
      }
      let api_url = ' '
      if (searchvalue) {
        // console.log("NO search value ", searchvalue)
        api_url = `${BASE_URL}/announcement/?franchiseeAlias=${selectedFranchisee}&isEvent=0&search=${searchvalue === " " ? "" : searchvalue}&offset=0&limit=${theCount}`
        const response = await axios.get(api_url, {
          headers: {
            authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        if (response.status === 200 && response.data.status === "success") {
          setAllAnnouncement(response.data.result.searchedData);
          setTheCommon(theCount)
        }
        if (response.data.result.searchedData.length === 0) {
          setLoadAllAnnouncement(false)
        }
        else {
          // console.log("NO DATA TO SEARCH")
        }
      }
      else {
        setPage(5)

        setLoadMoreData(loadMoreData.slice(0, 5))
        api_url = `${BASE_URL}/announcement/?franchiseeAlias=${selectedFranchisee}&isEvent=0&search=${searchvalue === " " ? "" : searchvalue}&offset=0&limit=5`
        const response = await axios.get(api_url, {
          headers: {
            authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        // LoadMoreALl()

        if (response.status === 200 && response.data.status === "success") {
          setAllAnnouncement(response.data.result.searchedData);
          setTheCommon(response.data.result.searchedData.length)
          setLoadAllAnnouncement(true)

        }
        if (response.data.result.searchedData.length === 0) {
          setLoadAllAnnouncement(false)
        }
      }
    } catch (error) {
      if (error.response.status === 404) {
        setAllAnnouncement([])
        setLoadAllAnnouncement(false)
      }

    }
  }
  const onLoadAnnouncement = async () => {
    try {
      // if (page > 5) {
      //   setPage(5)
      // }
      // else {
      //   setPage(page + 5)
      // }

      let api_url = " "

      api_url = `${BASE_URL}/announcement/?franchiseeAlias=${selectedFranchisee}&isEvent=0&search=${searchvalue === " " ? "" : searchvalue}&offset=0&limit=5`
      const response = await axios.get(api_url, {
        headers: {
          authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (response.status === 200 && response.data.status === "success") {
        setAllAnnouncement(response.data.result.searchedData);
        //  console.log("THE DATA INSIDE SELECT FRANHSIE",response.data.result)
        setTheCommon(response.data.result.searchedData.length)
        setCount(response.data.result.count)

        //  console.log("THE COUNT AFTER ",response.data.result.count)
        //  setLoadMoreData(loadMoreData.slice(0,5))
        //  setPage(5)
        setLoadMoreData(response.data.result.searchedData)
        setLoadAllAnnouncement(true)
        if (response.data.result.searchedData.length > 5) {
          setPage(0)
        }
      }
    } catch (error) {
      setAllAnnouncement([])
      setCount(0)
      setTheCommon(0)
      setLoadAllAnnouncement(false)

    }
  }
  const OnLoadEvent = async () => {
    try {
      // console.log("Announcement detial API")
      if (pageEvent > 5) {
        setpageEvent(5)
      }
      else {
        setpageEvent(pageEvent + 5)
      }
      let api_url = " "
      api_url = `${BASE_URL}/announcement/?franchiseeAlias=${selectedFranchisee}&isEvent=0&search=${searchvalue === " " ? "" : searchvalue}&offset=0&limit=5`
      const token = localStorage.getItem('token');
      // let franhiseAlias = "all"
      const response = await axios.get(`${BASE_URL}/announcement/?franchiseeAlias=${selectedFranchisee}&isEvent=1&search=&offset=0&limit=5`, {
        headers: {
          "Authorization": "Bearer " + token
        }
      });
      // console.log("The All Announcement",response.data.result);
      if (response.status === 200 && response.data.status === "success") {
        setAllEvent(response.data.result.searchedData);
        setEventLength(response.data.result.searchedData.length)
        setEventCount(response.data.result.count)
        setLoadMoreEvent(response.data.result.searchedData)
        setLoadEvent(true)
      }
    } catch (error) {
      if (error.response.status === 404) {
        // setAnnouncementDetail([])
        setEventCount(0)
        setEventLength(0)
        setAllEvent([])
        setLoadEvent(false)
      }

    }

  }
  const onLoadMyAnnouncement = async () => {

    try {
      let userId = localStorage.getItem("user_id")
      let api_url = " "
      // api_url='http://localhost:4000/announcement/created-announcement-events/2/?franchiseeAlias=all&limit=25&search='
      // api_url = `${BASE_URL}/announcement/createdAnnouncement/${usedId}/?franchiseeAlias=${selectedFranchisee}&search=${searchvalue === " " ? "":searchvalue}&offset=0&limit=5`
      api_url = `${BASE_URL}/announcement/created-announcement-events/${userId}/?franchiseeAlias=${selectedFranchisee}&search=${searchvalue === " " ? "" : searchvalue}&offset=0&limit=5`
      const response = await axios.get(api_url, {
        headers: {
          authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setTheMyAnnoucemenet(response.data.result.searchedData)
      setMyLoadData(response.data.result.searchedData)
      let datalength = response.data.result.searchedData.length
      setMyDataLength(response.data.result.searchedData.length)
      setMyCount(response.data.result.count)
      setLoadMy(true)
      // setMyLoadData(response.data.result.searchedData)
      // if(datalength>5){
      //   setPage(0)
      // }
      // else{
      //  setMyPage(5)

      // setTheMyAnnoucemenet(response.data.result.searchedData)
      // setMyLoadData(response.data.result.searchedData)
      // let datalength = response.data.result.searchedData.length
      // console.log("THE LENGHT", datalength)
      // setMyDataLength(response.data.result.searchedData.length)
      // setMyCount(response.data.result.count)
      // console.log("THE MYPAGE INSIDE LOAD", mypage)
      // setMyLoadData(response.data.result.searchedData)
      // if(datalength>5){
      //   setPage(0)
      // }
      // else{
      //  setMyPage(5)

      // }
    }
    catch (error) {
      setTheMyAnnoucemenet([])
      setMyCount(0)
      setMyDataLength(0)
      setLoadMy(false)

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
        let usedId = localStorage.getItem("user_id")
        // api_url = `${BASE_URL}/announcement/createdAnnouncement/${usedId}/?franchiseeAlias=${selectedFranchisee}&search=${searchvalue === " " ? "":searchvalue}&offset=0&limit=1000`

        // api_url = `${BASE_URL}/announcement/createdAnnouncement/${usedId}/?franchiseeAlias=${selectedFranchisee}&search=${search === " " ? "":search}&offset${offset}=&limit=5`
        let userId = localStorage.getItem("user_id")
        api_url = `${BASE_URL}/announcement/created-announcement-events/${userId}/?franchiseeAlias=${selectedFranchisee}&search=${searchvalue === " " ? "" : searchvalue}&offset=0&limit=${myCount}`
        const response = await axios.get(api_url, {
          headers: {
            authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        setTheMyAnnoucemenet(response.data.result.searchedData)
        setLoadMy(true)
        setMyDataLength(myCount)
        // setMyCount(0)
        // setMyDataLength(myCount)

        if (response.data.result.searchedData.length === 0) {
          setLoadMy(false)
        }


      }

      else {
        setMyPage(5)
        setMyLoadData(myLoadData.slice(0, 5))
        let userId = localStorage.getItem("user_id")
        api_url = `${BASE_URL}/announcement/created-announcement-events/${userId}/?franchiseeAlias=${selectedFranchisee}&search=${searchvalue === " " ? "" : searchvalue}&offset=0&limit=5`

        // api_url = `${BASE_URL}/announcement/createdAnnouncement/${usedId}/?franchiseeAlias=${selectedFranchisee}&search=${searchvalue === " " ? "":searchvalue}&offset=0&limit=5`
        const response = await axios.get(api_url, {
          headers: {
            authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        // console.log("THE Search value have nothing",myAnnouncementData)
        setTheMyAnnoucemenet(response.data.result.searchedData)
        setMyDataLength(response.data.result.searchedData.length)
        setLoadMy(true)
      }
    } catch (error) {
      setTheMyAnnoucemenet([])
      setLoadMy(false)
    }
  }
  const AllEventSearch = async (e) => {

    try {
      if (e) {
        searchvalue = e.target.value
      }
      if (searchvalue) {
        let api_url = ' '
        let usedId = localStorage.getItem("user_id")
        // api_url = `${BASE_URL}/announcement/createdAnnouncement/${usedId}/?franchiseeAlias=${selectedFranchisee}&search=${searchvalue === " " ? "":searchvalue}&offset=0&limit=1000`

        // api_url = `${BASE_URL}/announcement/createdAnnouncement/${usedId}/?franchiseeAlias=${selectedFranchisee}&search=${search === " " ? "":search}&offset${offset}=&limit=5`
        let userId = localStorage.getItem("user_id")
        //  /announcement/?franchiseeAlias=${franhiseAlias}&isEvent=1&search=&offset=0&limit=5
        api_url = `${BASE_URL}/announcement/?franchiseeAlias=${selectedFranchisee}&isEvent=1&search=${searchvalue === " " ? "" : searchvalue}&offset=0&limit=${eventCount}`
        const response = await axios.get(api_url, {
          headers: {
            authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
        if (response.status === 200 && response.data.status === "success") {
          setAllEvent(response.data.result.searchedData)
          setEventLength(eventCount)
         
        }
        if (response.data.result.searchedData.length === 0) {
          setLoadEvent(false)
        }
      }
        else{
          setpageEvent(5)
          setLoadMoreEvent(loadMoreEvent.slice(0,5))
          let api_url= ' '
          let userId = localStorage.getItem("user_id")
          const token = localStorage.getItem('token');
 
          const response = await axios.get(`${BASE_URL}/announcement/?franchiseeAlias=${selectedFranchisee}&isEvent=1&search=&offset=0&limit=5`, {
            headers: {
              "Authorization": "Bearer " + token
            }
          })
          if(response.status === 200 &&  response.data.status === "success"){
            setAllEvent(response.data.result.searchedData)
            setEventLength(response.data.result.searchedData.length)
            setLoadEvent(true)


        }


      
       
      }
      } catch (error) {
      setAllEvent([])
      setLoadEvent(false)
    }
  }
  const TheCount = async () => {
    try {
      let api_url = ' '
      api_url = `${BASE_URL}/announcement/?franchiseeAlias=${selectedFranchisee}&search=${searchvalue === " " ? "" : searchvalue}&offset=0&limit=5`
      const response = await axios.get(api_url, {
        headers: {
          authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setTheCommon(response.data.result.searchedData.length)
      setCount(response.data.result.count)
    } catch (error) {
      if (error.response.status === 404) {
        // console.log("The code is 404")
        // setAnnouncementDetail([])
        setTheCommon(0)
        setCount(0)
        setLoadEvent(false)
      }
    }
  }
  const EventCount = async () => {
    try {
      // console.log("Announcement detial API")
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/announcement/?franchiseeAlias=${selectedFranchisee}&isEvent=1&search=&offset=0&limit=5`, {
        headers: {
          "Authorization": "Bearer " + token
        }
      });
      // console.log("The All Announcement",response.data.result);
      // console.log("ALL EVENTS",response)
      if (response.status === 200 && response.data.status === "success") {
        setEventCount(response.data.result.count)
        // setEventLength(response.data.result.searchedData.length)
      }
    } catch (error) {
      if (error.response.status === 404) {
        // console.log("The code is 404")
        // setAnnouncementDetail([])
        setEventCount(0)
        setEventLength(0)
        setLoadEvent(false)
      }

    }
  }


  //delete
  const checkDelete = async () =>{
    const query = new URL(window.location);
    const id = query.searchParams.get('id')
    const token = localStorage.getItem('token');

    const response = await axios.get(`${BASE_URL}/announcement/check-announcement?id=${id}`,{
      headers: {
        "Authorization": "Bearer " + token
      }
    })
    if(response.status === 200 && response.data.status === "success"){
      // console.log(" 123 Announcement exit")
    }
    else{
      setTopErrorMessage("Announcement either deleted or no longer available!")

      setTimeout(() => {
        setTopErrorMessage(null);
      }, 6000)
    }
  }

  useEffect(() =>{ 
    checkDelete()
  },[])
  useEffect(() => {

    if (tabLinkPath === "/all-announcements") {
      TheCount()
      // onLoadAnnouncement()
      // setPage(0)
      if (page >= 5) {
        setPage(5)
        setLoadMoreData(loadMoreData.slice(0, 5))
        // console.log("THE LOADDER DATA",loadMoreData.slice(0,5))
      }
      console.log("TABLINKPATH CHANGED", page)
    }
    else if (tabLinkPath === "/my-announcements") {
      // console.log("INSIDE MY ANNOUNCEMENT USEEFFCT")
      // setMyPage(5)
      myDataCount()

      if (mypage >= 5) {
        setMyPage(5)
        setMyLoadData(myLoadData.slice(0, 5))
      }
      // myDataCount()
    }
    else if (tabLinkPath === "/all-events") {
      EventCount()
      // setLoadMoreEvent(loadMoreEvent.slice(0,5))
      if (pageEvent >= 5) {
        setpageEvent(5)
        setLoadMoreEvent(loadMoreEvent.slice(0, 5))
        // console.log("THE LOADDER DATA",loadMoreData.slice(0,5))
      }
    }


  }, [tabLinkPath])
  useEffect(() => {
    if (selectedFranchisee && tabLinkPath === "/all-announcements") {
      onLoadAnnouncement()
    }
    else if(selectedFranchisee && tabLinkPath === "/all-events"){
      OnLoadEvent()
    }

  }, [tabLinkPath])
  useEffect(() => {
    if (selectedFranchisee && tabLinkPath === "/all-announcements") {
      onLoadAnnouncement()
    }
    else if (selectedFranchisee && tabLinkPath === "/my-announcements") {
      onLoadMyAnnouncement()
    }
    else if (selectedFranchisee && tabLinkPath === "/all-events") {
      OnLoadEvent()
    }
  }, [selectedFranchisee])
  useEffect(() => {
    LoadMoreALl()
    // TheCount()

    LoadMoreMyData()
    // myDataCount()

    const user_role = localStorage.getItem("user_role")
    setUserRole(user_role)

    // EventCount()
    LoadMoreEvent()
  }, [])

  useEffect(() => {

    setTheCommon(loadMoreData.length)
  }, [loadMoreData])

  useEffect(() => {
    // myDataCount()
    setMyDataLength(myLoadData.length)
  }, [myLoadData])

  useEffect(() => {
    setEventLength(loadMoreEvent.length)
  }, [loadMoreEvent])

  const UserRole = Params.key === "all-announcement" ? "" : localStorage.getItem('user_role');

  useEffect(() => {
    if (UserRole === 'franchisor_admin') {
      setTabLinkPath('/my-announcements');
    }
    else if (Params.key === "all-announcement") {
      setTabLinkPath('/all-announcements');
    }

    else if (Params.id === "all-events") {
      setTabLinkPath('/all-events');
    }
    else if (Params.key === "all-announcement") {
      setTabLinkPath('/all-announcements');
    }
    else {
      setTabLinkPath('/all-announcements');
    }

    if (localStorage.getItem('success_msg')) {
      setTopMessage(localStorage.getItem('success_msg'));
      localStorage.removeItem('success_msg');

      setTimeout(() => {
        setTopMessage(null);
      }, 3000);
    }
    if (localStorage.getItem('active_tab_announcement')) {
      let path = localStorage.getItem('active_tab_announcement');
      setTabLinkPath(path);
    }

  }, []);
  useEffect(() =>{
   if(data){
    removeitem(data)
   }

  },[data])
  useEffect(() =>{
    let notifcationtab = localStorage.getItem("notification_tab")
    if(notifcationtab === "Event"){
      setTabLinkPath('/all-events');
    }
    else if (notifcationtab ==="Announcement"){
      if (localStorage.getItem("user_role") === 'franchisor_admin') {
        setTabLinkPath('/my-announcements');
      }
      else{
        setTabLinkPath('/all-announcements');
      }
    }
    setTimeout(() => {
      localStorage.removeItem("notification_tab")
    }, 1500);

  },[])
  // useEffect(() =>{
  //   if(data){
  //     LoadMoreMyData()
  //     console.log("data exit")
  //   }
  // },[data])

  // console.log("USER ROLE",userRole)
  
  // console.log("tablink path", tabLinkPath)
  // console.log("All Annoucnement",allAnnouncement)
 

  // console.log("THE LENGHT PLEASE", theLoadOffSet)
  // console.log("THE SEATCH VALUE",searchvalue)
  // console.log("The ALL ANNOUCNEMENT DTATA DKL M", data)
  return (
    <>
      {topMessage && <p className="alert alert-success" style={{ position: "fixed", left: "50%", top: "0%", zIndex: 1000 }}>{topMessage}</p>}
    {topErrorMessage && <p className="alert alert-danger" style={{ position: "fixed", left: "50%", top: "0%", zIndex: 1000 }}>{topErrorMessage}</p>} 

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
                        {
                          verifyPermission("announcements", "add") &&
                          <a href="/new-announcements" className="btn btn-primary me-3">+ Add New</a>
                        }

                      </div>
                    </div>
                  </header>
                  <div className="training-cat mb-3">
                    <ul>
                      <li><a onClick={handleLinkClick} path="/all-announcements" className={`${tabLinkPath === "/all-announcements" ? "active" : ""}`}>All Announcements</a></li>
                      <li><a onClick={handleLinkClick} path="/all-events" className={`${tabLinkPath === "/all-events" ? "active" : ""}`} >All Events</a></li>
                      {
                        localStorage.getItem('user_role') === 'franchisor_admin' || localStorage.getItem('user_role') === 'franchisee_admin' ? (
                          <li><a onClick={handleLinkClick} path="/my-announcements" className={`${tabLinkPath === "/my-announcements" ? "active" : ""}`} >My Announcements And Events</a></li>
                        )
                          : (
                            null
                          )
                      }

                    </ul>
                  </div>

                  {/* searchValue={search} franchisee ={franchiseeData} loadData={loadMoreData} */}
                  <div className="training-column">
                    {tabLinkPath === "/all-announcements"
                      && <AllAnnouncements allAnnouncement={allAnnouncement} loadMoreData={loadMoreData} search={searchvalue} loadCheck={loadAllAnnouncement} announId={Params.id} />}
                    {tabLinkPath === "/my-announcements"
                      && <MyAnnouncements theMyAnnouncement={theMyAnnouncement} myLoadData={myLoadData} selectedFranchisee={selectedFranchisee} theLoad={loadMy} removeItem={removeitem} mypage={mypage} />}
                    {tabLinkPath === "/all-events" && <AllEvent allEvent={allEvent} loadEvent={loadMoreEvent} theloadevent={loadEvent} setData={setData}/>}
                  </div>

                  <div className="text-center">

                    {
                      tabLinkPath === "/all-announcements" ?
                        (
                          <>
                            {theCommon === theCount ? (
                              null
                            ) : (
                              <button type="button" onClick={handelLoadMore} className="btn btn-primary">Load More</button>

                            )}</>
                        )
                        : (
                          null
                        )
                    }
                    {
                      tabLinkPath === "/my-announcements" ? (
                        <>
                          {myDataLength === myCount ? (
                            null
                          ) :
                            (
                              <button type="button" onClick={handleLoadMyAnnouncement} className="btn btn-primary">Load More</button>
                            )}
                        </>
                      ) : (
                        null
                      )
                    }
                    {
                      tabLinkPath === "/all-events" ? (
                        <>
                          {eventLength === eventCount ? (
                            null
                          ) :
                            (
                              <button type="button" onClick={handleLoadMoreEvent} className="btn btn-primary">Load More</button>

                            )

                          }
                        </>
                      ) : (
                        null
                      )
                    }
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
