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
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../../components/App';
import LeftNavbar from '../../components/LeftNavbar';
import TopHeader from '../../components/TopHeader';
import PdfComponent from '../PrintPDF/PdfComponent';
import moment from 'moment';

const OperatingManual = () => {
  const navigate = useNavigate();
  const [Index, setIndex] = useState(0);
  const [innerIndex, setInnerIndex] = useState(0);
  const [operatingManualdata, setOperatingManualdata] = useState([]);
  const [show, setShow] = useState(false);
  let [videoUrl, setVideoUrl] = useState('');
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  useEffect(() => {
    getOperatingManual();
    console.log('role---->', localStorage.getItem('user_role'));
  }, []);

  useEffect(() => {
    var tree = document.getElementById('tree1');
    if (tree) {
      // console.log('tree---->', tree);
      tree.querySelectorAll('ul').forEach(function (el, index, key, parent) {
        var elm = el.parentNode;
        elm.classList.add('branch');
        var x = document.createElement('img');
        if (index === 0) {
          el.classList.add('expand');
          x.src = '../img/circle-minus.svg';
          const childNode = elm.childNodes[1];
          childNode.classList.add('tree-title');
        } else {
          x.src = '../img/plus-circle.svg';
          el.classList.add('collapse');
        }
        if (elm.firstChild.tagName !== x.tagName) {
          console.log('tagName', x.tagName, elm.firstChild.tagName);
          elm.insertBefore(x, elm.firstChild);
        }

        elm.addEventListener(
          'click',
          function (event) {
            if (elm === event.target || elm === event.target.parentNode) {
              if (el.classList.contains('collapse')) {
                console.log('el.classlist---->', el.classList);
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
    }
  }, [operatingManualdata]);
  const deleteOperatingManual = () => {
    var requestOptions = {
      method: 'DELETE',
      redirect: 'follow',
    };

    fetch(
      `${BASE_URL}/operating_manual/${operatingManualdata[Index]?.operating_manuals[innerIndex]?.id}`,
      requestOptions
    )
      .then((response) => response.text())
      .then((result) => {
        getOperatingManual();
      })
      .catch((error) => console.log('error', error));
  };
  const getOperatingManual = (key, search) => {
    var requestOptions = {
      method: 'GET',
      redirect: 'follow',
    };
    let api_url = '';

    if (key === 'search') {
      api_url = `${BASE_URL}/operating_manual?search=${search}&role=${localStorage.getItem(
        'user_role'
      )}`;
    } else {
      api_url = `${BASE_URL}/operating_manual?role=${localStorage.getItem(
        'user_role'
      )}`;
    }

    fetch(api_url, requestOptions)
      .then((response) => response.text())
      .then((result) => {
        result = JSON.parse(result);
        setOperatingManualdata(result.result);
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
                          onChange={(e) => {
                            getOperatingManual('search', e.target.value, true);
                          }}
                        />
                      </div>
                      <ul id="tree1" className="tree">
                        {operatingManualdata.map((item, index) => {
                          return (
                            <li className="title_active">
                              <a href="#">
                                <img src="../img/main_tree.svg" alt="" />
                                {item.category_name}
                              </a>
                              <ul>
                                {item?.operating_manuals.map(
                                  (inner_item, inner_index) => {
                                    return (
                                      <li
                                        onClick={() => {
                                          setIndex(index);
                                          setInnerIndex(inner_index);
                                        }}
                                      >
                                        <a
                                          className={
                                            index === Index &&
                                            innerIndex === inner_index
                                              ? 'tree_active'
                                              : ''
                                          }
                                        >
                                          <img
                                            src="../img/child_file.svg"
                                            alt=""
                                          />
                                          {inner_item.title}
                                        </a>
                                      </li>
                                    );
                                  }
                                )}
                              </ul>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </Col>
                  <Col sm={8}>
                    <div className="create_model_bar">
                      <Button
                        onClick={() => {
                          navigate('/operatingmanual/add');
                        }}
                      >
                        <FontAwesomeIcon icon={faPlus} /> Create an Operating
                        Manual
                      </Button>
                      <div className="forms-toogle">
                        <div class="custom-menu-dots">
                          <Dropdown>
                            <Dropdown.Toggle id="dropdown-basic">
                              <FontAwesomeIcon icon={faEllipsisVertical} />
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                              <Dropdown.Item
                                href=""
                                onClick={() => {
                                  navigate('/operatingmanual/add', {
                                    state: {
                                      id: operatingManualdata[Index]
                                        ?.operating_manuals[innerIndex]?.id,
                                      category_name:
                                        operatingManualdata[Index]
                                          ?.category_name,
                                    },
                                  });
                                }}
                              >
                                <FontAwesomeIcon icon={faPen} /> Edit
                              </Dropdown.Item>
                              <Dropdown.Item
                                href=""
                                onClick={() => {
                                  deleteOperatingManual();
                                }}
                              >
                                <FontAwesomeIcon icon={faRemove} /> Remove
                              </Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>
                        </div>
                      </div>
                    </div>
                    {operatingManualdata.map((item, index) => {
                      return index === Index
                        ? item?.operating_manuals.map(
                            (inner_item, inner_index) => {
                              {
                                inner_item.category =
                                  operatingManualdata[
                                    operatingManualdata
                                      .map((object) => object.id)
                                      .indexOf(inner_item.category_id)
                                  ]?.category_name;
                                inner_item.related_files = eval(
                                  inner_item.related_files
                                );
                              }
                              return inner_index === innerIndex ? (
                                <>
                                  {console.log('inner_item----->', inner_item)}
                                  {console.log('inner_item----->', inner_item)}
                                  <PdfComponent {...inner_item} />
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
                                                inner_item.reference_video
                                                  ? inner_item.reference_video
                                                  : 'https://player.vimeo.com/video/718118183?title=0&portrait=0&byline=0&autoplay=1&loop=1&transparent=1'
                                              );
                                              handleShow();
                                            }}
                                          >
                                            <img
                                              src={
                                                inner_item.video_thumbnail
                                                  ? inner_item.video_thumbnail
                                                  : 'https://i.vimeocdn.com/video/1446869688-ebc55555ef4671d3217b51fa6fea2d6a1c1010568f048e57a22966e13c2c4338-d_640x360.jpg'
                                              }
                                              alt=""
                                            />
                                          </Button>
                                          <div className="video_title">
                                            <h6>
                                              Computer Literacy - The growing
                                              reliance on technology and
                                              computers also in experiment.
                                            </h6>
                                          </div>
                                        </div>
                                      </div>
                                    </Col>
                                    {inner_item.related_files ? (
                                      <Col sm={5}>
                                        <div className="related_files">
                                          <h1>Related Files</h1>
                                          {inner_item.related_files.map(
                                            (file_item, file_index) => {
                                              return (
                                                <>
                                                  {console.log(
                                                    'file_item---->',
                                                    file_item
                                                  )}

                                                  <div className="forms-content">
                                                    <div className="content-icon-section">
                                                      <img
                                                        src={
                                                          (file_index + 1) %
                                                            2 ==
                                                          0
                                                            ? '../img/doc_pink.svg'
                                                            : '../img/doc_blue.svg'
                                                        }
                                                      />
                                                    </div>
                                                    <div className="content-title-section">
                                                      <h6>{file_item.name}</h6>
                                                      <h4>
                                                        Added On :
                                                        {moment(
                                                          inner_item.createdAt
                                                        ).format('MM/DD/YYYY')}
                                                      </h4>
                                                    </div>
                                                  </div>
                                                </>
                                              );
                                            }
                                          )}
                                        </div>
                                      </Col>
                                    ) : null}
                                  </Row>
                                </>
                              ) : null;
                            }
                          )
                        : null;
                    })}
                  </Col>
                </Row>
              </div>
            </div>
          </Container>
        </section>
      </div>

      <Modal
        size="lg"
        className="video-modal module_video_model"
        show={show}
        onHide={handleClose}
      >
        <Modal.Header closeButton>
          <h2>
            Computer Literacy - The growing reliance on technology and computers
            also in experiment.
          </h2>
        </Modal.Header>
        <Modal.Body>
          <div className="embed-responsive embed-responsive-16by9">
            <iframe
              width="1366"
              height="445"
              src={videoUrl}
              title="YouTube video player"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
            ></iframe>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};
export default OperatingManual;
