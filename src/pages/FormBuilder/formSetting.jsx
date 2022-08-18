import React, { useEffect, useState } from 'react';
import {
  Button,
  Col,
  Container,
  Row,
} from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import LeftNavbar from '../../components/LeftNavbar';
import TopHeader from '../../components/TopHeader';
import Setting from './Setting';

function FormSetting(props) {
  const [selectedFranchisee, setSelectedFranchisee] = useState(null);
  const [selectedFranchiseeId, setSelectedFranchiseeId] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
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
                  setSelectedFranchisee={(name, id) => {
                    setSelectedFranchisee(name);
                    setSelectedFranchiseeId(id);
                    localStorage.setItem('f_id', id);
                  }}
                />
                <Row>
                  <Col sm={8}>
                    <div className="mynewForm-heading  mb-0">
                      <Button
                        onClick={() => {
                          navigate('/form/add', {
                            state: { id: location?.state?.id },
                          });
                        }}
                      >
                        <img src="../../img/back-arrow.svg" />
                      </Button>
                      <h4 className="mynewForm">Form Settings</h4>
                    </div>
                  </Col>
                </Row>
                <Setting/>
              </div>
            </div>
          </Container>
        </section>
      </div>
    </>
  );
}

export default FormSetting;
