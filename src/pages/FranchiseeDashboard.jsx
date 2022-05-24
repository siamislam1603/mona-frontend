import React, { useState } from "react";
import { Button, Col, Container, Row, Form, Dropdown, DropdownButton } from "react-bootstrap";
import LeftNavbar from "../components/LeftNavbar";
import TopHeader from "../components/TopHeader";
import { Link } from 'react-router-dom';
import BootstrapTable from "react-bootstrap-table-next";

const products = [
  {
    id: 1,
    name: "../img/user.png, James Smith",
    educator: "Ms. Shelby Goode",
  },
  {
    id: 2,
    name: "../img/user.png, James Smith",
    educator: "Ms. Shelby Goode",
  },
  {
    id: 3,
    name: "../img/user.png, James Smith",
    educator: "Ms. Shelby Goode",
  },
  {
    id: 4,
    name: "../img/user.png, James Smith",
    educator: "Ms. Shelby Goode",
  },
];
const columns = [
{
  dataField: 'name',
  text: 'Child Name',
  formatter: (cell) => {
    cell=cell.split(",");
    return (<><div className="user-list"><span className="user-pic"><img src={cell[0]} alt=''/></span><span className="user-name">{cell[1]} </span></div></>)
  },
},
{
    dataField: 'educator',
    text: 'Educator',
  },
  {
    dataField: "action",
    text: "",
    formatter: (cell) => {
      return (<><div className="cta-col">
        <Dropdown>
          <Dropdown.Toggle variant="transparent" id="ctacol">
            <img src="../img/dot-ico.svg" alt=""/>
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item href="#">Delete</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div></>)
    },
  }
];

const FranchiseeDashboard = () => {
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
                        <header className="title-head mb-4 justify-content-between">
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
                        <div className="enrollments-sec pb-5">
                          <header className="title-head mb-4 justify-content-between">
                            <h4 className="title-sm mb-0"><strong>New Enrollments</strong></h4>
                            <Link to="/" className="viewall">View All</Link>
                          </header>
                          <div className="column-table user-management-sec">
                            <BootstrapTable
                              keyField="name"
                              data={products}
                              columns={ columns }
                            />
                          </div>
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

export default FranchiseeDashboard;
