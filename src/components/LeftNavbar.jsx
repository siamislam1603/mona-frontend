import React,{useState,useEffect} from "react";
import { Navbar, Nav } from "react-bootstrap";
import axios from "axios";
import { API_BASE_URL } from "./App";

const LeftNavbar = () => {

  const [menuList, setMenuList] = useState([]);
  const [cityData,setCityData]=useState([]);

  
  // FETCH User Role Permissions  LIST
  const fetchUserRolePermissions = async () => {
    const response = await axios.get(`${API_BASE_URL}/auth/get_menu_list`);

    if(response.status === 200) {
      const { cityList } = response.permissionsObject;
      setCityData(cityList.map(city => ({
        value: city.name,
        label: city.name
      })));
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