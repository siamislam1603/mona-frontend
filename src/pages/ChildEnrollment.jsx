import React, { useState } from "react";
import { Container } from "react-bootstrap";
import LeftNavbar from "../components/LeftNavbar";
import TopHeader from "../components/TopHeader";
import StepOne from "./ChildEnrollment/ChildEnrollment1";
import StepTwo from "./ChildEnrollment/ChildEnrollment2";
import StepThree from "./ChildEnrollment/ChildEnrollment3";
import StepFour from "./ChildEnrollment/ChildEnrollment4";
import StepFive from "./ChildEnrollment/ChildEnrollment5";
import StepSix from "./ChildEnrollment/ChildEnrollment6";
import StepSeven from "./ChildEnrollment/ChildEnrollment7";
import StepEight from "./ChildEnrollment/ChildEnrollment8";
import StepNine from "./ChildEnrollment/ChildEnrollment9";
import StepTen from "./ChildEnrollment/ChildEnrollment10";
import StepEleven from "./ChildEnrollment/ChildEnrollment11";
import StepTwelve from "./ChildEnrollment/ChildEnrollment12";
import StepThirteen from "./ChildEnrollment/ChildEnrollment13";
import { useEffect } from "react";
import axios from 'axios';
import { BASE_URL } from "../components/App";

function ChildEnrollment() {
  const [selectedFranchisee, setSelectedFranchisee] = useState();

  //state for steps
  const [step, setstep] = useState(1);

  // function for going to next step by increasing step state by 1
  const nextStep = () => {
    setstep(step + 1);
  };

  // function for going to previous step by decreasing step state by 1
  const prevStep = () => {
    setstep(step - 1);
  };

  // handling form input data by taking onchange value and updating our previous form data state
  const handleInputData = input => e => {
    // input value from the form
    const {value } = e.target;

  }

  const updateStepFromDatabase = async () => {
    let childId = localStorage.getItem('enrolled_child_id');
    let token = localStorage.getItem('token');

    let response = await axios.get(`${BASE_URL}/enrollment/child/${childId}`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    console.log('RESPONSE:', response);
    if(response.status === 200 && response.data.status === "success") {
      let { form_step } = response.data.child;
      setstep(form_step);
    }
  };

  useEffect(() => {
    // updateStepFromDatabase();
  }, []);

  console.log('SELECTED FRANCHISEE:', selectedFranchisee);
  // eslint-disable-next-line default-case
  switch (step) {
    case 1:
      return (
        <div id="main">
          <section className="mainsection">
            <Container>
              <div className="admin-wrapper">
                <aside className="app-sidebar">
                  <LeftNavbar/>
                </aside>
                <div className="sec-column">
                  <TopHeader
                    selectedFranchisee={selectedFranchisee}
                    setSelectedFranchisee={setSelectedFranchisee} />
                  <div className="entry-container">
                    <header className="title-head">
                      <h1 className="title-lg">Child Enrollment Form</h1>
                    </header>
                    <div className="enrollment-form-sec">
                      <StepOne nextStep={nextStep} handleFormData={handleInputData} />
                    </div>
                  </div>
                </div>
              </div>
            </Container>
          </section>
        </div>
      );
      
    case 2:
      return (
        <div id="main">
          <section className="mainsection">
            <Container>
              <div className="admin-wrapper">
                <aside className="app-sidebar">
                  <LeftNavbar/>
                </aside>
                <div className="sec-column">
                  <TopHeader
                    selectedFranchisee={selectedFranchisee}
                    setSelectedFranchisee={setSelectedFranchisee} />
                  <div className="entry-container">
                    <header className="title-head">
                      <h1 className="title-lg">Child Enrollment Form</h1>
                    </header>
                    <div className="enrollment-form-sec">
                      <StepTwo nextStep={nextStep} prevStep={prevStep} handleFormData={handleInputData} />
                    </div>
                  </div>
                </div>
              </div>
            </Container>
          </section>
        </div>
      );
      
    case 3:
      return (
        <div id="main">
          <section className="mainsection">
            <Container>
              <div className="admin-wrapper">
                <aside className="app-sidebar">
                  <LeftNavbar/>
                </aside>
                <div className="sec-column">
                  <TopHeader
                    selectedFranchisee={selectedFranchisee}
                    setSelectedFranchisee={setSelectedFranchisee} />
                  <div className="entry-container">
                    <header className="title-head">
                      <h1 className="title-lg">Child Enrollment Form</h1>
                    </header>
                    <div className="enrollment-form-sec">
                      <StepThree nextStep={nextStep} prevStep={prevStep} handleFormData={handleInputData} />
                    </div>
                  </div>
                </div>
              </div>
            </Container>
          </section>
        </div>
      );
      
    case 4:
      return (
        <div id="main">
          <section className="mainsection">
            <Container>
              <div className="admin-wrapper">
                <aside className="app-sidebar">
                  <LeftNavbar/>
                </aside>
                <div className="sec-column">
                  <TopHeader
                    selectedFranchisee={selectedFranchisee}
                    setSelectedFranchisee={setSelectedFranchisee} />
                  <div className="entry-container">
                    <header className="title-head">
                      <h1 className="title-lg">Child Enrollment Form</h1>
                    </header>
                    <div className="enrollment-form-sec">
                      <StepFour nextStep={nextStep} prevStep={prevStep} handleFormData={handleInputData} />
                    </div>
                  </div>
                </div>
              </div>
            </Container>
          </section>
        </div>
      );
      
    case 5:
      return (
        <div id="main">
          <section className="mainsection">
            <Container>
              <div className="admin-wrapper">
                <aside className="app-sidebar">
                  <LeftNavbar/>
                </aside>
                <div className="sec-column">
                  <TopHeader
                    selectedFranchisee={selectedFranchisee}
                    setSelectedFranchisee={setSelectedFranchisee} />
                  <div className="entry-container">
                    <header className="title-head">
                      <h1 className="title-lg">Child Enrollment Form</h1>
                    </header>
                    <div className="enrollment-form-sec">
                      <StepFive nextStep={nextStep} prevStep={prevStep} handleFormData={handleInputData} />
                    </div>
                  </div>
                </div>
              </div>
            </Container>
          </section>
        </div>
      );
      
    case 6:
      return (
        <div id="main">
          <section className="mainsection">
            <Container>
              <div className="admin-wrapper">
                <aside className="app-sidebar">
                  <LeftNavbar/>
                </aside>
                <div className="sec-column">
                  <TopHeader
                    selectedFranchisee={selectedFranchisee}
                    setSelectedFranchisee={setSelectedFranchisee} />
                  <div className="entry-container">
                    <header className="title-head">
                      <h1 className="title-lg">Child Enrollment Form</h1>
                    </header>
                    <div className="enrollment-form-sec">
                      <StepSix nextStep={nextStep} prevStep={prevStep} handleFormData={handleInputData} />
                    </div>
                  </div>
                </div>
              </div>
            </Container>
          </section>
        </div>
      );
      
    case 7:
      return (
        <div id="main">
          <section className="mainsection">
            <Container>
              <div className="admin-wrapper">
                <aside className="app-sidebar">
                  <LeftNavbar/>
                </aside>
                <div className="sec-column">
                  <TopHeader
                    selectedFranchisee={selectedFranchisee}
                    setSelectedFranchisee={setSelectedFranchisee} />
                  <div className="entry-container">
                    <header className="title-head">
                      <h1 className="title-lg">Child Enrollment Form</h1>
                    </header>
                    <div className="enrollment-form-sec">
                      <StepSeven nextStep={nextStep} prevStep={prevStep} handleFormData={handleInputData} />
                    </div>
                  </div>
                </div>
              </div>
            </Container>
          </section>
        </div>
      );
      
    case 8:
      return (
        <div id="main">
          <section className="mainsection">
            <Container>
              <div className="admin-wrapper">
                <aside className="app-sidebar">
                  <LeftNavbar/>
                </aside>
                <div className="sec-column">
                  <TopHeader 
                    selectedFranchisee={selectedFranchisee}
                    setSelectedFranchisee={setSelectedFranchisee} />
                  <div className="entry-container">
                    <header className="title-head">
                      <h1 className="title-lg">Child Enrollment Form</h1>
                    </header>
                    <div className="enrollment-form-sec">
                      <StepEight nextStep={nextStep} prevStep={prevStep} handleFormData={handleInputData} />
                    </div>
                  </div>
                </div>
              </div>
            </Container>
          </section>
        </div>
      );
      
    case 9:
      return (
        <div id="main">
          <section className="mainsection">
            <Container>
              <div className="admin-wrapper">
                <aside className="app-sidebar">
                  <LeftNavbar/>
                </aside>
                <div className="sec-column">
                  <TopHeader 
                    selectedFranchisee={selectedFranchisee}
                    setSelectedFranchisee={setSelectedFranchisee} />
                  <div className="entry-container">
                    <header className="title-head">
                      <h1 className="title-lg">Child Enrollment Form</h1>
                    </header>
                    <div className="enrollment-form-sec">
                      <StepNine nextStep={nextStep} prevStep={prevStep} handleFormData={handleInputData} />
                    </div>
                  </div>
                </div>
              </div>
            </Container>
          </section>
        </div>
      );
      
    case 10:
      return (
        <div id="main">
          <section className="mainsection">
            <Container>
              <div className="admin-wrapper">
                <aside className="app-sidebar">
                  <LeftNavbar/>
                </aside>
                <div className="sec-column">
                  <TopHeader
                    selectedFranchisee={selectedFranchisee}
                    setSelectedFranchisee={setSelectedFranchisee} />
                  <div className="entry-container">
                    <header className="title-head">
                      <h1 className="title-lg">Child Enrollment Form</h1>
                    </header>
                    <div className="enrollment-form-sec">
                      <StepTen nextStep={nextStep} prevStep={prevStep} handleFormData={handleInputData} />
                    </div>
                  </div>
                </div>
              </div>
            </Container>
          </section>
        </div>
      );
      
    case 11:
      return (
        <div id="main">
          <section className="mainsection">
            <Container>
              <div className="admin-wrapper">
                <aside className="app-sidebar">
                  <LeftNavbar/>
                </aside>
                <div className="sec-column">
                  <TopHeader
                    selectedFranchisee={selectedFranchisee}
                    setSelectedFranchisee={setSelectedFranchisee} />
                  <div className="entry-container">
                    <header className="title-head">
                      <h1 className="title-lg">Child Enrollment Form</h1>
                    </header>
                    <div className="enrollment-form-sec">
                      <StepEleven nextStep={nextStep} prevStep={prevStep} handleFormData={handleInputData} />
                    </div>
                  </div>
                </div>
              </div>
            </Container>
          </section>
        </div>
      );
      
    case 12:
      return (
        <div id="main">
          <section className="mainsection">
            <Container>
              <div className="admin-wrapper">
                <aside className="app-sidebar">
                  <LeftNavbar/>
                </aside>
                <div className="sec-column">
                  <TopHeader
                    selectedFranchisee={selectedFranchisee}
                    setSelectedFranchisee={setSelectedFranchisee} />
                  <div className="entry-container">
                    <header className="title-head">
                      <h1 className="title-lg">Child Enrollment Form</h1>
                    </header>
                    <div className="enrollment-form-sec">
                      <StepTwelve nextStep={nextStep} prevStep={prevStep} handleFormData={handleInputData} />
                    </div>
                  </div>
                </div>
              </div>
            </Container>
          </section>
        </div>
      );
      
    case 13:
      return (
        <div id="main">
          <section className="mainsection">
            <Container>
              <div className="admin-wrapper">
                <aside className="app-sidebar">
                  <LeftNavbar/>
                </aside>
                <div className="sec-column">
                  <TopHeader
                    selectedFranchisee={selectedFranchisee}
                    setSelectedFranchisee={setSelectedFranchisee} />
                  <div className="entry-container">
                    <header className="title-head">
                      <h1 className="title-lg">Child Enrollment Form</h1>
                    </header>
                    <div className="enrollment-form-sec">
                      <StepThirteen prevStep={prevStep} handleFormData={handleInputData} />
                    </div>
                  </div>
                </div>
              </div>
            </Container>
          </section>
        </div>
      );

  }
}

export default ChildEnrollment;
