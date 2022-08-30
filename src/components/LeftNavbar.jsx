import React, { useState, useEffect } from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { LinkContainer } from "react-router-bootstrap";
import axios from 'axios';
import { BASE_URL, FRONT_BASE_URL } from './App';

const LeftNavbar = () => {
  const [permissionList, setPermissionList] = useState();
  const [userDashboardLink, setuserDashboardLink] = useState();

  const fetchPermissionList = async () => {


    let menu_list = JSON.parse(localStorage.getItem('menu_list'));
    // setPermissionList(menu_list.filter(permission => permission.controller.show_in_menu === true));


    if(localStorage.getItem('user_role') !== 'guardian') {
      menu_list = menu_list.filter(d => d.controller.controller_label !== 'Child Enrollment');
    }

    menu_list = menu_list.map(d => {
      if(d.controller.controller_label === 'Child Enrollment') {
        return {
          controller: {
            id: d.controller.id,
            sequence: d.controller.sequence,
            actions: d.controller.actions,
            controller_icon: d.controller.controller_icon,
            controller_name: d.controller.controller_name,
            controller_label: d.controller.controller_label,
            show_in_menu: d.controller.show_in_menu,
            menu_link: `children/${localStorage.getItem('user_id')}`
          }
        }
      }

      return d;
    });

    let sortedData = menu_list.sort(function(a,b){ 
        // here a , b is whole object, you can access its property   //convert both to lowercase      
        let x = a.controller.sequence;      
        let y = b.controller.sequence;   //compare the word which is comes first      
        if(x>y){return 1;}      
        if(x<y){return -1;}
        return 0;
      });


    console.log('MENU LIST:', sortedData);


    // console.log('REFORMED:', menu_list.filter(permission => permission.controller.show_in_menu === true));
    setPermissionList(sortedData.filter(permission => permission.controller.show_in_menu === true));

    // console.log('FETCHING PERMISSION LIST');
    // let token = localStorage.getItem('token');
    // const response = await axios.get(`${BASE_URL}/auth/get_menu_list`, {
    //   headers: {
    //     "Authorization": "Bearer " + token
    //   }
    // })

    // if(response.status === 200 && response.data.status === "success") {
    //   let { permissionsObject } = response.data;
    //   console.log('PERMISSIONS OBJECT:', permissionsObject)
    //   setPermissionList(permissionsObject.filter(permission => permission.controller.show_in_menu === true));
    //   localStorage.setItem('menu_list', JSON.stringify(permissionsObject));
    // }
  };

  useEffect(() => {
    var user_dashboar_link = '';
    if (localStorage.getItem('user_role') === 'coordinator')
      user_dashboar_link = 'coordinator-dashboard'
    else if (localStorage.getItem('user_role') === 'franchisor_admin')
      user_dashboar_link = 'franchisor-dashboard'
    else if (localStorage.getItem('user_role') === 'franchisee_admin')
      user_dashboar_link = 'franchisee-dashboard'
    else if (localStorage.getItem('user_role') === 'coodinator')
      user_dashboar_link = 'coordinator-dashboard'
    else if (localStorage.getItem('user_role') === 'franchisee_admin')
      user_dashboar_link = 'franchisee-dashboard'
    else if (localStorage.getItem('user_role') === 'educator')
      user_dashboar_link = 'educator-dashboard'
    else if (localStorage.getItem('user_role') === 'guardian')
      user_dashboar_link = 'parents-dashboard'
    else{
      user_dashboar_link= '/'
    }
    setuserDashboardLink(user_dashboar_link)

    fetchPermissionList();
  }, []);

  return (
    <>
      <div className="logo-column text-center">
        <Navbar.Brand href={`/${userDashboardLink}`}>
          <img src="/img/logo-ico.png" alt="" />
        </Navbar.Brand>

      </div>
      <Navbar expand="xl">
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Nav className="mr-auto w-100">
          {/* <Nav.Link href={`/${FRONT_BASE_URL}/${userDashboardLink}`}><span><i className="ico overview-ico">&nbsp;</i> Overview</span></Nav.Link> */}
          
            {permissionList && permissionList.map(permission => {
              return (
                <React.Fragment key={permission.controller_id}>
                  <LinkContainer to={`/${permission.controller.controller_name=='overview'?userDashboardLink:permission.controller.menu_link}`}>
                    <Nav.Link>
                      <span>
                        <i className={`ico ${permission.controller.controller_icon}`}>
                          &nbsp;
                        </i>
                        {permission.controller.controller_label}
                      </span>
                    </Nav.Link>
                  </LinkContainer>
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
