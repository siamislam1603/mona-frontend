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
import { useEffect } from "react";
import axios from 'axios';
import { BASE_URL } from "../components/App";
import { useParams } from 'react-router-dom';

function ChildEnrollment() {
  let { childId, parentId, stepId } = useParams();
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
    let parentId = localStorage.getItem('user_id');
    let token = localStorage.getItem('token');

    console.log(`Parent ID: ${parentId}\ntoken: ${token}`);

    let response = await axios.get(`${BASE_URL}/enrollment/parent/child/${parentId}`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    console.log('STEP DATA RESPONSE:', response);

    if(response.status === 200 && response.data.status === "success") {
      let {childData} = response.data;
      localStorage.setItem('enrolled_child_id', childData[0].id);
      // localStorage.setItem('isChildEnrolled', childData[0].)
      let form_step = childData[0].form_step || 1;
      console.log('Setting the step to', form_step);
      setstep(form_step);
    } else {
      setstep(1);
    }
  };

  useEffect(() => {
    console.log('Updating step from Database!');
    updateStepFromDatabase();
  }, []);

  // useEffect(() => {
  //   setstep(stepId);
  // }, [stepId])

  console.log('PARENT ID:', parentId);
  console.log('CHILD ID:', childId);

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
                  {/* <TopHeader
                    selectedFranchisee={selectedFranchisee}
                    setSelectedFranchisee={setSelectedFranchisee} /> */}
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

  }
}

export default ChildEnrollment;
