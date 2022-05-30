import axios from "axios";
import React from "react";
import { Navbar, Nav, Dropdown, DropdownButton } from "react-bootstrap";
import Select from 'react-select';

const TopHeader = () => {

    const logout = async () => {
      console.log('LOGGING USER OUT');
      const response = await axios.get("http://3.26.39.12:4000/auth/logout");
      console.log("LOGOUT RESPONSE:", response);
      if(response.status === 200) {
        localStorage.removeItem('token');
        window.location.href = "/";
      }
    };

    const handleLogout = event => {
      logout();
    };

    return (
      <>
        <div className="topheader">
          <div className="lpanel">
            <div className="selectdropdown">
              <Dropdown>
                <Dropdown.Toggle id="dropdown-basic">
                  Special DayCare, Sydney
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item href="#"><span className="loction-pic"><img alt="" id="user-pic" src="/img/user.png"/></span> Special DayCare, Sydney</Dropdown.Item>
                  <Dropdown.Item href="#"><span className="loction-pic"><img alt="" id="user-pic" src="/img/user.png"/></span> Angel Care, Melbourne</Dropdown.Item>
                  <Dropdown.Item href="#"><span className="loction-pic"><img alt="" id="user-pic" src="/img/user.png"/></span> Care4Kids, Perth</Dropdown.Item>
                  <Dropdown.Item href="#"><span className="loction-pic"><img alt="" id="user-pic" src="/img/user.png"/></span> Helping Children, Sydney</Dropdown.Item>
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
