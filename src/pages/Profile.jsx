import React, { useState } from 'react';
import ViewUser from './ViewUser';
import UserTraining from './UserTraining';
import UserForm from './UserForm';
import { useParams } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import LeftNavbar from '../components/LeftNavbar';
import TopHeader from '../components/TopHeader';

const Profile = (props) => {
  const { userId, userRole } = useParams();
  const [selectedFranchisee, setSelectedFranchisee] = useState(
    'Alphabet Kids, Sydney'
  );
  const [tabLinkPath, setTabLinkPath] = useState(`/view-user/${userId}`);

  const handleLinkClick = (event) => {
    let path = event.target.getAttribute('path');
    setTabLinkPath(path);
  };

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
                  selectedFranchisee={selectedFranchisee}
                  setSelectedFranchisee={setSelectedFranchisee}
                />

                <div className="entry-container">
                  <header className="title-head">
                    <h1 className="title-lg">User Profile</h1>
                  </header>
                  <div>
                    <div className="training-cat d-md-flex align-items-center mb-3">
                      <ul>
                        <li>
                          <a
                            onClick={handleLinkClick}
                            path={`/view-user/${userId}`}
                            className={`${
                              tabLinkPath.includes(`view-user`) ? 'active' : ''
                            }`}
                          >
                            Personal Details
                          </a>
                        </li>
                        <li>
                          <a
                            onClick={handleLinkClick}
                            path={`/user-training/${userId}`}
                            className={`${
                              tabLinkPath.includes('user-training')
                                ? 'active'
                                : ''
                            }`}
                          >
                            User Trainings
                          </a>
                        </li>
                        <li>
                          <a
                            onClick={handleLinkClick}
                            path={`/user-forms/${userId}/${userRole}`}
                            className={`${
                              tabLinkPath.includes('user-forms') ? 'active' : ''
                            }`}
                          >
                            User Forms
                          </a>
                        </li>
                      </ul>
                    </div>

                    <div className="training-column">
                      {tabLinkPath.includes(`view-user`) && <ViewUser />}
                      {tabLinkPath.includes('user-training') && (
                        <UserTraining />
                      )}
                      {tabLinkPath.includes('user-forms') && <UserForm />}
                    </div>
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

export default Profile;
