import axios from "axios";
import React, { useState, useEffect } from "react";
import { Dropdown } from "react-bootstrap";
import { BASE_URL } from "./App";

const TopHeader = ({ setSelectedFranchisee }) => {

    const [franchiseeList, setFranchiseeList] = useState([]);

    const fetchFranchiseeList = async () => {
      const response = await axios.get(`${BASE_URL}/api/franchisee-data`);
      if(response.status === 200) {
        const { franchiseeList: franchiseeData } = response.data;
        setFranchiseeList([...franchiseeData.map((data) => ({
          id: data.id,
          franchisee_name: `${data.registered_name}, ${data.city}`
        }))]);
      }
    }

    const logout = async () => {
      console.log('LOGGING USER OUT');
      const response = await axios.get(`${BASE_URL}/auth/logout`);
      console.log("LOGOUT RESPONSE:", response);
      if(response.status === 200) {
        localStorage.removeItem('token');
        localStorage.removeItem('user_id');
        localStorage.removeItem('user_name');
        localStorage.removeItem('user_role');
        window.location.href = "/";
      }
    };

    const handleLogout = event => {
      logout();
    };

    useEffect(() => {
      fetchFranchiseeList();
    }, []);

    return (
      <>
        <div className="topheader">
          <div className="lpanel">
            <div className="selectdropdown">
              <Dropdown onSelect={e => setSelectedFranchisee(e)}>
                <Dropdown.Toggle id="dropdown-basic">
                  {franchiseeList[0]?.franchisee_name || "No Data Available"}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {
                    franchiseeList.map(data => {
                      return (
                        <React.Fragment key={data.id}>
                          <Dropdown.Item
                            eventKey={`${data.franchisee_name}`}>
                            <span className="loction-pic">
                              <img alt="" id="user-pic" src="/img/user.png"/>
                            </span>{data.franchisee_name}
                          </Dropdown.Item>
                        </React.Fragment>
                      );
                    })
                  }
                  {/* <Dropdown.Item href="#"><span className="loction-pic"><img alt="" id="user-pic" src="/img/user.png"/></span> Special DayCare, Sydney</Dropdown.Item>
                  <Dropdown.Item href="#"><span className="loction-pic"><img alt="" id="user-pic" src="/img/user.png"/></span> Angel Care, Melbourne</Dropdown.Item>
                  <Dropdown.Item href="#"><span className="loction-pic"><img alt="" id="user-pic" src="/img/user.png"/></span> Care4Kids, Perth</Dropdown.Item>
                  <Dropdown.Item href="#"><span className="loction-pic"><img alt="" id="user-pic" src="/img/user.png"/></span> Helping Children, Sydney</Dropdown.Item> */}
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>
          <div className="rpanel ms-auto">
            <div className="user-sec">
              <ul>
                <li><a href="/"><img alt="" src="/img/search-icon.svg"/></a></li>
                <li><a href="/"><img alt="" src="/img/home-icon.svg"/></a></li>
                <li><a href="/"><img alt="" src="/img/notification-icon.svg"/></a></li>
                <li className="user-col">
                  <Dropdown>
                    <Dropdown.Toggle id="dropdown-basic">
                      <span className="user-pic"><img alt="" id="user-pic" src="/img/user.png"/></span>
                      <span className="user-name">John Doe <small>Franchisor</small></span>
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item href="#">All Franchisee</Dropdown.Item>
                      <Dropdown.Item href="#">All Users</Dropdown.Item>
                      <Dropdown.Item href="#">Forms</Dropdown.Item>
                      <Dropdown.Item href="#">Trainings</Dropdown.Item>
                      <Dropdown.Item href="#">File Repository</Dropdown.Item>
                      <Dropdown.Item href="#">My Profile</Dropdown.Item>
                      <Dropdown.Item href="#">Settings</Dropdown.Item>
                      <Dropdown.Item href="#" onClick={handleLogout}>Logout</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </>
    );
}
export default TopHeader;
