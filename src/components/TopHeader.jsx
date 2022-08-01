import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Dropdown } from 'react-bootstrap';
import { BASE_URL } from './App';

let temp = () => {}

const TopHeader = ({ setSelectedFranchisee = temp }) => {
  const [franchiseeList, setFranchiseeList] = useState([]);
  const [franchiseeId, setFranchiseeId] = useState();
  const [permissionList, setPermissionList] = useState();

  const savePermissionInState = async () => {
    let menu_list = JSON.parse(localStorage.getItem('menu_list'));
    setPermissionList(menu_list.filter(permission => permission.controller.show_in_menu === true));
  };

  const fetchFranchiseeList = async () => {
    let token = localStorage.getItem('token');
    const response = await axios.get(`${BASE_URL}/role/franchisee`, {
      headers: {
        Authorization: 'Bearer ' + token,
      },
    });
    if (response.status === 200 && response.data.status === "success") {
      const { franchiseeList: franchiseeData } = response.data;

      let renderedData, filteredData;
      if(localStorage.getItem('user_role') === 'franchisor_admin') {
        renderedData = franchiseeData.map((data) => ({
          id: data.id,
          franchisee_name: `${data.franchisee_name}, ${data.city}`,
        }));
        setFranchiseeList(renderedData);
      } else {
        let franchisee_id = localStorage.getItem('franchisee_id');
        renderedData = franchiseeData.map((data) => ({
          id: data.id,
          franchisee_name: `${data.franchisee_name}, ${data.city}`,
        }));
        filteredData = renderedData.filter(d => parseInt(d.id) === parseInt(franchisee_id));
        setFranchiseeList(filteredData);
      }
    } 
  };


  // const fetchAndPopulateFranchiseeDetails = async () => {
  //   const response = await axios.get(
  //     `${BASE_URL}/role/franchisee/details/${localStorage.getItem('user_id')}`
  //   );
  //   if (response.status === 200) {
  //     const { franchisee } = response.data;
  //     setSelectedFranchisee(franchisee.franchisee_name ? franchisee.franchisee_name === "All" ? "" : franchisee.franchisee_name : "", franchisee.id);
  //     setFranchiseeList(
  //       [franchisee].map((data) => ({
  //         id: data.id,
  //         franchisee_name: `${data.franchisee_name}, ${data.city}`,
  //       }))
  //     );
  //   }
  // };

  const logout = async () => {
    const response = await axios.get(`${BASE_URL}/auth/logout`);
    if (response.status === 200) {
      localStorage.removeItem('token');
      localStorage.removeItem('user_id');
      localStorage.removeItem('user_name');
      localStorage.removeItem('user_role');
      localStorage.removeItem('menu_list');
      localStorage.removeItem('active_tab');
      localStorage.removeItem('selectedFranchisee');
      localStorage.removeItem("attempts")  
      localStorage.removeItem("enrolled_parent_id")  
      localStorage.removeItem("enrolled_child_id")  
      window.location.href = '/';
    }
  };

  const handleLogout = (event) => {
    logout();
  };

  const selectFranchisee = (e) => {
    console.log('SELECTED FRANCHISEE:', e);
    if(e === 'All') {
      setFranchiseeId({franchisee_name: 'All'});
      setSelectedFranchisee('all');
    } else {
      setFranchiseeId({...franchiseeList?.filter(d => parseInt(d.id) === parseInt(e))[0]});
      setSelectedFranchisee(e);
    }
  };

  // useEffect(() => {
  //   setSelectedFranchisee('All');
  // }, [franchiseeList]);

  useEffect(() => {
    fetchFranchiseeList();
  }, []);

  useEffect(() => {
    savePermissionInState();
  }, []);

  franchiseeId && console.log('Franchisee id:', franchiseeId);
  return (
    <>
      <div className="topheader">
        <div className="lpanel">
          <div className="selectdropdown">
            <Dropdown onSelect={selectFranchisee}>
              <Dropdown.Toggle id="dropdown-basic">
                {franchiseeId?.franchisee_name ||
                  franchiseeList[0]?.franchisee_name ||
                  'No Data Available'}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {localStorage.getItem("user_role") === "franchisor_admin" ? <React.Fragment key="">
                  <Dropdown.Item eventKey="All">
                    <span className="loction-pic">
                      <img alt="" id="user-pic" src="/img/user.png" />
                    </span>
                    All
                  </Dropdown.Item>
                </React.Fragment> : null}
                {franchiseeList.map((data) => {
                  return (
                    <React.Fragment key={data.id}>
                      <Dropdown.Item eventKey={`${data.id}`}>
                        <span className="loction-pic">
                          <img alt="" id="user-pic" src="/img/user.png" />
                        </span>
                        {data.franchisee_name}
                      </Dropdown.Item>
                    </React.Fragment>
                  );
                })}
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>
        <div className="rpanel ms-auto">
          <div className="user-sec">
            <ul>
              <li>
                <a href="/">
                  <img alt="" src="/img/search-icon.svg" />
                </a>
              </li>
              <li>
                <a href="/">
                  <img alt="" src="/img/home-icon.svg" />
                </a>
              </li>
              <li>
                <a href="/">
                  <img alt="" src="/img/notification-icon.svg" />
                </a>
              </li>
              <li className="user-col">
                <Dropdown>
                  <Dropdown.Toggle id="dropdown-basic">
                    <span className="user-pic">
                      <img alt="" id="user-pic" src="/img/user.png" />
                    </span>
                    <span className="user-name">
                      {localStorage.getItem('user_name')
                        ? localStorage
                          .getItem('user_name')
                          .split(' ')
                          .map(
                            (data) =>
                              data.charAt(0).toUpperCase() + data.slice(1)
                          )
                          .join(' ')
                        : ''}

                      <small>
                        {localStorage.getItem('user_role')
                          ? localStorage
                            .getItem('user_role')
                            .split('_')
                            .map(
                              (data) =>
                                data.charAt(0).toUpperCase() + data.slice(1)
                            )
                            .join(' ')
                          : ''}
                      </small>
                    </span>
                  </Dropdown.Toggle>
                  <Dropdown.Menu style={{ zIndex: '2000' }}>
                    {permissionList
                      ? permissionList.map((top_menu) => {
                        return (
                          <Dropdown.Item
                            key={top_menu.id}
                            href={top_menu.controller.menu_link}
                          >
                            {top_menu.controller.controller_label}
                          </Dropdown.Item>
                        );
                      })
                      : null}

                    {/* <Dropdown.Item href="#">All Franchisee</Dropdown.Item>
                      <Dropdown.Item href="#">All Users</Dropdown.Item>
                      <Dropdown.Item href="#">Forms</Dropdown.Item>
                      <Dropdown.Item href="#">Trainings</Dropdown.Item>
                      <Dropdown.Item href="#">File Repository</Dropdown.Item> */}

                    <Dropdown.Item href="/change-password">Change Password</Dropdown.Item>
                    <Dropdown.Item href={`/edit-user/${localStorage.getItem('user_id')}`}>My Profile</Dropdown.Item>
                    <Dropdown.Item href="#">Settings</Dropdown.Item>
                    <Dropdown.Item href="#" onClick={handleLogout}>
                      Logout
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};
export default TopHeader;
