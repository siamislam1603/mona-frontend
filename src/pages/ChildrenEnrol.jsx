import React, { useEffect, useState, } from 'react';
import { Container, Button, Dropdown, Form } from 'react-bootstrap';
import LeftNavbar from '../components/LeftNavbar';
import TopHeader from '../components/TopHeader';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit';
import axios from 'axios';
import { BASE_URL } from '../components/App';
import { useRef } from 'react';
import { FullLoader } from "../components/Loader";
import { useParams } from 'react-router-dom';
import moment from 'moment';
// const { ExportCSVButton } = CSVExport;

const ChildrenEnrol = () => {
  const Key = useParams()

  const [userEducator, setEducator] = useState([]);
  const [selectedFranchisee, setSelectedFranchisee] = useState(null);
  const [topSuccessMessage, setTopSuccessMessage] = useState();
  const [filter, setFilter] = useState(null);
  const [isLoading, setIsLoading] = useState(true)
  const [fullLoaderStatus, setfullLoaderStatus] = useState(true);
  const [chidlEnroll, setChildEnroll] = useState([])
  const [Filters, setFilters] = useState();
  const [AppyFilter, setApplyFilte] = useState();
  const { SearchBar } = Search;

  const handelApply = () => {
    setApplyFilte(Filters);
  }
  console.log(typeof AppyFilter, "AppyFilter")

  const ChildernEnrolled = async () => {
    try {
      let token = localStorage.getItem('token');
      let USER_ROLE = localStorage.getItem('user_role');
      let URL = USER_ROLE === "franchisor_admin" ? `${BASE_URL}/children-listing/all-childrens-enrolled/franchisee=${selectedFranchisee}` : `${BASE_URL}/children-listing/all-childrens-enrolled`
      let FilterUrl = AppyFilter === "0" || AppyFilter === "1" ? `${BASE_URL}/children-listing/all-childrens-enrolled/franchisee=${selectedFranchisee}/special-needs=${AppyFilter}` : URL;
      if (URL) {
        const response = await axios.get(FilterUrl, {
          headers: {
            "Authorization": "Bearer " + token
          }
        });
        if (response) {
          setfullLoaderStatus(false)
        }
        if (response.status === 200 && response.data.status === "success") {
          let data = response.data.childrenEnrolled;

          let tempData = data.map((dt, index) =>

          ({
            name: `${dt.child_name} ,${dt?.enrollment_initiated}`,
            DBO: `${dt.dob}`,
            //   franchise: `${dt.user.profile_photo},${dt.user.fullname},${dt.user.franchisee.franchisee_name} `,
            parentName: `${data[index]?.parents[0]?.user?.parent_name},${data[index]?.parents[1]?.user?.parent_name},${data[index]?.parents[2]?.user?.parent_name},${data[index]?.parents[0]?.user?.parent_profile_photo},${data[index]?.parents[1]?.user?.parent_profile_photo},${data[index]?.parents[2]?.user?.parent_profile_photo}`,
            educatorassisgned: `${data[index]?.users[0]?.educator_assigned}, ${data[index]?.users[0]?.educator_profile_photo},${data[index]?.users[1]?.educator_assigned}, ${data[index]?.users[1]?.educator_profile_photo}`,
            specailneed: `${dt?.child_medical_information?.has_special_needs}`,
            franchise: `${dt?.franchisee_id}`,
            franchise: `${dt?.franchisee?.franchisee_name}`
          })

          )
          setChildEnroll(tempData)
        }
      }
    }
    catch (error) {
      setfullLoaderStatus(false)
      console.log("ERROR child enroll", error)
    }
  }
  useEffect(() => {
    ChildernEnrolled()
  }, [selectedFranchisee, AppyFilter, Filters])
  const columns = [
    {
      dataField: 'name',
      text: 'Name',
      formatter: (cell) => {
        cell = cell.split(',');
        return (<>
          <div className="user-list">
            <span className="user-name">
              {cell[0]}
              <small>
                {/* EnrolmentInitiated<br /> */}
                {moment(cell[1]).format('DD/MM/YYYY')}
              </small>
            </span>
          </div>
        </>)
      }
    },

    {
      dataField: 'parentName',
      text: 'Parent Name',
      formatter: (cell) => {

        cell = cell.split(',');

        return (<>
          {
            cell[0] != "undefined" &&
            <div className="user-list">
              <span className="user-pic">
                <img src={cell[3] === "undefined" || cell[3] === "null" ? "../img/upload.jpg" : cell[3]} />
              </span>
              <span className="user-name">
                {cell[0] === "undefined" ? null : cell[0]}
              </span>
            </div>
          }

          {
            cell[1] != "undefined" &&
            <div className="user-list">
              <span className="user-pic">
                <img src={cell[4] === "undefined" || cell[3] === "null" ? "../img/upload.jpg" : cell[4]} />
              </span>
              <span className="user-name">
                {cell[1] === "undefined" ? null : cell[1]
                } </span>
            </div>
          }
          {
            cell[2] != "undefined" &&
            <div className="user-list">
              <span className="user-pic">
                <img src={cell[5] === "undefined" || cell[3] === "null" ? "../img/upload.jpg" : cell[5]} />
              </span>
              <span className="user-name">
                {cell[2] === "undefined" ? null : cell[2]
                } </span>
            </div>
          }
          {/* <small>Audited on : {moment(cell[3]).format('DD/MM/YYYY')}  </small> */}
        </>

        )
      },
    },
    {
      dataField: 'educatorassisgned',
      text: 'Educator Assigned',

      formatter: (cell) => {
        cell = cell.split(',');
        return (<>
          {
            cell[0] != "undefined" &&
            <div className="user-list">
              <span className="user-pic">
                {/* <img src={ cell[1] === "null"  ? "../img/upload.jpg" : cell[1]} /> */}

                <img src={cell[1] === "undefined" || cell[1].trim() === "null" ? "../img/upload.jpg" : cell[1]} />

              </span><span className="user-name">{cell[0]}
                {/* <span>{cell[1]}</span> */}
              </span>
            </div>
          }

          {
            cell[2] != "undefined" &&
            <div className="user-list">
              <span className="user-pic">
                <img src={cell[3] === "undefined" || cell[1].trim() === "null" ? "../img/upload.jpg" : cell[3]} />
              </span><span className="user-name">{cell[2]}
              </span>
            </div>
          }
        </>
        )
      },
    },
    {
      dataField: 'specailneed',
      text: 'Special Need',
      formatter: (cell) => {
        return (<><div className="user-list"><span className="user-name">{cell === "true" ? "Yes" : <>
          {
            cell === "false" ? " No" :
              " "
          }
        </>}</span></div></>)
      },
    },
    {
      dataField: 'DBO',
      text: 'Date Of Birth',
    },
    // {
    //   dataField: 'enrolldate',
    //   text: 'Enrolment Initiated ',
    //   formatter: (cell) => {
    //     return (<><div className="user-list">
    //       <span className="user-name">
    //         {moment(cell).format('DD/MM/YYYY')} </span>
    //     </div>
    //     </>)
    //   },
    // },
    {
      dataField: 'franchise',
      text: 'Franchise ',
      formatter: (cell) => {
        // cell = cell.split(",");
        return (<>
          <div className="user-list"><span className="user-name">{cell === "undefined" || cell === "null" ? " " : cell} </span></div></>)
      },
    },
  ];



  useEffect(() => {
    if (localStorage.getItem('success_msg')) {
      setTopSuccessMessage(localStorage.getItem('success_msg'));
      localStorage.removeItem('success_msg');
      setTimeout(() => {
        setTopSuccessMessage(null);
      }, 3000);
    }
  }, []);

  const csvLink = useRef();
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
                <TopHeader
                  setSelectedFranchisee={setSelectedFranchisee}
                />
                <FullLoader loading={fullLoaderStatus} />
                <ToolkitProvider
                  keyField="name"
                  data={chidlEnroll}
                  columns={columns}
                  search
                >
                  {(props) => (
                    <>
                      <div className="entry-container">
                        <div className="user-management-sec childenrol-table">
                          <>
                            {
                              topSuccessMessage && <p className="alert alert-success" style={{ position: "fixed", left: "50%", top: "0%", zIndex: 1000 }}>{topSuccessMessage}</p>
                            }
                            <header className="title-head">
                              <h1 className="title-lg">Children Enroled</h1>
                              <div className="othpanel">
                                <div className="extra-btn">
                                  <div className="data-search me-3">
                                    <SearchBar {...props.searchProps} />
                                  </div>
                                  <Dropdown className="filtercol me-3">
                                    <Dropdown.Toggle
                                      id="extrabtn"
                                      variant="btn-outline"
                                    >
                                      <i className="filter-ico"></i> Add Filters
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                      <header>Filter by:</header>

                                      <div className="custom-radio btn-radio mb-2">
                                        <label>Special Need:</label>
                                        <Form.Group inline>

                                          <Form.Check
                                            inline
                                            label="Yes"
                                            value="1"
                                            name="users"
                                            type="radio"
                                            id="yes-1"
                                            checked={Filters === "1"}
                                            onChange={(event) => {
                                              setFilters("1")
                                            }}
                                          />
                                          <Form.Check
                                            inline
                                            label="No"
                                            value="0"
                                            name="users"
                                            type="radio"
                                            id="No-0"
                                            checked={Filters === "0"}
                                            onChange={(event) => {
                                              setFilters("0")
                                            }}
                                          />
                                          {console.log(Filters)}
                                        </Form.Group>
                                      </div>

                                      <footer>
                                        <Button
                                          variant="transparent"
                                          type="submit"
                                          onClick={() => { setFilter(''); }}
                                        >
                                          Reset
                                        </Button>
                                        <Button
                                          variant="primary"
                                          type="submit"
                                          onClick={handelApply}
                                        >
                                          Apply
                                        </Button>
                                      </footer>
                                    </Dropdown.Menu>
                                  </Dropdown>
                                </div>
                              </div>
                            </header>
                          </>
                          {
                            chidlEnroll?.length > 0 ?
                              (
                                <BootstrapTable
                                  {...props.baseProps}
                                  pagination={paginationFactory()}
                                />
                              ) : (
                                <div className="text-center mb-5 mt-5"><strong>
                                  No child enrol yet
                                </strong></div>

                              )
                          }
                        </div>
                      </div>
                    </>
                  )}
                </ToolkitProvider>
              </div>
            </div>
          </Container>
        </section>
      </div>
    </>
  );
};

export default ChildrenEnrol;
