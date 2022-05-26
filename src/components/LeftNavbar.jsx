import React from "react";
import { Navbar, Nav } from "react-bootstrap";

const LeftNavbar = () => {
    return (
      <>
        <div className="logo-column text-center"><Navbar.Brand href="#home"><img src="img/logo-ico.png" alt=""/></Navbar.Brand></div>
          <Navbar expand="lg">
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Nav className="mr-auto w-100">
                <Nav.Link href="#"><span><i className="ico overview-ico">&nbsp;</i> Overview</span></Nav.Link>
                <Nav.Link href="#"><span><i className="ico repository-ico">&nbsp;</i> File Repository</span></Nav.Link>
                <Nav.Link href="#"><span><i className="ico forms-ico">&nbsp;</i> Forms</span></Nav.Link>
                <Nav.Link href="#" className="active"><span><i className="ico usermana-ico">&nbsp;</i> User Management</span></Nav.Link>
                <Nav.Link href="#"><span><i className="ico training-ico">&nbsp;</i> Training</span></Nav.Link>
                <Nav.Link href="#"><span><i className="ico notification-ico">&nbsp;</i> Notifications</span> <span className="numlis">49</span></Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Navbar>
          <div className="ico-column text-center"><img src="img/icon-column.png" alt=""/></div>
      </>
    );
}
export default LeftNavbar;