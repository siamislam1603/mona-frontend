import React, { useState, useEffect } from "react";
import { Form, Accordion, Col, Row, Container } from "react-bootstrap";
import { BASE_URL } from "../../components/App";
import PdfComponent from "../PrintPDF/PdfComponent";

let styleFlag = false;
const OperatingManual = () => {
  const [category, setCategory] = useState([]);
  const [search, setSearch] = useState("");
  const [manuIndex, setManuIndex] = useState(0);

  const [operatingManualdata, setOperatingManualdata] = useState([]);
  useEffect(() => {
    getCategory();
  }, []);
  const getCategory = async () => {
    var requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    fetch(`${BASE_URL}/operating_manual/category`, requestOptions)
      .then((response) => response.text())
      .then((result) => {
        result = JSON.parse(result);
        console.log("result---->", result?.result);
        getOperatingManual("category", result?.result[0]?.category_name);
        setCategory(result.result);
      })
      .catch((error) => console.log("error", error));
  };
  const getOperatingManual = (key, defaultTab) => {
    var requestOptions = {
      method: "GET",
      redirect: "follow",
    };
    let api_url = "";
    if (key === "search") {
      api_url = `${BASE_URL}/operating_manual?search=${defaultTab}`;
    } else {
      api_url = `${BASE_URL}/operating_manual?category_name=${defaultTab}`;
    }
    fetch(api_url, requestOptions)
      .then((response) => response.text())
      .then((result) => {
        result = JSON.parse(result);
        setOperatingManualdata(result.result);
      })
      .catch((error) => console.log("error", error));
  };
  return (
    <>
      {console.log("flag", styleFlag)}
      <Container>
        <Row>
          <Col xl={3} className="p-0">
            <section className="Accordion-menu">
              <h1 className="d-flex justify-content-center">
                Operating Manual
              </h1>
              <div className="accordion-menu-list">
                <Form.Control
                  type="text"
                  name="search"
                  className="menu_search"
                  placeholder="Search"
                  onChange={(e) => {
                    setSearch(e.target.value);
                    if (e.target.value === "") {
                      let data = category;
                      getOperatingManual("category", data[0]?.category_name);
                    } else {
                      getOperatingManual("search", e.target.value);
                    }
                  }}
                />
                {search === "" ? (
                  <Accordion defaultActiveKey="0" flush>
                    {category.map((item, index) => {
                      return (
                        <Accordion.Item
                          eventKey={index}
                          onClick={() => {
                            let data = category;
                            getOperatingManual(
                              "category",
                              data[index]?.category_name
                            );
                          }}
                        >
                          <Accordion.Header
                            onClick={() => {
                              styleFlag = false;
                            }}
                          >
                            {item.category_name}
                          </Accordion.Header>

                          {operatingManualdata.length > 0 ? (
                            operatingManualdata.map((item, index) => {
                              return (
                                <Accordion.Body
                                  className={
                                    styleFlag && manuIndex === index
                                      ? "menu_list menu_active"
                                      : "menu_list"
                                  }
                                  onClick={() => {
                                    styleFlag = true;
                                    setManuIndex(index);
                                  }}
                                >
                                  {item.question}
                                </Accordion.Body>
                              );
                            })
                          ) : (
                            <Accordion.Body>No Records Found</Accordion.Body>
                          )}
                        </Accordion.Item>
                      );
                    })}
                  </Accordion>
                ) : operatingManualdata.length > 0 ? (
                  operatingManualdata?.map((item, index) => {
                    return (
                      <p
                        className={
                          styleFlag && manuIndex === index
                            ? "search_menu_list menu_active"
                            : "search_menu_list"
                        }
                        onClick={() => {
                          setManuIndex(index);
                          styleFlag = true;
                        }}
                      >
                        {item.question}
                      </p>
                    );
                  })
                ) : (
                  <p className="no_records">No Records Found</p>
                )}
              </div>
            </section>
          </Col>
          <Col xl={9}>
            {console.log("manu index=---->", manuIndex)}
            {operatingManualdata.map((item, index) => {
              return index === manuIndex ? (
                <>
                  <PdfComponent {...item} />
                  <iframe
                    width="560"
                    height="315"
                    src={item.media}
                  ></iframe>
                </>
              ) : null;
            })}
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default OperatingManual;
