import React, { useState } from "react";
import { Button, Col, Container, Row, Form, Modal } from "react-bootstrap";
import LeftNavbar from "../components/LeftNavbar";
import TopHeader from "../components/TopHeader";
import Multiselect from "multiselect-react-dropdown";
import DropAllFile from "../components/DragDropMultiple";
import DropOneFile from '../components/DragDrop';
import { EditAnnouncementValidation } from "../helpers/validation";

const EditAnnouncement = () => {
  const [errors, setErrors] = useState({});
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [coverImage, setCoverImage] = useState({});
  const [videoTutorialFiles, setVideoTutorialFiles] = useState([]);
  const [relatedFiles, setRelatedFiles] = useState([]);
  const [operatingManualData, setOperatingManualData] = useState({
    related_files: [],
  });
  coverImage && console.log('COVER IMAGE:', coverImage);
  videoTutorialFiles && console.log('VIDEO FILES:', videoTutorialFiles);
  relatedFiles && console.log('RELATED FILES:', relatedFiles);

  const setOperatingManualField = (field, value) => {
    console.log("The field and value",field,value)
    setOperatingManualData({ ...operatingManualData, [field]: value });
    if (!!errors[field]) {
      setErrors({
        ...errors,
        [field]: null,
      });
    }
  };
 
  const onSubmit = (e) => {
    e.preventDefault();
     const newErrors = EditAnnouncementValidation(operatingManualData);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      console.log("The API")
    }
  };
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
                  <header className="title-head">
                    <h1 className="title-lg">Edit Announcement <span className="setting-ico" onClick={handleShow}><img src="../img/setting-ico.png" alt=""/></span></h1>
                  </header>
                  <div className="training-form">
                    <Row>
                      <Col md={12} className="mb-3">
                        <Form.Group>
                          <Form.Label>Announcement Title</Form.Label>
                          <Form.Control 
                              type="text" 
                              name="announcement_title"
                              value={operatingManualData?.title}
                              placeholder="Enter Title"
                              onChange={(e) => {
                                setOperatingManualField(
                                  e.target.name,
                                  e.target.value
                                );
                              }}
                              isInvalid={!!errors.announcement_title}
                              />
                          <Form.Control.Feedback type="invalid">
                            {errors.announcement_title}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col md={12} className="mb-3">
                        <Form.Group>
                          <Form.Label>Announcement Description</Form.Label>
                          <Form.Control
                            as="textarea"
                            name="announcement_description"
                            rows={3}
                            value={operatingManualData?.title}
                            placeholder="Enter Description"
                            onChange={(e) => {
                              setOperatingManualField(
                                e.target.name,
                                e.target.value
                              );
                            }}
                            isInvalid={!!errors.announcement_description}
                            />
                             <Form.Control.Feedback type="invalid">
                            {errors.announcement_description}
                          </Form.Control.Feedback>
                        </Form.Group>
                       
                      </Col>
                    </Row>
                    <Row>
                      <Col md={6} className="mb-3">
                        <Form.Group>
                          <Form.Label>Upload Related Image :</Form.Label>
                          <DropOneFile onSave={setCoverImage} />
                        </Form.Group>
                      </Col>
                      <Col md={6} className="mb-3">
                        <Form.Group>
                          <Form.Label>Upload Video Tutorial Here :</Form.Label>
                          <DropAllFile onSave={setVideoTutorialFiles} />
                        </Form.Group>
                      </Col>
                      <Col md={6} className="mb-3">
                        <Form.Group>
                          <Form.Label>Upload Related Files :</Form.Label>
                          <DropAllFile onSave={setRelatedFiles}/>
                        </Form.Group>
                      </Col>
                      <Col md={12}>
                        <div className="cta text-center mt-5 mb-5">
                          <Button variant="outline" className="me-3" type="submit">Preview</Button>
                          <Button variant="primary" type="submit" onClick={onSubmit}>Save</Button>
                        </div>
                      </Col>
                    </Row>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </section>
      </div>
      
      <Modal className="training-modal" size="lg" show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title><img src="../img/setting-ico.png" alt=""/> Settings</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="form-settings-content">
            <Row>
              <Col lg={3} md={6}>
                <Form.Group>
                  <Form.Label>Send to all franchisee</Form.Label>
                  <div className="new-form-radio">
                    <div className="new-form-radio-box">
                      <label for="yes1">
                        <input
                          type="radio"
                          value="Yes"
                          name="form_template_select1"
                          id="yes1"
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
                          name="form_template_select1"
                          id="no1"
                        />
                        <span className="radio-round"></span>
                        <p>No</p>
                      </label>
                    </div>
                  </div>
                </Form.Group>
              </Col>
              <Col lg={9} md={6}  className="mt-3 mt-md-0">
                <Form.Group>
                  <Form.Label>Select Franchisee</Form.Label>
                  <Multiselect
                    placeholder="Select Franchisee"
                    displayValue="key"
                    className="multiselect-box default-arrow-select"
                    onKeyPressFn={function noRefCheck() {}}
                    onRemove={function noRefCheck() {}}
                    onSearch={function noRefCheck() {}}
                    onSelect={function noRefCheck() {}}
                    options={[
                      {
                        cat: "Group 1",
                        key: "Option 1",
                      },
                      {
                        cat: "Group 1",
                        key: "Option 2",
                      },
                      {
                        cat: "Group 1",
                        key: "Option 3",
                      },
                      {
                        cat: "Group 2",
                        key: "Option 4",
                      },
                      {
                        cat: "Group 2",
                        key: "Option 5",
                      },
                      {
                        cat: "Group 2",
                        key: "Option 6",
                      },
                      {
                        cat: "Group 2",
                        key: "Option 7",
                      },
                    ]}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className="mt-4">
              <Col lg={3} md={6}>
                <Form.Group>
                  <Form.Label>Send to all user roles</Form.Label>
                  <div className="new-form-radio">
                    <div className="new-form-radio-box">
                      <label for="yes2">
                        <input
                          type="radio"
                          value="Yes"
                          name="form_template_select2"
                          id="yes2"
                        />
                        <span className="radio-round"></span>
                        <p>Yes</p>
                      </label>
                    </div>
                    <div className="new-form-radio-box">
                      <label for="no2">
                        <input
                          type="radio"
                          value="No"
                          name="form_template_select2"
                          id="no2"
                        />
                        <span className="radio-round"></span>
                        <p>No</p>
                      </label>
                    </div>
                  </div>
                </Form.Group>
              </Col>
              <Col lg={9} md={6}  className="mt-3 mt-md-0">
                <Form.Group>
                  <Form.Label>Select User Roles</Form.Label>
                  <Multiselect
                    placeholder="Select User Roles"
                    displayValue="key"
                    className="multiselect-box default-arrow-select"
                    onKeyPressFn={function noRefCheck() {}}
                    onRemove={function noRefCheck() {}}
                    onSearch={function noRefCheck() {}}
                    onSelect={function noRefCheck() {}}
                    options={[
                      {
                        cat: "Group 1",
                        key: "Option 1",
                      },
                      {
                        cat: "Group 1",
                        key: "Option 2",
                      },
                      {
                        cat: "Group 1",
                        key: "Option 3",
                      },
                      {
                        cat: "Group 2",
                        key: "Option 4",
                      },
                      {
                        cat: "Group 2",
                        key: "Option 5",
                      },
                      {
                        cat: "Group 2",
                        key: "Option 6",
                      },
                      {
                        cat: "Group 2",
                        key: "Option 7",
                      },
                    ]}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className="mt-4">
              <Col lg={3} sm={6}>
                <Form.Group>
                  <Form.Label>Schedule Date</Form.Label>
                  <Form.Control type="date" name="form_name" />
                </Form.Group>
              </Col>
              <Col lg={3} sm={6} className="mt-3 mt-lg-0">
                <Form.Group>
                  <Form.Label>Schedule Time</Form.Label>
                  <Form.Control type="time" name="form_name" />
                </Form.Group>
              </Col>
            </Row>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="transparent" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary">
            Save Settings
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );

}

export default EditAnnouncement