import React, { useState } from "react";
import { Button, Col, Container, Row, Form, Dropdown, Stack } from "react-bootstrap";
import LeftNavbar from "../components/LeftNavbar";
import TopHeader from "../components/TopHeader";
import { Link } from 'react-router-dom';
import BootstrapTable from "react-bootstrap-table-next";
import axios from 'axios';
import { BASE_URL } from '../components/App';
import moment from 'moment';

const PageNotFound = () => {
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
                <div className="error_page">
                  <Row className="align-items-center">
                    <Col md={6}>
                      <div className="error_page_detail">
                        <span>404: Page not found</span>
                        <h1>We can’t seem to find the page you’re looking for.</h1>
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="404_image">
                        <img src="../img/error-image.jpg" alt='' />
                      </div>
                    </Col>
                  </Row>
                </div>
              </div>
            </div>
          </Container>
        </section>
      </div>
    </>
  )
}

export default PageNotFound