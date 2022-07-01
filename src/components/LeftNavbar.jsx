import React, { useState, useEffect } from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import axios from 'axios';
import { BASE_URL } from './App';
import { Link } from 'react-router-dom';

const LeftNavbar = () => {
  const [permissionList, setPermissionList] = useState();

  const fetchPermissionList = async () => {
    let token = localStorage.getItem('token');
    const response = await axios.get(`${BASE_URL}/auth/get_menu_list`, {
      headers: {
        "Authorization": "Bearer " + token
      }
    })

    if(response.status === 200 && response.data.status === "success") {
      let { menuList } = response.data;
      setPermissionList(menuList);
      localStorage.setItem('menu_list', JSON.stringify(menuList));
    }
  };

  useEffect(() => {
    fetchPermissionList();
  }, []);

  return (
    <>
      <div className="logo-column text-center">
        <Navbar.Brand href="#home">
          <img src="/img/logo-ico.png" alt="" />
        </Navbar.Brand>
      </div>
      <Navbar expand="lg">
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Nav className="mr-auto w-100">
            {permissionList && permissionList.map(permission => {
              return (
                <React.Fragment key={permission.id}>
                  <Link to={`/${permission.menu_link}`} className="nav-link">
                    <span>
                      <i className={`ico ${permission.controller_icon}`}>
                        &nbsp;
                      </i>
                      {permission.controller_label}
                    </span>
                  </Link>
                </React.Fragment>
              );
            })}
            {/* <Nav.Link href="#"><span><i className="ico overview-ico">&nbsp;</i> Overview</span></Nav.Link>
              <Nav.Link href="#"><span><i className="ico repository-ico">&nbsp;</i> File Repository</span></Nav.Link>
              <Nav.Link href="#"><span><i className="ico forms-ico">&nbsp;</i> Forms</span></Nav.Link>
              <Nav.Link href="#" className="active"><span><i className="ico usermana-ico">&nbsp;</i> User Management</span></Nav.Link>
              <Nav.Link href="#"><span><i className="ico training-ico">&nbsp;</i> Training</span></Nav.Link>
              <Nav.Link href="#"><span><i className="ico notification-ico">&nbsp;</i> Notifications</span> <span className="numlis">49</span></Nav.Link> */}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <div className="ico-column text-center">
        <img src="img/icon-column.png" alt="" />
      </div>
    </>
  );
};
export default LeftNavbar;
