import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState,useEffect } from "react";
import { Button, Col, Container, Form, Modal, Row } from "react-bootstrap";
import LeftNavbar from "../../../components/LeftNavbar";
import TopHeader from "../../../components/TopHeader";
import Multiselect from "multiselect-react-dropdown";
import { createFormFieldValidation } from "../../../helpers/validation";
import { BASE_URL } from "../../../components/App";
import {useLocation,useNavigate} from 'react-router-dom';
let counter = 0;


const AddFormField = (props) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [conditionFlag, setConditionFlag] = useState(false);
  const [groupFlag, setGroupFlag] = useState(false);
  const [formSettingFlag, setFormSettingFlag] = useState(false);
  const [count, setCount] = useState(0);
  const [Index, setIndex] = useState(1);
  
  const [form, setForm] = useState([  
    { field_type: "text" },
    { field_type: "radio", option: [{ "": "" }, { "": "" }] },
    { field_type: "checkbox", option: [{ "": "" }, { "": "" }] },
  ]);
  const [sectionTitle, setSectionTitle] = useState("");
  const [errors, setErrors] = useState([{}]);
  const [conditionErrors, setConditionErrors] = useState([{}]);
  const [section, setSection] = useState([]);
  const [createSectionFlag, setCreateSectionFlag] = useState(false);
  useEffect(() => {
    if(location?.state?.form_name)
    {
      getFormField();
    }
  }, []);
  const setConditionField = (
    field,
    value,
    index,
    inner_index,
    inner_inner_index,
    key
  ) => {
    counter++;
    setCount(counter);
    const tempArr = form;
    const tempObj = tempArr[index];
    const tempOption = tempObj["option"];
    if (field === "option") {
      const keyOfOption = tempOption[inner_index];
      keyOfOption[key]["option"][inner_inner_index] = { [value]: value };
      tempOption[inner_index] = keyOfOption;
      tempArr[index]["option"] = tempOption;
      setForm(tempArr);
    } else {
      const keyOfOption = tempOption[inner_index];
      keyOfOption[key][field] = value;
      tempOption[inner_index] = keyOfOption;
      tempArr[index]["option"] = tempOption;
      setForm(tempArr);
    }
  };
  const getFormField = () =>{
    var requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    fetch(`${BASE_URL}/field?form_name=${location?.state?.form_name}`, requestOptions)
      .then((response) => response.json())
      .then((res) => {
        if(res?.result.length>0)
        {setForm(res?.result)}
      })
      .catch((error) => console.log("error", error));
  }
  const deleteFormField = (id) => {
    var requestOptions = {
      method: "DELETE",
      redirect: "follow",
    };

    fetch(`${BASE_URL}/field/${id}`, requestOptions)
      .then((response) => response.json())
      .then((result) => console.log("delete data successfully!"))
      .catch((error) => console.log("error", error));
  };
  const onSubmit = (e) => {
    e.preventDefault();
    const newErrors = createFormFieldValidation(form);
    let error_flag = false;
    newErrors.map((item) => {
      if (Object.values(item)[0]) {
        if (Array.isArray(Object.values(item)[0])) {
          Object.values(item)[0].map((inner_item) => {
            if (inner_item || !inner_item === "") {
              error_flag=true;
            }
          });
        }
        else{
          if(!item==="" || item)
          {
            error_flag=true;
          }
        }
      }
    });
    if(error_flag)
    {
      setErrors(newErrors);
    }
    else
    {
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      fetch(`${BASE_URL}/field/add?form_name=${location?.state?.form_name}`, {
        method: "post",
        body: JSON.stringify(form),
        headers: myHeaders,
      })
        .then((res) => res.json())
        .then((res) => {
          alert("Submit Successfully---->");
          setForm(res?.result);
        });
    }
    
  };
  const setField = (field, value, index, inner_index) => {
    counter++;
    setCount(counter);
    setIndex(index);
    const tempArr = form;
    const tempObj = tempArr[index];
    if (field === "option") {
      const tempOption = tempObj["option"];
      tempOption[inner_index] = { [value]: value };
      tempArr[index]["option"] = tempOption;
      setForm(tempArr);
    } else if (field === "field_type" && !(value === "text")) {
      tempObj["option"] = [{ "": "" }, { "": "" }];
      tempObj[field] = value;
      tempArr[index] = tempObj;
      setForm(tempArr);
    } else {
      tempObj[field] = value;
      tempArr[index] = tempObj;
      setForm(tempArr);
    }
    console.log("errors[index][field]---->", errors[index][field]);
    if (!!errors[index][field]) {
      if (field === "option") {
        let tempErrorArray = errors;
        let tempErrorObj = tempErrorArray[index];
        tempErrorObj["option"][inner_index] = undefined;
        tempErrorArray[index] = tempErrorObj;

        setErrors(tempErrorArray);
        console.log(
          "option.length--->",
          tempErrorObj["option"].length,
          "======",
          inner_index,
          "-------",
          tempErrorObj["option"]
        );
        console.log("Hello--->", tempErrorArray);
      } else {
        let tempErrorArray = errors;
        let tempErrorObj = tempErrorArray[index];
        delete tempErrorObj[field];
        tempErrorArray[index] = tempErrorObj;
        setErrors(tempErrorArray);
        console.log("Hello--->", tempErrorArray);
      }
    }
  };
  return (
    <>
      {console.log("newErrors- 12121---", errors)}
      {console.log("form--->", form)}
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
                          navigate("/form/add");
                        }}
                      >
                        <img src="../../img/back-arrow.svg" />
                      </Button>
                      <h4 className="mynewForm">My New Form</h4>
                      <Button
                        onClick={() => {
                          setFormSettingFlag(true);
                        }}
                      >
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
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                      sed do eiusmod tempor incididunt ut labore et dolore magna
                      aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing
                      elit, sed do eiusmod tempor incididunt ut labore et dolore
                      magna aliqua.
                    </p>
                  </Col>
                </Row>
                <Form>
                  {form?.map((item, index) => {
                    return (
                      <div className="my-new-formsection">
                        <Row>
                          {index === 0 ? (
                            <Col sm={12}>
                              <Form.Label className="formlabel">
                                Label {index + 1}
                              </Form.Label>
                            </Col>
                          ) : (
                            <>
                              <Col xs={6}>
                                <Form.Label className="formlabel">
                                  Label {index + 1}
                                </Form.Label>
                              </Col>
                              <Col xs={6}>
                                <div className="remove-button">
                                  <Button
                                    variant="link"
                                    onClick={() => {
                                      counter++;
                                      setCount(counter);
                                      let data = form;
                                      if(data[index]?.id){deleteFormField(data[index]?.id)}
                                      data.splice(index, 1);
                                      setForm(data);
                                    }}
                                  >
                                    <img src="../../img/removeIcon.svg" />{" "}
                                    Remove
                                  </Button>
                                </div>
                              </Col>
                            </>
                          )}
                        </Row>
                        <div className="label-one">
                          <Row>
                            <Col sm={6}>
                              <div className="my-form-input">
                                <Form.Control
                                  type="text"
                                  name="field_label"
                                  value={form[index]?.field_label}
                                  onChange={(e) => {
                                    setField(
                                      e.target.name,
                                      e.target.value,
                                      index
                                    );
                                  }}
                                  placeholder="Some text here for the label"
                                  isInvalid={!!errors[index]?.field_label}
                                />
                                <Form.Control.Feedback type="invalid">
                                  {errors[index]?.field_label}
                                </Form.Control.Feedback>
                                <div className="input-img">
                                  <img src="../../img/input-img.svg" />
                                </div>
                              </div>
                            </Col>
                            <Col sm={6}>
                              <div className="text-answer-div default-arrow-select">
                                <Form.Select
                                  name="field_type"
                                  onChange={(e) => {
                                    setField(
                                      e.target.name,
                                      e.target.value,
                                      index
                                    );
                                  }}
                                >
                                  <option
                                    value="text"
                                    selected={
                                      form[index]?.field_type === "text"
                                    }
                                  >
                                    Text Answer
                                  </option>
                                  <option
                                    value="radio"
                                    selected={
                                      form[index]?.field_type === "radio"
                                    }
                                  >
                                    Multiple Choice
                                  </option>
                                  <option
                                    value="checkbox"
                                    selected={
                                      form[index]?.field_type === "checkbox"
                                    }
                                  >
                                    Checkboxes
                                  </option>
                                  <option
                                    value="date"
                                    selected={
                                      form[index]?.field_type === "date"
                                    }
                                  >
                                    Date
                                  </option>
                                  <option
                                    value="image_upload"
                                    selected={
                                      form[index]?.field_type === "image_upload"
                                    }
                                  >
                                    Image Upload
                                  </option>
                                  <option
                                    value="document_attachment"
                                    selected={
                                      form[index]?.field_type === "document_attachment"
                                    }
                                  >
                                    Document Attachment
                                  </option>
                                  <option
                                    value="signature"
                                    selected={
                                      form[index]?.field_type === "signature"
                                    }
                                  >
                                    Signature
                                  </option>
                                  <option
                                    value="instruction_text"
                                    selected={
                                      form[index]?.field_type === "instruction_text"
                                    }
                                  >
                                    Instruction Text
                                  </option>
                                  <option
                                    value="headings"
                                    selected={
                                      form[index]?.field_type === "headings"
                                    }
                                  >
                                    Headings
                                  </option>
                                  <option
                                    value="dropdown_selection"
                                    selected={
                                      form[index]?.field_type === "dropdown_selection"
                                    }
                                  >
                                    Drop down selection
                                  </option>
                                </Form.Select>
                                <div className="input-text-img">
                                  <img
                                    src={
                                      form[index]?.field_type === "text"
                                        ? "../../img/input-text-icon.svg"
                                        : form[index]?.field_type === "radio"
                                        ? "../../img/multiple-choice-icon.svg"
                                        : form[index]?.field_type === "checkbox"
                                        ? "../../img/check_boxIcon.svg"
                                        : "../../img/input-text-icon.svg"
                                    }
                                  />
                                </div>
                              </div>
                            </Col>
                            {(form[index]?.field_type === "dropdown_selection" || form[index]?.field_type === "radio" || form[index]?.field_type === "checkbox") ? (
                              <>
                                {form[index]?.option?.map(
                                  (item, inner_index) => {
                                    return (
                                      <Col sm={6}>
                                        {console.log(
                                          "item---->",
                                          item[Object.keys(item)[0]]
                                        )}
                                        <div className="my-form-input">
                                          <Form.Control
                                            type="text"
                                            name="option"
                                            value={Object.keys(item)[0]}
                                            onChange={(e) => {
                                              setField(
                                                e.target.name,
                                                e.target.value,
                                                index,
                                                inner_index
                                              );
                                            }}
                                            placeholder={
                                              "Option " + (inner_index + 1)
                                            }
                                            isInvalid={
                                              errors[index]?.option
                                                ? !!errors[index]?.option[
                                                    inner_index
                                                  ]
                                                : null
                                            }
                                          />
                                          <Form.Control.Feedback type="invalid">
                                            {errors[index]?.option
                                              ? errors[index]?.option[
                                                  inner_index
                                                ]
                                              : ""}
                                          </Form.Control.Feedback>
                                          <div className="delete-icon">
                                            <img
                                              src="../../img/removeIcon.svg"
                                              onClick={() => {
                                                const tempArr = form;
                                                const tempObj = tempArr[index];
                                                if (
                                                  tempObj["option"].length > 2
                                                ) {
                                                  counter++;
                                                  setCount(counter);
                                                  tempObj["option"].splice(
                                                    inner_index,
                                                    1
                                                  );
                                                  tempArr[index] = tempObj;
                                                  setForm(tempArr);
                                                }
                                              }}
                                            />
                                          </div>
                                        </div>
                                      </Col>
                                    );
                                  }
                                )}
                              </>
                            ) : null}
                          </Row>
                        </div>

                        <div className="apply-section">
                          <Row>
                            <Col md={6}>
                              <div className="apply-condition">
                                {(form[index]?.field_type === "dropdown_selection" || form[index]?.field_type === "radio" || form[index]?.field_type === "checkbox") ? (
                                  <>
                                    <Button
                                      onClick={() => {
                                        counter++;
                                        setCount(counter);
                                        const tempArr = form;
                                        const tempObj = tempArr[index];
                                        tempObj["option"].push({ "": "" });
                                        tempArr[index] = tempObj;
                                        setForm(tempArr);
                                      }}
                                    >
                                      <FontAwesomeIcon icon={faPlus} /> Add
                                      Option
                                    </Button>
                                    <Button
                                      onClick={() => {
                                        let fillOptionCounter = 0;
                                        setIndex(index);
                                        const tempArr = form;
                                        const tempObj = tempArr[index];
                                        const tempOption = tempObj["option"];
                                        tempOption.map((item) => {
                                          if (!(Object.keys(item)[0] === "")) {
                                            fillOptionCounter++;
                                          }
                                        });
                                        if (
                                          tempOption.length ===
                                          fillOptionCounter
                                        ) {
                                          setConditionFlag(!conditionFlag);
                                          tempOption.map((item) => {
                                            item[Object.keys(item)[0]] = {
                                              field_type: "text",
                                              option: [{ "": "" }, { "": "" }],
                                            };
                                          });
                                        } else {
                                          alert("Please Fill Option First");
                                        }

                                        tempArr[index]["option"] = tempOption;
                                        setForm(tempArr);
                                      }}
                                    >
                                      Apply Condition
                                    </Button>
                                  </>
                                ) : null}
                              </div>
                            </Col>
                            <Col md={6}>
                              <div className="add-group-t-button">
                                <div className="add-g">
                                  <Button
                                    onClick={() => {
                                      setGroupFlag(!groupFlag);
                                      setCreateSectionFlag(false);
                                      setIndex(index);
                                    }}
                                  >
                                    <FontAwesomeIcon icon={faPlus} />
                                    Add to Group
                                  </Button>
                                </div>
                                <div className="required">
                                  <p>Required</p>
                                </div>
                                <div className="toogle-swich">
                                  <input
                                    class="switch"
                                    name="required"
                                    type="checkbox"
                                    onChange={(e) => {
                                      setField(
                                        e.target.name,
                                        e.target.checked,
                                        index
                                      );
                                    }}
                                  />
                                </div>
                              </div>
                            </Col>
                          </Row>
                        </div>
                      </div>
                    );
                  })}

                  <Row>
                    <Col sm={12}>
                      <div className="add-q">
                        <Button
                          variant="link"
                          onClick={() => {
                            let data = form;
                            console.log("data----?", data);
                            counter++;
                            setCount(counter);
                            data.push({ field_type: "text" });
                            setForm(data);
                          }}
                        >
                          <FontAwesomeIcon icon={faPlus} /> Add Question
                        </Button>
                      </div>
                      <div className="button mb-5">
                        <Button className="preview">Preview</Button>
                        <Button className="saveForm" onClick={onSubmit}>
                          Save Form
                        </Button>
                      </div>
                    </Col>
                  </Row>
                  <div className="applyCondition-modal">
                    {conditionFlag ? (
                      <Modal
                        show={conditionFlag}
                        onHide={() => {
                          setConditionFlag(false);
                        }}
                        size="lg"
                        aria-labelledby="contained-modal-title-vcenter"
                        centered
                      >
                        <Modal.Header closeButton>
                          <Modal.Title
                            id="contained-modal-title-vcenter"
                            className="modal-heading"
                          >
                            Condition
                          </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                          <div className="modal-condtion">
                            {form[Index]?.["option"]?.map((item, index) => {
                              return (
                                <Row>
                                  <Col sm={12}>
                                    <Form.Label className="formlabel modal-m-lable">
                                      If{" "}
                                      <span className="modal-lable">
                                        {Object.keys(item) &&
                                        !(Object.keys(item)[0] === "")
                                          ? Object.keys(item)[0]
                                          : "Option " + (index + 1)}{" "}
                                      </span>
                                      is selected,
                                    </Form.Label>
                                  </Col>
                                  <Col sm={12}>
                                    <Form.Label>Label</Form.Label>
                                  </Col>
                                  <Col lg={6}>
                                    <Form.Control
                                      type="text"
                                      name="field_label"
                                      placeholder="Some text here for the label"
                                      onChange={(e) => {
                                        setConditionField(
                                          e.target.name,
                                          e.target.value,
                                          Index,
                                          index,
                                          0,
                                          Object.keys(item)[0]
                                        );
                                      }}
                                    />
                                  </Col>
                                  <Col lg={6} className="mt-3 mt-lg-0">
                                    <div className="text-answer-div">
                                      <Form.Select
                                        name="field_type"
                                        onChange={(e) => {
                                          setConditionField(
                                            e.target.name,
                                            e.target.value,
                                            Index,
                                            index,
                                            0,
                                            Object.keys(item)[0]
                                          );
                                        }}
                                      >
                                        <option value="text">
                                          Text Answer
                                        </option>
                                        <option value="radio">
                                          Multiple Choice
                                        </option>
                                        <option value="checkbox">
                                          Checkboxes
                                        </option>
                                      </Form.Select>
                                      <div className="input-text-img">
                                        <img src="../../img/check_boxIcon.svg" />
                                      </div>
                                      {/* <div className="input-select-arrow">
                        <img src="../../img/input-select-arrow.svg"/>
                      </div> */}
                                    </div>
                                  </Col>
                                  {!(
                                    item[Object.keys(item)[0]].field_type ===
                                    "text"
                                  ) ? (
                                    <>
                                      {item[Object.keys(item)[0]]["option"].map(
                                        (inner_item, inner_index) => {
                                          return (
                                            <Col lg={6}>
                                              {console.log(
                                                "inner_item--->",
                                                inner_item[
                                                  Object.keys(inner_item)[0]
                                                ]
                                              )}
                                              <div className="my-form-input my-form-input-modal">
                                                <Form.Control
                                                  type="text"
                                                  name="option"
                                                  value={
                                                    inner_item[
                                                      Object.keys(inner_item)[0]
                                                    ]
                                                  }
                                                  placeholder={
                                                    "Option " +
                                                    (inner_index + 1)
                                                  }
                                                  onChange={(e) => {
                                                    setConditionField(
                                                      e.target.name,
                                                      e.target.value,
                                                      Index,
                                                      index,
                                                      inner_index,
                                                      Object.keys(item)[0]
                                                    );
                                                  }}
                                                />
                                                <div
                                                  className="delete-icon modal-remove-icon"
                                                  onClick={() => {
                                                    counter++;
                                                    setCount(counter);
                                                    
                                                    const tempArr = form;
                                                    
                                                    const tempObj =
                                                      tempArr[Index];
                                                    
                                                    const tempOption =
                                                      tempObj["option"];
                                                    

                                                    const keyOfOption =
                                                      tempOption[index];
                                                    
                                                    
                                                    keyOfOption[
                                                      Object.keys(item)[0]
                                                    ]["option"].splice(
                                                      inner_index,
                                                      1
                                                    );
                                                    tempOption[index] =
                                                      keyOfOption;
                                                    tempArr[Index]["option"] =
                                                      tempOption;
                                                    setForm(tempArr);
                                                    counter++;
                                                    setCount(counter);
                                                  }}
                                                >
                                                  <img src="../../img/removeIcon.svg" />
                                                </div>
                                              </div>
                                            </Col>
                                          );
                                        }
                                      )}
                                    </>
                                  ) : null}

                                  <div className="apply-condition pb-2">
                                    {!(
                                      item[Object.keys(item)[0]].field_type ===
                                      "text"
                                    ) ? (
                                      <Button
                                        onClick={() => {
                                          counter++;
                                          setCount(counter);
                                          const tempArr = form;
                                          const tempObj = tempArr[Index];
                                          const tempOption = tempObj["option"];

                                          const keyOfOption = tempOption[index];
                                          keyOfOption[Object.keys(item)[0]][
                                            "option"
                                          ].push({ "": "" });
                                          tempOption[index] = keyOfOption;
                                          tempArr[Index]["option"] = tempOption;
                                          setForm(tempArr);
                                        }}
                                      >
                                        <FontAwesomeIcon icon={faPlus} /> Add
                                        Option
                                      </Button>
                                    ) : null}
                                  </div>
                                </Row>
                              );
                            })}
                          </div>
                        </Modal.Body>
                        <Modal.Footer>
                          <Button
                            className="back"
                            onClick={() => {
                              setConditionFlag(false);
                            }}
                          >
                            Back
                          </Button>
                          <Button className="done">Done</Button>
                        </Modal.Footer>
                      </Modal>
                    ) : null}
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
                        <Modal.Title
                          id="contained-modal-title-vcenter"
                          className="modal-heading"
                        >
                          Select Section
                        </Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                        <div className="modalTwo-select">
                          <div className="modal-two-check">
                            {section?.map((item) => {
                              return (
                                <label class="container">
                                  {item}
                                  <input
                                    type="checkbox"
                                    name={item}
                                    onChange={(e) => {
                                      counter++;
                                      setCount(counter);
                                      e.target.name = e.target.name
                                        .toLocaleLowerCase()
                                        .replace(" ", "_");
                                      const tempArr = form;
                                      const tempObj = tempArr[Index];
                                      tempObj[e.target.name] = e.target.checked;
                                      tempArr[Index] = tempObj;
                                      setForm(tempArr);
                                    }}
                                  />
                                  <span class="checkmark"></span>
                                </label>
                              );
                            })}
                          </div>
                        </div>
                      </Modal.Body>
                      <Modal.Footer>
                        {!createSectionFlag ? (
                          <>
                            <div className="apply-condition modal-two-footer pb-2">
                              <Button
                                onClick={() => {
                                  setCreateSectionFlag(true);
                                }}
                              >
                                <FontAwesomeIcon icon={faPlus} /> Create Section
                              </Button>
                            </div>
                            <Button
                              className="done"
                              onClick={() => {
                                setGroupFlag(!groupFlag);
                              }}
                            >
                              Done
                            </Button>
                          </>
                        ) : null}

                        {createSectionFlag ? (
                          <div className="three-modal-footer">
                            <div className="modal-three">
                              <div className="my-form-input my-form-input-modal">
                                <Form.Control
                                  className="mb-0"
                                  type="text"
                                  name="section_title"
                                  value={sectionTitle}
                                  onChange={(e) => {
                                    setSectionTitle(e.target.value);
                                  }}
                                  placeholder="Section"
                                />
                                <Button
                                  className="right-button"
                                  disabled={sectionTitle==="" ? true : false}
                                  onClick={() => {
                                    counter++;
                                    setCount(counter);
                                    let sectionData = section;
                                    sectionData.push(sectionTitle);
                                    setSection(sectionData);
                                    setSectionTitle("");
                                    setCreateSectionFlag(false);
                                  }}
                                >
                                  <img src="../../img/right-sign-img.svg" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ) : null}
                      </Modal.Footer>
                    </Modal>
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
                              <Form.Control type="date" name="form_name" />
                            </Form.Group>
                          </Col>
                          <Col lg={3} sm={6} className="mt-3 mt-sm-0">
                            <Form.Group>
                              <Form.Label>Start Time</Form.Label>
                              <Form.Control type="time" name="form_name" />
                            </Form.Group>
                          </Col>
                          <Col lg={3} sm={6} className="mt-3 mt-lg-0">
                            <Form.Group>
                              <Form.Label>End Date</Form.Label>
                              <Form.Control type="date" name="form_name" />
                            </Form.Group>
                          </Col>
                          <Col lg={3} sm={6} className="mt-3 mt-lg-0">
                            <Form.Group>
                              <Form.Label>End Time</Form.Label>
                              <Form.Control type="time" name="form_name" />
                            </Form.Group>
                          </Col>
                        </Row>
                        <Row className="mt-4">
                          <Col lg={3} md={6}>
                            <Form.Group>
                              <Form.Label>
                                Applicable to all franchisee
                              </Form.Label>
                              <div className="new-form-radio">
                                <div className="new-form-radio-box">
                                  <label for="yes">
                                    <input
                                      type="radio"
                                      value="Yes"
                                      name="form_template_select"
                                      id="yes"
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
                                      name="form_template_select"
                                      id="no"
                                    />
                                    <span className="radio-round"></span>
                                    <p>No</p>
                                  </label>
                                </div>
                              </div>
                            </Form.Group>
                          </Col>
                          <Col lg={9} md={6} className="mt-3 mt-md-0">
                            <Form.Group>
                              <Form.Label>Select Franchisee</Form.Label>
                              <Multiselect
                                displayValue="key"
                                className="multiselect-box default-arrow-select"
                                placeholder="Select Franchisee"
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
                              <Form.Label>Applicable to all users</Form.Label>
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
                          <Col lg={9} md={6} className="mt-3 mt-md-0">
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
                      </div>
                    </Modal.Body>
                    <Modal.Footer className="justify-content-center">
                      <Button className="back">Cancel</Button>
                      <Button className="done">Save Settings</Button>
                    </Modal.Footer>
                  </Modal>
                </Form>
              </div>
            </div>
          </Container>
        </section>
      </div>
    </>
  );
};

export default AddFormField;
