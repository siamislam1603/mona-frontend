import React, { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import axios from "axios";
import LeftNavbar from '../components/LeftNavbar';
import TopHeader from '../components/TopHeader';
import { verifyPermission } from '../helpers/roleBasedAccess';
import ToolkitProvider, { Search, } from 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit';
import { BASE_URL } from '../components/App';
import FileRepoShairWithme from './FileRepoShairWithme';
import FileRepodAddbyMe from './FileRepodAddbyMe';
import FilerepoUploadFile from './FilerepoUploadFile';
import { FullLoader } from "../components/Loader";

let selectedUserId = '';
const { SearchBar } = Search;

let selectedFranchisee = [
  { id: 1, registered_name: 'ABC' },
  { id: 2, registered_name: 'PQR' },
];

const FileRepository = () => {
  const [user, setUser] = useState([]);
  const [tabLinkPath, setTabLinkPath] = useState("/available-Files");
  const [franchiseeList, setFranchiseeList] = useState();
  const [filterData, setFilterData] = useState({
    category_id: null,
    search: ""
  });
  const [formSettings, setFormSettings] = useState({
    assigned_franchisee: [],
  });
  const [assigned_usersMeFileRepoData, setassigned_usersMeFileRepoData] = useState([]);
  const [userData, setUserData] = useState([]);
  const getUser_Role = localStorage.getItem(`user_role`)
  const getFranchisee = localStorage.getItem('franchisee_id')
  const [fullLoaderStatus, setfullLoaderStatus] = useState(true);

  const fetchFranchiseeList = async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${BASE_URL}/role/franchisee`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    if (response) {
      setfullLoaderStatus(false)
    }
    if (response.status === 200 && response.data.status === "success") {
      setFranchiseeList(response.data.franchiseeList.map(data => ({
        id: data.id,
        cat: data.franchisee_alias,
        key: `${data.franchisee_name}, ${data.city}`
      })));
    }
  };

  useEffect(() => {
    getUser();
  }, [formSettings.franchisee])


  useEffect(() => {
    fetchFranchiseeList();
    getUser();
  }, []);

  useEffect(() => {
    let role = localStorage.getItem('user_role')
    if (role != 'franchisor_admin') {
      setFormSettings((prevState) => ({
        ...prevState,
        assigned_franchisee: [getFranchisee],
        franchisee: [getFranchisee]
      }))
    }
  }, [])

  const getUser = async () => {
    var myHeaders = new Headers();
    myHeaders.append(
      'authorization',
      'Bearer ' + localStorage.getItem('token')
    );
    var request = {
      headers: myHeaders,
    };

    let franchiseeArr = getUser_Role == 'franchisor_admin' ? formSettings.franchisee : [getFranchisee]
    let response = await axios.post(`${BASE_URL}/auth/users/franchisees`, { franchisee_id: franchiseeArr }, request)
    if (response.status === 200) {
      // console.log(response.data.users, "respo")
      let userList = response.data.users
      if (getUser_Role == 'franchisee_admin') {
        userList = response.data.users.filter(c => ['coordinator', 'educator', 'guardian']?.includes(c.role + ""))
      } else if (getUser_Role == 'coordinator') {
        userList = response.data.users.filter(c => ['educator', 'guardian']?.includes(c.role + ""))
      } else if (getUser_Role == 'educator') {
        userList = response.data.users.filter(c => ['guardian']?.includes(c.role + ""))
      }
      setUser(userList)
    }
  };

  const handleLinkClick = event => {
    let path = event.target.getAttribute('path');
    setTabLinkPath(path);
  }

  return (
    <>
      <div id="main">
        <section className="mainsection">
          <Container>
            <div className="admin-wrapper">
              <aside className="app-sidebar">
                <LeftNavbar />
              </aside>
              <div className="sec-column">
                <TopHeader />
                <FullLoader loading={fullLoaderStatus} />
                {console.log("assigned_usersMeFileRepoData------>", assigned_usersMeFileRepoData)}
                <div className="entry-container">
                  <div className="user-management-sec repository-sec">
                    <ToolkitProvider
                      keyField="name"
                      data={userData}
                      search
                    >
                      {(props) => (
                        <>
                          <header className="title-head">
                            <h1 className="title-lg">File Repository</h1>
                            <div className="othpanel">
                              <div className="extra-btn">
                                <div className="data-search me-3">
                                  <SearchBar {...props.searchProps} />
                                </div>
                                <FilerepoUploadFile />
                              </div>
                            </div>
                          </header>
                          <div className="training-cat mb-3">

                            <ul>
                              <li><a onClick={handleLinkClick} path="/available-Files" className={`${tabLinkPath === "/available-Files" ? "active" : ""}`}>Files shared with me</a></li>

                              {
                                verifyPermission("file_repository", "add") &&
                                <li><a onClick={handleLinkClick} path="/created-by-me" className={`${tabLinkPath === "/created-by-me" ? "active" : ""}`}>My added files</a></li>
                              }
                            </ul>
                          </div>
                          <div className="training-column">
                            {tabLinkPath === "/available-Files"
                              && <FileRepoShairWithme
                                filter={filterData} />}
                            {tabLinkPath === "/created-by-me"
                              && <FileRepodAddbyMe
                                filter={filterData}
                                selectedFranchisee={selectedFranchisee} />}
                          </div>
                        </>
                      )}
                    </ToolkitProvider>
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

export default FileRepository;
