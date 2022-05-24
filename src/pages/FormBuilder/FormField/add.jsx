import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { Button, Col, Container, Form, Modal, Row } from "react-bootstrap";
import LeftNavbar from "../../../components/LeftNavbar";
import TopHeader from "../../../components/TopHeader";

function AddFormField(props) {
  const [conditionFlag, setConditionFlag] = useState(false);
  const [groupFlag,setGroupFlag]=useState(false);
  return (
    <div id="main">
      <section className="mainsection">
        <Container>
          <div className="admin-wrapper">
            <aside className="app-sidebar">
              <LeftNavbar />
            </aside>
            <div className="sec-column">
              <TopHeader />
              <Row>
                <Col sm={8}>
                  <div className="mynewForm-heading">
                    <Button
                      onClick={() => {
                        props.history.push("/form/add");
                      }}
                    >
                      <img src="../../img/back-arrow.svg" />
                    </Button>
                    <h4 className="mynewForm">My New Form</h4>
                    <Button>
                      <img src="../../img/carbon_settings.svg" />
                    </Button>
                  </div>
                </Col>
                {/* <Col sm={4}>
                  <a href="#">Questions</a>
                  <a href="#">Answers</a>
                </Col> */}
                <Col sm={12}>
                  <p className="myform-details">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing
                    elit, sed do eiusmod tempor incididunt ut labore et dolore
                    magna aliqua.
                  </p>
                </Col>
              </Row>
              <Form>
                <div className="my-new-formsection">
                  <Row>
                    <Col sm={12}>
                      <Form.Label className="formlabel">Label 1</Form.Label>
                    </Col>
                  </Row>
                  <div className="label-one">
                    <Row>
                      <Col sm={6}>
                        <div className="my-form-input">
                          <Form.Control
                            type="text"
                            name="form_label"
                            id="inputPassword5"
                            aria-describedby="passwordHelpBlock"
                            placeholder="Some text here for the label"
                          />
                          <div className="input-img">
                            <img src="../../img/input-img.svg" />
                          </div>
                        </div>
                      </Col>
                      <Col sm={6}>
                        <div className="text-answer-div">
                          <Form.Select name="field_type">
                            <option> Field Type</option>
                            <option value="text">Text Answer</option>
                            <option value="radio">Multiple Choice</option>
                            <option value="checkbox">Checkboxes</option>
                          </Form.Select>
                          <div className="input-text-img">
                            <img src="../../img/input-text-icon.svg" />
                          </div>
                          {/* <div className="input-select-arrow">
                      <img src="../../img/input-select-arrow.svg"/>
                    </div> */}
                        </div>
                      </Col>

                      {/* <Col sm={12}>
                    <Button>Preview</Button>
                    <Button className="primary">Save Form</Button>
                  </Col> */}
                    </Row>
                  </div>
                  <div className="apply-section">
                    <Row>
                      <Col sm={6}>
                        <div className="apply-condition">
                          <Button
                            onClick={() => {
                              setConditionFlag(!conditionFlag);
                            }}
                          >
                            Apply Condition
                          </Button>
                        </div>
                      </Col>
                      <Col sm={6}>
                        <div className="add-group-t-button">
                          <div className="add-g">
                            <Button onClick={()=>{setGroupFlag(!groupFlag)}}>
                              <FontAwesomeIcon icon={faPlus} />
                              Add to Group
                            </Button>
                          </div>
                          <div className="required">
                            <p>Required</p>
                          </div>
                          <div className="toogle-swich">
                            <input class="switch" type="checkbox" />
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </div>
                </div>
                <div className="my-new-formsection">
                  <Row>
                    <Col sm={6}>
                      <Form.Label className="formlabel">Label 2</Form.Label>
                    </Col>
                    <Col sm={6}>
                      <div className="remove-button">
                        <Button>
                          <img src="../../img/removeIcon.svg" /> Remove
                        </Button>
                      </div>
                    </Col>
                  </Row>
                  <div className="label-one">
                    <Row>
                      <Col sm={6}>
                        <div className="my-form-input">
                          <Form.Control
                            type="text"
                            name="form_label"
                            id="inputPassword5"
                            aria-describedby="passwordHelpBlock"
                            placeholder="Some text here for the label"
                          />
                          <div className="input-img">
                            <img src="../../img/input-img.svg" />
                          </div>
                        </div>
                      </Col>
                      <Col sm={6}>
                        <div className="text-answer-div">
                          <Form.Select name="field_type">
                            <option> Field Type</option>
                            <option value="text">Text Answer</option>
                            <option value="radio">Multiple Choice</option>
                            <option value="checkbox">Checkboxes</option>
                          </Form.Select>
                          <div className="input-text-img">
                            <img src="../../img/multiple-choice-icon.svg" />
                          </div>
                          {/* <div className="input-select-arrow">
                      <img src="../../img/input-select-arrow.svg"/>
                    </div> */}
                        </div>
                      </Col>
                      <Col sm={6}>
                        <div className="my-form-input">
                          <Form.Control
                            type="text"
                            name="form_label"
                            id="inputPassword5"
                            aria-describedby="passwordHelpBlock"
                            placeholder="Option 1"
                          />
                          <div className="delete-icon">
                            <img src="../../img/removeIcon.svg" />
                          </div>
                        </div>
                      </Col>
                      <Col sm={6}>
                        <div className="my-form-input">
                          <Form.Control
                            type="text"
                            name="form_label"
                            id="inputPassword5"
                            aria-describedby="passwordHelpBlock"
                            placeholder="Option 2"
                          />
                          <div className="delete-icon">
                            <img src="../../img/removeIcon.svg" />
                          </div>
                        </div>
                      </Col>
                      {/* <Col sm={12}>
                    <Button>Preview</Button>
                    <Button className="primary">Save Form</Button>
                  </Col> */}
                    </Row>
                  </div>
                  <div className="apply-section">
                    <Row>
                      <Col sm={6}>
                        <div className="apply-condition">
                          <Button>
                            <FontAwesomeIcon icon={faPlus} /> Add Option
                          </Button>
                          <Button>Apply Condition</Button>
                        </div>
                      </Col>
                      <Col sm={6}>
                        <div className="add-group-t-button">
                          <div className="add-g">
                            <Button>
                              <FontAwesomeIcon icon={faPlus} />
                              Add to Group
                            </Button>
                          </div>
                          <div className="required">
                            <p>Required</p>
                          </div>
                          <div className="toogle-swich">
                            <input class="switch" type="checkbox" />
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </div>
                </div>
                <div className="my-new-formsection">
                  <Row>
                    <Col sm={6}>
                      <Form.Label className="formlabel">Label 3</Form.Label>
                    </Col>
                    <Col sm={6}>
                      <div className="remove-button">
                        <Button>
                          <img src="../../img/removeIcon.svg" /> Remove
                        </Button>
                      </div>
                    </Col>
                  </Row>
                  <div className="label-one">
                    <Row>
                      <Col sm={6}>
                        <div className="my-form-input">
                          <Form.Control
                            type="text"
                            name="form_label"
                            id="inputPassword5"
                            aria-describedby="passwordHelpBlock"
                            placeholder="Some text here for the label"
                          />
                          <div className="input-img">
                            <img src="../../img/input-img.svg" />
                          </div>
                        </div>
                      </Col>
                      <Col sm={6}>
                        <div className="text-answer-div">
                          <Form.Select name="field_type">
                            <option> Field Type</option>
                            <option value="text">Text Answer</option>
                            <option value="radio">Multiple Choice</option>
                            <option value="checkbox">Checkboxes</option>
                          </Form.Select>
                          <div className="input-text-img">
                            <img src="../../img/check_boxIcon.svg" />
                          </div>
                          {/* <div className="input-select-arrow">
                      <img src="../../img/input-select-arrow.svg"/>
                    </div> */}
                        </div>
                      </Col>
                      <Col sm={6}>
                        <div className="my-form-input">
                          <Form.Control
                            type="text"
                            name="form_label"
                            id="inputPassword5"
                            aria-describedby="passwordHelpBlock"
                            placeholder="Option 1"
                          />
                          <div className="delete-icon">
                            <img src="../../img/removeIcon.svg" />
                          </div>
                        </div>
                      </Col>
                      <Col sm={6}>
                        <div className="my-form-input">
                          <Form.Control
                            type="text"
                            name="form_label"
                            id="inputPassword5"
                            aria-describedby="passwordHelpBlock"
                            placeholder="Option 2"
                          />
                          <div className="delete-icon">
                            <img src="../../img/removeIcon.svg" />
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </div>
                  <div className="apply-section">
                    <Row>
                      <Col sm={6}>
                        <div className="apply-condition">
                          <Button>
                            <FontAwesomeIcon icon={faPlus} /> Add Option
                          </Button>
                          <Button>Apply Condition</Button>
                        </div>
                      </Col>
                      <Col sm={6}>
                        <div className="add-group-t-button">
                          <div className="add-g">
                            <Button>
                              <FontAwesomeIcon icon={faPlus} />
                              Add to Group
                            </Button>
                          </div>
                          <div className="required">
                            <p>Required</p>
                          </div>
                          <div className="toogle-swich">
                            <input class="switch" type="checkbox" />
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </div>
                </div>
                <Row>
                  <Col sm={12}>
                    <div className="add-q">
                      <Button  variant="link">
                        <FontAwesomeIcon icon={faPlus} /> Add Question
                      </Button>
                    </div>
                    <div className="button">
                      <Button className="preview">Preview</Button>
                      <Button className="saveForm">Save Form</Button>
                    </div>
                  </Col>
                </Row>
                <div className="applyCondition-modal">
                <Modal
                  show={conditionFlag}
                  onHide={() => setConditionFlag(false)}
                  size="lg"
                  aria-labelledby="contained-modal-title-vcenter"
                  centered
                >
                  <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter" className="modal-heading">
                    Condition
                    </Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <div className="modal-condtion">
                    <Row>
                    <Col sm={12}>
                      <Form.Label className="formlabel modal-m-lable">If <span className="modal-lable">Option 1 </span>is selected,</Form.Label>
                    </Col>
                  
                
                  <Col sm={12}>
                        <div className="text-answer-div">
                          <Form.Select name="field_type">
                            <option> Field Type</option>
                            <option value="text">Text Answer</option>
                            <option value="radio">Multiple Choice</option>
                            <option value="checkbox">Checkboxes</option>
                          </Form.Select>
                          <div className="input-text-img">
                            <img src="../../img/check_boxIcon.svg" />
                          </div>
                          {/* <div className="input-select-arrow">
                      <img src="../../img/input-select-arrow.svg"/>
                    </div> */}
                        </div>
                      </Col>
                      <Col sm={6}>
                        <div className="my-form-input my-form-input-modal">
                          <Form.Control
                            type="text"
                            name="form_label"
                            id="inputPassword5"
                            aria-describedby="passwordHelpBlock"
                            placeholder="Option 1"
                          />
                          <div className="delete-icon modal-remove-icon">
                            <img src="../../img/removeIcon.svg" />
                          </div>
                        </div>
                      </Col>
                      <Col sm={6}>
                        <div className="my-form-input my-form-input-modal">
                          <Form.Control
                            type="text"
                            name="form_label"
                            id="inputPassword5"
                            aria-describedby="passwordHelpBlock"
                            placeholder="Option 2"
                          />
                          <div className="delete-icon modal-remove-icon">
                            <img src="../../img/removeIcon.svg" />
                          </div>
                        </div>
                      </Col>
                      <div className="apply-condition pb-2">
                          <Button>
                            <FontAwesomeIcon icon={faPlus} /> Add Option
                          </Button>
                          </div>
                      </Row>
                      <Row>
                    <Col sm={12}>
                      <Form.Label className="formlabel modal-m-lable">If <span className="modal-lable">Option 2 </span>is selected,</Form.Label>
                    </Col>
                  
                
                  <Col sm={12}>
                        <div className="text-answer-div">
                          <Form.Select name="field_type">
                            <option> Field Type</option>
                            <option value="text">Text Answer</option>
                            <option value="radio">Multiple Choice</option>
                            <option value="checkbox">Checkboxes</option>
                          </Form.Select>
                          <div className="input-text-img">
                            <img src="../../img/check_boxIcon.svg" />
                          </div>
                          {/* <div className="input-select-arrow">
                      <img src="../../img/input-select-arrow.svg"/>
                    </div> */}
                        </div>
                      </Col>
                      <Col sm={6}>
                        <div className="my-form-input my-form-input-modal">
                          <Form.Control
                            type="text"
                            name="form_label"
                            id="inputPassword5"
                            aria-describedby="passwordHelpBlock"
                            placeholder="Option 1"
                          />
                          <div className="delete-icon modal-remove-icon">
                            <img src="../../img/removeIcon.svg" />
                          </div>
                        </div>
                      </Col>
                      <Col sm={6}>
                        <div className="my-form-input my-form-input-modal">
                          <Form.Control
                            type="text"
                            name="form_label"
                            id="inputPassword5"
                            aria-describedby="passwordHelpBlock"
                            placeholder="Option 2"
                          />
                          <div className="delete-icon modal-remove-icon">
                            <img src="../../img/removeIcon.svg" />
                          </div>
                        </div>
                      </Col>
                      
                          <div className="apply-condition pb-2">
                          <Button>
                            <FontAwesomeIcon icon={faPlus} /> Add Option
                          </Button>
                          </div>
                          <Col sm={12}>
                    <div className="add-q mb-0">
                      <Button variant="link">
                        <FontAwesomeIcon icon={faPlus} /> Add Option
                      </Button>
                    </div>
                  </Col>
                      </Row>
                    </div>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button className="back">Back</Button>
                    <Button className="done">Done</Button>
                  </Modal.Footer>
                </Modal>
                </div>

                <div className="select-section-modal">
                <Modal
                  show={groupFlag}
                  onHide={() => setGroupFlag(false)}
                  size="md"
                  aria-labelledby="contained-modal-title-vcenter"
                  centered
                >
                  <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter" className="modal-heading">
                    Select Section
                    </Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <div className="modalTwo-select">
                        <div className="modal-two-check">
                        <label class="container">Section Name 1
                          <input type="checkbox" />
                          <span class="checkmark"></span>
                        </label>
                        <label class="container">Section Name 2
                          <input type="checkbox" />
                          <span class="checkmark"></span>
                        </label>
                        <label class="container">Section Name 3
                          <input type="checkbox" />
                          <span class="checkmark"></span>
                        </label>
                        <label class="container">Section Name 4
                          <input type="checkbox" />
                          <span class="checkmark"></span>
                        </label>
                        <label class="container">Section Name 5
                          <input type="checkbox" />
                          <span class="checkmark"></span>
                        </label>  
                        </div>
                    </div>
                  </Modal.Body>
                  <Modal.Footer>
                  {/* <div className="apply-condition modal-two-footer pb-2">
                          <Button>
                            <FontAwesomeIcon icon={faPlus} /> Create Section
                          </Button>
                          </div>
                    <Button className="done">Done</Button> */}
                    <div className="three-modal-footer">
                      <div className="modal-three">
                      <div className="my-form-input my-form-input-modal">
                          <Form.Control
                            className="mb-0"
                            type="text"
                            name="form_label"
                            id="inputPassword5"
                            aria-describedby="passwordHelpBlock"
                            placeholder=""
                          />
                          <Button className="right-button">
                          <img src="../../img/right-sign-img.svg" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Modal.Footer>
                </Modal>
                </div>
              </Form>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}

export default AddFormField;
