<<<<<<< HEAD:src/pages/OperatingManual/view.jsx
import { faEllipsisVertical, faPen, faPlus, faRemove } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import { Button, Col, Container, Dropdown, Form, Row } from 'react-bootstrap';
=======
import {
  faEllipsisVertical,
  faPen,
  faPlus,
  faRemove,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import {
  Button,
  Col,
  Container,
  Dropdown,
  Form,
  Modal,
  Row,
} from 'react-bootstrap';
>>>>>>> Vaibhavi:src/pages/OperatingManual/view.jsx
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../../components/App';
import LeftNavbar from '../../components/LeftNavbar';
import TopHeader from '../../components/TopHeader';
import PdfComponent from '../PrintPDF/PdfComponent';

const OperatingManual = () => {
  const navigate = useNavigate();
  const [category, setCategory] = useState([]);
  const [Index, setIndex] = useState(0);
  const [innerIndex, setInnerIndex] = useState(0);
  const [operatingManualdata, setOperatingManualdata] = useState([]);
  const [show, setShow] = useState(false);
  let [videoUrl, setVideoUrl] = useState('');
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  useEffect(() => {
    getCategory();
  }, []);
  const getCategory = async () => {
    var requestOptions = {
      method: 'GET',
      redirect: 'follow',
    };

    fetch(`${BASE_URL}/operating_manual/category`, requestOptions)
      .then((response) => response.text())
      .then((result) => {
        result = JSON.parse(result);
        console.log('result---->', result?.result);
<<<<<<< HEAD:src/pages/OperatingManual/view.jsx
        getOperatingManual('category', result?.result[0]?.category_name);
=======
        getOperatingManual('category', result?.result[0]?.category_name, false);
>>>>>>> Vaibhavi:src/pages/OperatingManual/view.jsx
        setCategory(result.result);
      })
      .catch((error) => console.log('error', error));
  };
  const getOperatingManual = (key, defaultTab, flag) => {
    var requestOptions = {
      method: 'GET',
      redirect: 'follow',
    };
    let api_url = '';
    if (key === 'search') {
      api_url = `${BASE_URL}/operating_manual?search=${defaultTab}`;
    } else {
      api_url = `${BASE_URL}/operating_manual`;
    }

    fetch(api_url, requestOptions)
      .then((response) => response.text())
      .then((result) => {
        result = JSON.parse(result);
        setOperatingManualdata(result.result);
<<<<<<< HEAD:src/pages/OperatingManual/view.jsx

        var tree = document.getElementById('tree1');
        if (tree) {
          console.log('tree---->', tree);
          tree
            .querySelectorAll('ul')
            .forEach(function (el, index, key, parent) {
              var elm = el.parentNode;
              elm.classList.add('branch');

              var x = document.createElement('img');
              x.src = '../img/plus-circle.svg';
              // x.classList.add('indicator');
              // x.classList.add('bi-folder-plus');
              elm.insertBefore(x, elm.firstChild);
              if (index === 0) {
                el.classList.add('expand');
                const childNode = elm.childNodes[1];
                childNode.classList.add('tree-title');
              } else {
                el.classList.add('collapse');
              }

              elm.addEventListener(
                'click',
                function (event) {
                  if (elm === event.target || elm === event.target.parentNode) {
                    if (el.classList.contains('collapse')) {
                      el.classList.add('expand');
                      el.classList.remove('collapse');
                      const childNode = el.parentNode.childNodes[1];
                      childNode.classList.add('tree-title');
                      x.src = '../img/circle-minus.svg';
                    } else {
                      el.classList.add('collapse');
                      el.classList.remove('expand');
                      const childNode = el.parentNode.childNodes[1];
                      childNode.classList.remove('tree-title');
                      x.src = '../img/plus-circle.svg';
                    }
                  }
                },
                false
              );
            });
          result?.result.map((item, index) => {
            if (item.category_id === category[0].id) setInnerIndex(index);
          });
=======
        if (flag === false) {
          var tree = document.getElementById('tree1');
          if (tree) {
            console.log('tree---->', tree);
            tree
              .querySelectorAll('ul')
              .forEach(function (el, index, key, parent) {
                var elm = el.parentNode;
                elm.classList.add('branch');

                var x = document.createElement('img');
                x.src = '../img/plus-circle.svg';
                elm.insertBefore(x, elm.firstChild);
                if (index === 0) {
                  el.classList.add('expand');
                  const childNode = elm.childNodes[1];
                  childNode.classList.add('tree-title');
                } else {
                  el.classList.add('collapse');
                }

                elm.addEventListener(
                  'click',
                  function (event) {
                    if (
                      elm === event.target ||
                      elm === event.target.parentNode
                    ) {
                      if (el.classList.contains('collapse')) {
                        el.classList.add('expand');
                        el.classList.remove('collapse');
                        const childNode = el.parentNode.childNodes[1];
                        childNode.classList.add('tree-title');
                        x.src = '../img/circle-minus.svg';
                      } else {
                        el.classList.add('collapse');
                        el.classList.remove('expand');
                        const childNode = el.parentNode.childNodes[1];
                        childNode.classList.remove('tree-title');
                        x.src = '../img/plus-circle.svg';
                      }
                    }
                  },
                  false
                );
              });
            result?.result.map((item, index) => {
              if (item.category_id === category[0].id) setInnerIndex(index);
            });
          }
>>>>>>> Vaibhavi:src/pages/OperatingManual/view.jsx
        }
      })
      .catch((error) => console.log('error', error));
  };

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
                <Row>
                  <Col sm={4}>
                    <div className="tree_wrp">
                      <div className="tree_search_box">
                        <img src="../img/search-icon.svg" alt="" />
                        <Form.Control
                          type="text"
                          name="search"
                          className="tree_view_search"
                          placeholder="Search..."
<<<<<<< HEAD:src/pages/OperatingManual/view.jsx
                        />
                      </div>
                      <ul id="tree1" className="tree">
                        {category.map((item, index) => {
                          return (
                            <li
                              className="title_active"
                              onClick={() => {
                                setIndex(index);
                              }}
                            >
                              <a
                                href="#"
                                // className={Index === index ? 'tree-title' : ''}
                              >
=======
                          onChange={(e) => {
                            getOperatingManual('search', e.target.value, true);
                          }}
                        />
                      </div>
                      <ul id="tree1" className="tree">
                        {category.map((item, index) => {
                          return (
                            <li
                              className="title_active"
                              onClick={() => {
                                setIndex(index);
                              }}
                            >
                              <a href="#">
>>>>>>> Vaibhavi:src/pages/OperatingManual/view.jsx
                                <img src="../img/main_tree.svg" alt="" />
                                {item.category_name}
                              </a>
                              <ul>
                                {operatingManualdata.map(
                                  (inner_item, inner_index) => {
                                    return item.id ===
                                      inner_item.category_id ? (
                                      <li
                                        onClick={() => {
                                          setInnerIndex(inner_index);
                                        }}
                                      >
                                        <a
                                          className={
                                            innerIndex === inner_index
                                              ? 'tree_active'
                                              : ''
                                          }
                                        >
                                          <img
                                            src="../img/child_file.svg"
                                            alt=""
                                          />
                                          {inner_item.question}
                                        </a>
                                      </li>
                                    ) : null;
                                  }
                                )}
                              </ul>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </Col>
                  <Col xl={8}>
<<<<<<< HEAD:src/pages/OperatingManual/view.jsx
                      <div className='create_model_bar'>
                    <Button
                      onClick={() => {
                        navigate('/operatingmanual/add');
                      }}
                    >
                      <FontAwesomeIcon icon={faPlus} /> Create a Module
                    </Button>
                    <Button>
                      <FontAwesomeIcon icon={faPlus} /> Create a Sub - Module
                    </Button>
                    <div className="forms-toogle">
                      <div class="custom-menu-dots">
                        <Dropdown>
                          <Dropdown.Toggle id="dropdown-basic">
                            <FontAwesomeIcon icon={faEllipsisVertical} />
                          </Dropdown.Toggle>

                          <Dropdown.Menu>
                            <Dropdown.Item href="#/action-1">
                              <FontAwesomeIcon icon={faPen} /> Edit
                            </Dropdown.Item>
                            <Dropdown.Item href="#/action-2">
                              <FontAwesomeIcon icon={faRemove} /> Remove
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </div>
                    </div>
                    </div>
                    {operatingManualdata.map((item, index) => {
                      return index === innerIndex ? (
                        <>
                          <PdfComponent {...item} />
                          <iframe
                            width="560"
                            height="315"
                            src={item.media}
                          ></iframe>
=======
                    <div className="create_model_bar">
                      <Button
                        onClick={() => {
                          navigate('/operatingmanual/add');
                        }}
                      >
                        <FontAwesomeIcon icon={faPlus} /> Create a Module
                      </Button>
                      <Button>
                        <FontAwesomeIcon icon={faPlus} /> Create a Sub - Module
                      </Button>
                      <div className="forms-toogle">
                        <div class="custom-menu-dots">
                          <Dropdown>
                            <Dropdown.Toggle id="dropdown-basic">
                              <FontAwesomeIcon icon={faEllipsisVertical} />
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                              <Dropdown.Item href="#/action-1">
                                <FontAwesomeIcon icon={faPen} /> Edit
                              </Dropdown.Item>
                              <Dropdown.Item href="#/action-2">
                                <FontAwesomeIcon icon={faRemove} /> Remove
                              </Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>
                        </div>
                      </div>
                    </div>

                    {operatingManualdata.map((item, index) => {
                      return index === innerIndex ? (
                        <>
                          <div className="module_detail">
                            <div className="image_banner">
                              <img src="../img/demo_image.png" alt="" />
                            </div>
                            <p className="module_title">
                              {console.log(
                                'category.indexOf(operatingManualdata[innerIndex]?.category_id)---->',
                                category
                                  .map((object) => object.id)
                                  .indexOf(item.category_id)
                              )}
                              {console.log(
                                'operatingManualdata[innerIndex]?.category_id---->',
                                item.category_id
                              )}
                              {console.log('innerIndex---->', innerIndex)}
                              {console.log(
                                'operatingManualdata---->',
                                operatingManualdata
                              )}
                              <h3>
                                {
                                  category[
                                    category
                                      .map((object) => object.id)
                                      .indexOf(item.category_id)
                                  ]?.category_name
                                }
                              </h3>{' '}
                              <span>
                                <span className="module_dot"> • </span>
                                {item.question}
                              </span>{' '}
                            </p>
                          </div>
                          <PdfComponent {...item} />
                          <Row>
                            <Col sm={7}>
                              <div className="reference_wrp">
                                <h1>Reference Videos</h1>
                                <div className="reference_videos">
                                  <Button
                                    className="vidico"
                                    variant="transparent"
                                    onClick={() => {
                                      setVideoUrl(
                                        'https://player.vimeo.com/video/718118183?title=0&portrait=0&byline=0&autoplay=1&loop=1&transparent=1'
                                      );
                                      handleShow();
                                    }}
                                  >
                                    <img
                                      src={
                                        'https://i.vimeocdn.com/video/1446869688-ebc55555ef4671d3217b51fa6fea2d6a1c1010568f048e57a22966e13c2c4338-d_640x360.jpg'
                                      }
                                      alt=""
                                    />
                                  </Button>
                                  <div className="video_title">
                                    <h6>
                                      Computer Literacy - The growing reliance
                                      on technology and computers also in
                                      experiment.
                                    </h6>
                                  </div>
                                </div>
                              </div>
                            </Col>
                            <Col sm={5}>
                              <div className="related_files">
                                <h1>Related Files</h1>
                                <div className="forms-content">
                                  <div className="content-icon-section">
                                    <img src="../img/doc_blue.svg" />
                                  </div>
                                  <div className="content-title-section">
                                    <h6>document1.docx</h6>
                                    <h4>Added On : 05/12/2021</h4>
                                  </div>
                                </div>
                                <div className="forms-content">
                                  <div className="content-icon-section">
                                    <img src="../img/doc_pink.svg" />
                                  </div>
                                  <div className="content-title-section">
                                    <h6>document1.docx</h6>
                                    <h4>Added On : 05/12/2021</h4>
                                  </div>
                                </div>
                                <div className="forms-content">
                                  <div className="content-icon-section">
                                    <img src="../img/doc_blue.svg" />
                                  </div>
                                  <div className="content-title-section">
                                    <h6>document1.docx</h6>
                                    <h4>Added On : 05/12/2021</h4>
                                  </div>
                                </div>
                              </div>
                            </Col>
                          </Row>
>>>>>>> Vaibhavi:src/pages/OperatingManual/view.jsx
                        </>
                      ) : null;
                    })}
                  </Col>
                </Row>
              </div>
            </div>
          </Container>
        </section>
      </div>
<<<<<<< HEAD:src/pages/OperatingManual/view.jsx
=======
      
      <Modal size="lg" className="video-modal module_video_model" show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          {/* <h2>
            Computer Literacy - The growing reliance on technology and computers
            also in experiment.
          </h2> */}
        </Modal.Header>
        <Modal.Body>
          <div className="embed-responsive embed-responsive-16by9">
            <iframe
              width="1366"
              height="568"
              src={videoUrl}
              title="YouTube video player"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
            ></iframe>
          </div>
        </Modal.Body>
      </Modal>
      
>>>>>>> Vaibhavi:src/pages/OperatingManual/view.jsx
    </>
  );
};
export default OperatingManual;
