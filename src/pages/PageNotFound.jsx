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
         

                
                  <Row  className="">
                    <Col md={8}>
                      <div className="maincolumn">
                           <h1>
                           404: Page not found<br/>
                          We can’t seem to find the page you’re looking for.
                            </h1> 
                        
                            <img src="../img/error-image.jpg" alt='' />
                
                      </div>
                    </Col>
                  
                  </Row>
            
            </div>
          </Container>
        </section>
      </div>
    </>
  )
}

export default PageNotFound