import React, { useState, useEffect } from 'react';
import { Col, Container, Form, Row, Button, Modal } from 'react-bootstrap';
import { BASE_URL } from '../../components/App';
import TopHeader from '../../components/TopHeader';
import LeftNavbar from '../../components/LeftNavbar';
import Multiselect from 'multiselect-react-dropdown';
import { createOperatingManualValidation } from '../../helpers/validation';
import MyEditor from '../CKEditor';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
let selectedFranchisee = [];
let selectedUserRole = [];
const AddSubOperatingManual = () => {
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});
  const [formSettingFlag, setFormSettingFlag] = useState(false);
  const [formSettingError, setFormSettingError] = useState({});
  const [formSettingData, setFormSettingData] = useState({});
  const [franchisee, setFranchisee] = useState([]);
  const [userRole, setUserRole] = useState([]);
  const setField = (field, value) => {
    setForm({ ...form, [field]: value });
    console.log('form---->', form);
    if (!!errors[field]) {
      setErrors({
        ...errors,
        [field]: null,
      });
    }
  };
  const setFormSettingFields = (field, value) => {
    setFormSettingData({ ...formSettingData, [field]: value });

    if (!!formSettingError[field]) {
      setFormSettingError({
        ...formSettingError,
        [field]: null,
      });
    }
  };
  function onSelectFranchisee(optionsList, selectedItem) {
    console.log('selected_item---->2', selectedItem);
    selectedFranchisee.push({
      id: selectedItem.id,
      role_label: selectedItem.registered_name,
    });
    console.log('selected_item---->1selectedFranchisee', selectedFranchisee);
  }
  function onRemoveFranchisee(selectedList, removedItem) {
    const index = selectedFranchisee.findIndex((object) => {
      return object.id === removedItem.id;
    });
    selectedFranchisee.splice(index, 1);
  }

  function onSelectUserRole(optionsList, selectedItem) {
    console.log('selected_item---->2', selectedItem);
    selectedUserRole.push({
      id: selectedItem.id,
      role_label: selectedItem.role_label,
    });
    console.log('selected_item---->1selectedFranchisee', selectedFranchisee);
  }
  function onRemoveUserRole(selectedList, removedItem) {
    const index = selectedUserRole.findIndex((object) => {
      return object.id === removedItem.id;
    });
    selectedUserRole.splice(index, 1);
  }
  const getUserRoleAndFranchiseeData = () => {
    var requestOptions = {
      method: 'GET',
      redirect: 'follow',
    };

    fetch(`${BASE_URL}/api/user-role`, requestOptions)
      .then((response) => response.json())
      .then((res) => {
        setUserRole(res?.userRoleList);
        console.log('response0-------->1', res?.userRoleList);
      })
      .catch((error) => console.log('error', error));
    fetch(`${BASE_URL}/api/franchisee-data`, requestOptions)
      .then((response) => response.json())
      .then((res) => {
        setFranchisee(res?.franchiseeList);
      })
      .catch((error) => console.log('error', error));
  };
  return (
    <>
      <div id="main">
        <section className="mainsection new_sub_module">
          <Container>
            <div className="admin-wrapper">
              <aside className="app-sidebar">
                <LeftNavbar />
              </aside>
              <div className="sec-column">
                <div className="new_module new_sub_module">
                  <TopHeader />
                  <Row>
                    <Col sm={12}>
                      <div className="mynewForm-heading">
                        <h4 className="mynewForm">New Sub Module</h4>
                        <Button
                          onClick={() => {
                            setFormSettingFlag(true);
                          }}
                        >
                          <img src="../../img/carbon_settings.svg" />
                        </Button>
                      </div>
                    </Col>
                    <Col sm={6}>
                      <div className="select_module">
                        <Form.Group>
                          <Form.Label className="formlabel">
                          Sub Module Name
                          </Form.Label>
                          <Form.Control
                          type="text"
                          name="field_label"
                          placeholder="Lorem ipsum dolor sit ame"
                        />
                        </Form.Group>
                      </div>
                    </Col>
                    <Col sm={6}>
                    <div className="select_module">
                        <Form.Group>
                          <Form.Label className="formlabel">
                            Select Module
                          </Form.Label>
                          <Form.Select name="field_type">
                            <option>a</option>
                            <option>b</option>
                            <option>c</option>
                            <option>d</option>
                            <option>e</option>
                          </Form.Select>
                        </Form.Group>
                      </div>
                    </Col>
                  </Row>
               
                  <Row>
                    <Col sm={12}>
                      <Form.Group>
                        <Form.Label className="formlabel">
                          Description
                        </Form.Label>
                        <MyEditor handleChange={setField} />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col sm={6}>
                      <Form.Group>
                        <Form.Label className="formlabel">
                          Upload Cover Image :
                        </Form.Label>
                        <div className="upload_cover_box">
                          <div className="cover_image">
                            <img src="../../img/create_module_img.png"></img>
                          </div>
                          <div className="add_image">
                            <div className="add_image_box">
                              <span>
                                {' '}
                                <img
                                  src="../../img/bi_cloud-upload.svg"
                                  alt=""
                                />{' '}
                                Add Image{' '}
                              </span>
                              <Form.Control
                                className="add_image_input"
                                type="file"
                              />
                            </div>
                          </div>
                          <Button variant="link">
                            <img src="../../img/removeIcon.svg" />
                          </Button>
                        </div>
                      </Form.Group>
                    </Col>
                    <Col sm={6}>
                      <Form.Group>
                        <Form.Label className="formlabel">
                          Upload Reference Video Here :
                        </Form.Label>

                        <div className="upload_cover_box video_reference">
                          <div className="cover_image">
                            <img src="../../img/create_module_img.png"></img>
                          </div>
                          <div className="add_image">
                            <div className="add_image_box">
                              <span>
                                {' '}
                                <img
                                  src="../../img/bi_cloud-upload.svg"
                                  alt=""
                                />{' '}
                                Add File{' '}
                              </span>
                              <Form.Control
                                className="add_image_input"
                                type="file"
                              />
                            </div>
                          </div>
                          <Button variant="link" className="remove_bin">
                            <img src="../../img/removeIcon.svg" />{' '}
                            <span>Remove</span>
                          </Button>
                        </div>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col sm={12}>
                      <div className="upload_related_files">
                        <Form.Group>
                          <Form.Label className="formlabel">
                            Upload Related Files :
                          </Form.Label>
                          <Row>
                            <Col sm={4}>
                              <div className="upload_related_box">
                                <div className="forms-content">
                                  <div className="content-icon-section">
                                    <img src="../../img/doc_blue.svg" />
                                  </div>
                                  <div className="content-title-section">
                                    <h6>document1.docx</h6>
                                    <h4>3 Hours</h4>
                                  </div>
                                </div>
                                <Button variant="link">
                                  <img src="../../img/removeIcon.svg" />
                                </Button>
                              </div>
                            </Col>
                            <Col sm={4}>
                              <div className="upload_related_box">
                                <div className="forms-content">
                                  <div className="content-icon-section">
                                    <img src="../../img/doc_pptx.svg" />
                                  </div>
                                  <div className="content-title-section">
                                    <h6>presentation1.pptx</h6>
                                    <h4>3 Hours</h4>
                                  </div>
                                </div>
                                <Button variant="link">
                                  <img src="../../img/removeIcon.svg" />
                                </Button>
                              </div>
                            </Col>
                          </Row>
                          <div className="add_image">
                            <div className="add_image_box">
                              <span>
                                {' '}
                                <img
                                  src="../../img/bi_cloud-upload.svg"
                                  alt=""
                                />{' '}
                                Add File{' '}
                              </span>
                              <Form.Control
                                className="add_image_input"
                                type="file"
                              />
                            </div>
                          </div>
                        </Form.Group>
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col sm={12}>
                      <div className="bottom_button">
                        <Button className="preview">Preview</Button>
                        <Button className="saveForm">Save</Button>
                      </div>
                    </Col>
                  </Row>
                </div>
              </div>
            </div>
          </Container>
        </section>
      </div>
      <Modal
        show={formSettingFlag}
        onHide={() => setFormSettingFlag(false)}
        size="lg"
        className="form-settings-modal"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title
            id="contained-modal-title-vcenter"
            className="modal-heading"
          >
            <img src="../../img/carbon_settings.svg" />
            Form Settings
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="form-settings-content">
            <Row>
              <Col lg={3} sm={6}>
                <Form.Group>
                  <Form.Label>Start Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="start_date"
                    value={formSettingData?.start_date}
                    onChange={(e) => {
                      setFormSettingFields(e.target.name, e.target.value);
                    }}
                    isInvalid={!!formSettingError.start_date}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formSettingError.start_date}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col lg={3} sm={6} className="mt-3 mt-sm-0">
                <Form.Group>
                  <Form.Label>Start Time</Form.Label>
                  <Form.Control
                    type="time"
                    name="start_time"
                    value={formSettingData?.start_time}
                    onChange={(e) => {
                      setFormSettingFields(e.target.name, e.target.value);
                    }}
                    isInvalid={!!formSettingError.start_time}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formSettingError.start_time}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col lg={3} sm={6} className="mt-3 mt-lg-0">
                <Form.Group>
                  <Form.Label>End Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="end_date"
                    value={formSettingData?.end_date}
                    onChange={(e) => {
                      setFormSettingFields(e.target.name, e.target.value);
                    }}
                    isInvalid={!!formSettingError.end_date}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formSettingError.end_date}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col lg={3} sm={6} className="mt-3 mt-lg-0">
                <Form.Group>
                  <Form.Label>End Time</Form.Label>
                  <Form.Control
                    type="time"
                    name="end_time"
                    value={formSettingData?.end_time}
                    onChange={(e) => {
                      setFormSettingFields(e.target.name, e.target.value);
                    }}
                    isInvalid={!!formSettingError.end_time}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formSettingError.end_time}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <Row className="mt-4">
              <Col lg={3} md={6}>
                <Form.Group>
                  <Form.Label>Applicable to all franchisee</Form.Label>
                  <div className="new-form-radio">
                    <div className="new-form-radio-box">
                      <label for="yes">
                        <input
                          type="radio"
                          value="Yes"
                          name="applicable_to_franchisee"
                          id="yes"
                          onChange={(e) => {
                            setFormSettingFields(e.target.name, e.target.value);
                          }}
                          checked={
                            formSettingData?.applicable_to_franchisee ===
                              true ||
                            formSettingData?.applicable_to_franchisee === 'Yes'
                          }
                        />
                        <span className="radio-round"></span>
                        <p>Yes</p>
                      </label>
                    </div>
                    <div className="new-form-radio-box">
                      <label for="no">
                        <input
                          type="radio"
                          value="No"
                          name="applicable_to_franchisee"
                          id="no"
                          onChange={(e) => {
                            setFormSettingFields(e.target.name, e.target.value);
                          }}
                          checked={
                            formSettingData?.applicable_to_franchisee ===
                              false ||
                            formSettingData?.applicable_to_franchisee === 'No'
                          }
                        />
                        <span className="radio-round"></span>
                        <p>No</p>
                      </label>
                    </div>
                  </div>
                </Form.Group>
              </Col>
              {formSettingData?.applicable_to_franchisee === 'No' ||
              formSettingData?.applicable_to_franchisee === false ? (
                <Col lg={9} md={6} className="mt-3 mt-md-0">
                  <Form.Group>
                    <Form.Label>Select Franchisee</Form.Label>
                    <Multiselect
                      displayValue="registered_name"
                      className="multiselect-box default-arrow-select"
                      placeholder="Select Franchisee"
                      selectedValues={selectedFranchisee}
                      onKeyPressFn={function noRefCheck() {}}
                      onRemove={onRemoveFranchisee}
                      onSearch={function noRefCheck() {}}
                      onSelect={onSelectFranchisee}
                      options={franchisee}
                    />
                    <p className="error">{formSettingError.franchisee}</p>
                  </Form.Group>
                </Col>
              ) : null}
              <Col lg={3} md={6}>
                <Form.Group>
                  <Form.Label>Applicable to all users</Form.Label>
                  <div className="new-form-radio">
                    <div className="new-form-radio-box">
                      <label for="yes1">
                        <input
                          type="radio"
                          value="Yes"
                          name="applicable_to_user"
                          id="yes1"
                          onChange={(e) => {
                            setFormSettingFields(e.target.name, e.target.value);
                          }}
                          checked={
                            formSettingData?.applicable_to_user == true ||
                            formSettingData?.applicable_to_user === 'Yes'
                          }
                        />
                        <span className="radio-round"></span>
                        <p>Yes</p>
                      </label>
                    </div>
                    <div className="new-form-radio-box">
                      <label for="no1">
                        <input
                          type="radio"
                          value="No"
                          name="applicable_to_user"
                          id="no1"
                          onChange={(e) => {
                            setFormSettingFields(e.target.name, e.target.value);
                          }}
                          checked={
                            formSettingData?.applicable_to_user == false ||
                            formSettingData?.applicable_to_user === 'No'
                          }
                        />
                        <span className="radio-round"></span>
                        <p>No</p>
                      </label>
                    </div>
                  </div>
                </Form.Group>
              </Col>
              {formSettingData?.applicable_to_user === 'No' ||
              formSettingData?.applicable_to_user === false ? (
                <Col lg={9} md={6} className="mt-3 mt-md-0">
                  <Form.Group>
                    <Form.Label>Select User Roles</Form.Label>
                    <Multiselect
                      placeholder="Select User Roles"
                      displayValue="role_label"
                      selectedValues={selectedUserRole}
                      className="multiselect-box default-arrow-select"
                      onKeyPressFn={function noRefCheck() {}}
                      onRemove={onRemoveUserRole}
                      onSearch={function noRefCheck() {}}
                      onSelect={onSelectUserRole}
                      options={userRole}
                    />
                    <p className="error">{formSettingError.user}</p>
                  </Form.Group>
                </Col>
              ) : null}
            </Row>
          </div>
        </Modal.Body>
        <Modal.Footer className="justify-content-center">
          <Button className="back">Cancel</Button>
          <Button className="done">Save Settings</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AddSubOperatingManual;
