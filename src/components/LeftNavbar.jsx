import React, { useState, useEffect } from "react";
import { Navbar, Nav } from "react-bootstrap";
import axios from 'axios';
import { BASE_URL } from './App';

const LeftNavbar = () => {

  const [menuList, setMenuList] = useState([]);

  // FETCH User Role Permissions  LIST
  let token= localStorage.getItem("token");
  const fetchUserRolePermissions = async () => {
    const response = await axios.get(`${ BASE_URL }/auth/get_menu_list`,
    { headers: { "Authorization": "Bearer "+token, } }
    
    );

    if(response.status === 200) {
      const { permissionsObject } = response.data;
      setMenuList(permissionsObject);
    }
  }

  useEffect(() => {
    fetchUserRolePermissions();
  }, []);

  return (
    <>
      <div className="logo-column text-center"><Navbar.Brand href="#home"><img src="img/logo-ico.png" alt=""/></Navbar.Brand></div>
        <Navbar expand="lg">
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Nav className="mr-auto w-100">
              {
                menuList.map(({controller}) => {
                  return (
                    <React.Fragment key={controller.id}>
                      <Nav.Link href="#"><span><i className={`ico ${controller.controller_icon}`}>&nbsp;</i>
                        {controller.controller_label}
                      </span></Nav.Link>
                    </React.Fragment>
                  );
                })
              }
              {/* <Nav.Link href="#"><span><i className="ico overview-ico">&nbsp;</i> Overview</span></Nav.Link>
              <Nav.Link href="#"><span><i className="ico repository-ico">&nbsp;</i> File Repository</span></Nav.Link>
              <Nav.Link href="#"><span><i className="ico forms-ico">&nbsp;</i> Forms</span></Nav.Link>
              <Nav.Link href="#" className="active"><span><i className="ico usermana-ico">&nbsp;</i> User Management</span></Nav.Link>
              <Nav.Link href="#"><span><i className="ico training-ico">&nbsp;</i> Training</span></Nav.Link>
              <Nav.Link href="#"><span><i className="ico notification-ico">&nbsp;</i> Notifications</span> <span className="numlis">49</span></Nav.Link> */}
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <div className="ico-column text-center"><img src="img/icon-column.png" alt=""/></div>
    </>
  );
}
export default LeftNavbar;