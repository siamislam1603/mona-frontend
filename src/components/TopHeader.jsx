import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Dropdown } from 'react-bootstrap';
import { BASE_URL } from './App';

const TopHeader = ({ setSelectedFranchisee }) => {
  const [franchiseeList, setFranchiseeList] = useState([]);
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
    if (response.status === 200) {
      const { franchiseeList: franchiseeData } = response.data;
      setFranchiseeList([
        ...franchiseeData.map((data) => ({
          id: data.id,
          franchisee_name: `${data.franchisee_name}, ${data.city}`,
        })),
      ]);
    }
  };

  const fetchAndPopulateFranchiseeDetails = async () => {
    const response = await axios.get(
      `${BASE_URL}/role/franchisee/details/${localStorage.getItem('user_id')}`
    );
    if (response.status === 200) {
      const { franchisee } = response.data;
      setSelectedFranchisee(
        franchisee.franchisee_name
          ? franchisee.franchisee_name === 'All'
            ? ''
            : franchisee.franchisee_name
          : '',
        franchisee.id
      );
      setFranchiseeList(
        [franchisee].map((data) => ({
          id: data.id,
          franchisee_name: `${data.franchisee_name}, ${data.city}`,
        }))
      );
    }
  };

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
      window.location.href = '/';
    }
  };

  const handleLogout = (event) => {
    logout();
  };

  const selectFranchisee = (e) => {
    let id;
    franchiseeList.map((item) => {
      if (item.franchisee_name === e) {
        id = item.id;
      }
    });
    setSelectedFranchisee(e, id);
    localStorage.setItem('selectedFranchisee', e);
  };

  useEffect(() => {
    if (localStorage.getItem('user_role') === 'franchisor_admin') {
      fetchFranchiseeList();
    } else {
      fetchAndPopulateFranchiseeDetails();
    }
  }, []);

  useEffect(() => {
    savePermissionInState();
  }, []);

  return (
    <>
      <div className="topheader">
        <div className="lpanel">
          <div className="selectdropdown">
            <Dropdown onSelect={selectFranchisee}>
              <Dropdown.Toggle id="dropdown-basic">
                {localStorage.getItem('selectedFranchisee') === 'All'
                  ? 'All Franchisee'
                  : localStorage.getItem('selectedFranchisee') ||
                    franchiseeList[0]?.franchisee_name ||
                    'No Data Available'}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {localStorage.getItem("user_role")==="franchisor_admin" ? <React.Fragment key="">
                  <Dropdown.Item eventKey="All">
                    <span className="loction-pic">
                      <img alt="" id="user-pic" src="/img/user.png" />
                    </span>
                    All Franchisee
                  </Dropdown.Item>
                </React.Fragment> : null}
                {franchiseeList.map((data) => {
                  return (
                    <React.Fragment key={data.id}>
                      <Dropdown.Item eventKey={`${data.franchisee_name}`}>
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

                    <Dropdown.Item href="/change-password">My Profile</Dropdown.Item>
                    <Dropdown.Item href="#">My Profile</Dropdown.Item>
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
