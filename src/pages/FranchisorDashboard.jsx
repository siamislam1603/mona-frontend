import React, { useState } from "react";
import { Button, Col, Container, Row, Form } from "react-bootstrap";
import LeftNavbar from "../components/LeftNavbar";
import TopHeader from "../components/TopHeader";


const FranchisorDashboard = () => {
  return (
    <>
      <div id="main">
        <section className="mainsection">
          <Container>
            <div className="admin-wrapper">
              <aside className="app-sidebar">
                <LeftNavbar/>
              </aside>
              <div className="sec-column">
                <TopHeader/>
                <div className="entry-container">
                  <Row>
                    <Col md={7}>
                      <div className="maincolumn">
                        <header className="title-head mb-2 justify-content-between">
                          <h1 className="title-sm mb-0"><strong>Quick Access Links</strong></h1>
                        </header>

                      </div>
                    </Col>
                    <Col md={5}>
                      <aside className="rightcolumn">
                        <div className="activity-sec pb-5">
                          <header className="title-head mb-4 justify-content-between">
                            <h4 className="title-sm mb-0"><strong>Activity</strong></h4>
                          </header>
                          <div className="activity-list">
                            <div className="item">
                              <span className="name">Logged in Users</span>
                              <span className="separator">|</span>
                              <span className="num">04</span>
                            </div>
                            <div className="item">
                              <span className="name">Users yet to log in</span>
                              <span className="separator">|</span>
                              <span className="num">04</span>
                            </div>
                            <div className="item">
                              <span className="name">Total Forms</span>
                              <span className="separator">|</span>
                              <span className="num">04</span>
                            </div>
                            <div className="item">
                              <span className="name">Total Franchisee</span>
                              <span className="separator">|</span>
                              <span className="num">14</span>
                            </div>
                          </div>
                        </div>
                        <div className="ads text-center pb-5">
                          <img src="../img/icon-column.png" alt=""/>
                        </div>
                      </aside>
                    </Col>
                  </Row>
                </div>
              </div>
            </div>
          </Container>
        </section>
      </div>
    </>
  );
};

export default FranchisorDashboard;
