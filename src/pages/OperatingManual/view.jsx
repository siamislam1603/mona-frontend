import { faEllipsisVertical, faPen, faPlus, faRemove } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import { Button, Col, Container, Dropdown, Form, Row } from 'react-bootstrap';
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
        getOperatingManual('category', result?.result[0]?.category_name);
        setCategory(result.result);
      })
      .catch((error) => console.log('error', error));
  };
  const getOperatingManual = (key, defaultTab) => {
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
    </>
  );
};
export default OperatingManual;
