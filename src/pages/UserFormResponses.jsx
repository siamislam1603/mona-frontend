import React, { useState, useEffect, useMemo } from 'react';
import { Container, Form, Row, Col, Button } from 'react-bootstrap';
import LeftNavbar from '../components/LeftNavbar';
import TopHeader from '../components/TopHeader';
import { useParams, useNavigate } from 'react-router-dom';
import debounce from 'lodash.debounce';
import { FullLoader } from '../components/Loader';
import { FetchFormResponse } from '../helpers/users/profile/userFormResponses/FetchFormResponse';
import FormAccordion from '../components/FormAccordion';

const UserManagement = () => {
  const navigate = useNavigate();
  let { formId, userId, userRole } = useParams();
  const [selectedFrachisee, setSelectedFranchisee] = useState(null);
  const [search, setSearch] = useState('');
  let { formDetails, formResponse, error, isLoading } = FetchFormResponse({
    formId,
    search,
  });

  const handleInputChange = (e) => {
    setSearch(e.target.value);
  };

  const debouncedSearchResult = useMemo(() => {
    return debounce(handleInputChange, 300);
  }, []);

  useEffect(() => {
    return () => {
      debouncedSearchResult.cancel();
    };
  });

  return (
    <>
      <div id="main" className="main-class">
        <section className="mainsection">
          <Container>
            <div className="admin-wrapper">
              <aside className="app-sidebar">
                <LeftNavbar />
              </aside>
              <div className="sec-column">
                <TopHeader setSelectedFranchisee={setSelectedFranchisee} />
                <FullLoader loading={isLoading} />
                <Row>
                  <Col sm={8}>
                    <div className="mynewForm-heading  mb-0">
                      <Button
                        onClick={() => {
                          navigate(`/profile/${userId}/${userRole}`);
                        }}
                      >
                        <img alt="back arrow" src="/img/back-arrow.svg" />
                      </Button>
                      <h4 className="mynewForm">
                        {formDetails?.form_name
                          ? formDetails?.form_name
                          : 'Compliance Visit Form'}
                      </h4>
                    </div>
                  </Col>
                </Row>
                <div className="responses-forms-header-section forms-header-section mb-5">
                  <div className="d-md-flex align-items-end mt-4">
                    <div className="forms-managmentsection">
                      <div className="forms-managment-left">
                        <p className="mb-2">
                          {formDetails?.form_response_count} Responses
                        </p>
                      </div>
                      <div className="forms-search me-0 ms-auto mt-3">
                        <Form.Group>
                          <div className="forms-icon">
                            <img src="/img/search-icon-light.svg" alt="" />
                          </div>
                          <Form.Control
                            type="text"
                            placeholder="Search..."
                            name="search"
                            onChange={debouncedSearchResult}
                          />
                        </Form.Group>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="entry-container" style={{ paddingTop: '0px' }}>
                  <div className="user-management-sec">
                    {/* <header className="title-head">
                      <h1 className="title-lg">Form Responses</h1>
                    </header> */}
                    {formResponse ? (
                      <div className="responses-collapse">
                        {<FormAccordion data={formResponse} />}
                      </div>
                    ) : (
                      <h4 style={{ fontWeight: '200', textAlign: 'center' }}>
                        {error || 'No Response Found'}
                      </h4>
                    )}
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

export default UserManagement;
