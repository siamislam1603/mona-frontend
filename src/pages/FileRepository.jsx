import React, { useState } from 'react';
import { Container } from 'react-bootstrap';
import LeftNavbar from '../components/LeftNavbar';
import TopHeader from '../components/TopHeader';
import { verifyPermission } from '../helpers/roleBasedAccess';
import ToolkitProvider, { Search, } from 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit';
import FileRepoShairWithme from './FileRepoShairWithme';
import FileRepodAddbyMe from './FileRepodAddbyMe';
import FilerepoUploadFile from './FilerepoUploadFile';

const { SearchBar } = Search;

let selectedFranchisee = [
  { id: 1, registered_name: 'ABC' },
  { id: 2, registered_name: 'PQR' },
];

const FileRepository = () => {
  const [tabLinkPath, setTabLinkPath] = useState("/available-Files");
  const [userData, setUserData] = useState([]);
  const [selectedFranchisee, setSelectedFranchisee] = useState(null);
  const [filterData, setFilterData] = useState({
    category_id: null,
    search: ""
  });


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
                <TopHeader
                  setSelectedFranchisee={setSelectedFranchisee}
                />
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
                              <li><a onClick={handleLinkClick} path="/available-Files" className={`${tabLinkPath === "/available-Files" ? "active" : ""}`}>Files Shared With Me</a></li>

                              {
                                verifyPermission("file_repository", "add") &&
                                <li><a onClick={handleLinkClick} path="/created-by-me" className={`${tabLinkPath === "/created-by-me" ? "active" : ""}`}>My Added Files</a></li>
                              }
                            </ul>
                          </div>
                          <div className="training-column">
                            {tabLinkPath === "/available-Files"
                              && <FileRepoShairWithme
                                selectedFranchisee={selectedFranchisee}
                                filter={filterData} />}
                            {tabLinkPath === "/created-by-me"
                              && <FileRepodAddbyMe
                                filter={filterData}
                                selectedFranchisee={selectedFranchisee}
                              />}
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
