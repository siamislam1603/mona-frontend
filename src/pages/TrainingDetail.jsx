import React, { useState } from 'react';
import { Button, Col, Container, Row, Form, Dropdown } from 'react-bootstrap';
import LeftNavbar from '../components/LeftNavbar';
import TopHeader from '../components/TopHeader';
import { Link } from 'react-router-dom';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';

const animatedComponents = makeAnimated();

const styles = {
  option: (styles, state) => ({
    ...styles,
    backgroundColor: state.isSelected ? '#E27235' : '',
  }),
};
const training = [
  {
    value: 'sydney',
    label: 'Sydney',
  },
  {
    value: 'melbourne',
    label: 'Melbourne',
  },
];

const TrainingDetail = () => {
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
                <div className="entry-container">
                  <header className="title-head">
                    <h1 className="title-sm">Getting and staying organized</h1>
                    <div className="othpanel">
                      <div className="extra-btn">
                        <Dropdown>
                          <Dropdown.Toggle id="extrabtn" className="ctaact">
                            <img src="../img/dot-ico.svg" alt="" />
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                            <Dropdown.Item href="#">Delete All</Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </div>
                    </div>
                  </header>
                  <div className="traning-detail-sec">
                    <div className="thumb-vid">
                      <a href="">
                        <img src="../img/training-pic.jpg" alt="" />
                      </a>
                    </div>
                    <div className="training-cont mt-3 mb-5">
                      <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Mattis a sagittis varius vel, est quam quam. Orci
                        blandit ac eleifend mi cursus velit pellentesque.
                        Sodales iaculis netus ipsum facilisis suspendisse dolor.
                        Sed sed neque enim tellus in tristique. Lorem ipsum
                        dolor sit amet, consectetur adipiscing elit. Mattis a
                        sagittis varius vel, est quam quam.
                      </p>
                    </div>

                    <h2 className="title-sm">Related Files</h2>
                    <div className="column-list files-list three-col mb-5">
                      <div className="item">
                        <div className="pic">
                          <img src="../img/book-ico.png" alt="" />
                        </div>
                        <div className="name">
                          document1.docx <span className="time">3 Hours</span>
                        </div>
                        <div className="cta-col">
                          <a href="">
                            <img src="../img/removeIcon.svg" alt="" />
                          </a>
                        </div>
                      </div>
                      <div className="item">
                        <div className="pic">
                          <img src="../img/ppt-ico.png" alt="" />
                        </div>
                        <div className="name">
                          presentation1.pptx{' '}
                          <span className="time">3 Hours</span>
                        </div>
                        <div className="cta-col">
                          <a href="">
                            <img src="../img/removeIcon.svg" alt="" />
                          </a>
                        </div>
                      </div>
                    </div>

                    <div className="complete-training text-center">
                      <p>
                        Please acknowledge by clicking below that you have
                        completed this training completely and can proceed
                        further.
                      </p>
                      <a href="" className="btn btn-primary">
                        Yes, I have completed the training
                      </a>
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

export default TrainingDetail;
