import React, { useEffect, useState } from 'react';
import { Container, Button, Dropdown, Form } from 'react-bootstrap';
import LeftNavbar from '../components/LeftNavbar';
import TopHeader from '../components/TopHeader';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import ToolkitProvider, { Search, CSVExport }  from 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit';

import axios from 'axios';
import { BASE_URL } from '../components/App';
import { useRef } from 'react';
import { FullLoader } from "../components/Loader";
import { CSVDownload, CSVLink } from 'react-csv';

import { useParams } from 'react-router-dom';
import moment from 'moment';
// const { ExportCSVButton } = CSVExport;

const ChildrenEnrol = () => {
  const Key = useParams()

  const [csvDownloadFlag, setCsvDownloadFlag] = useState(false);

  const [selectedFranchisee, setSelectedFranchisee] = useState(null);
  const [topSuccessMessage, setTopSuccessMessage] = useState();
  const [fullLoaderStatus, setfullLoaderStatus] = useState(true);
  const [chidlEnroll, setChildEnroll] = useState([])
  console.log("chidlEnroll", chidlEnroll)
  const [Filters, setFilters] = useState(null);
  const [AppyFilter, setApplyFilte] = useState();
  const [csvData, setCsvData] = useState([]);
  const [search,setSearch] = useState(" ")

  const { SearchBar } = Search;

  const handelApply = () => {
    setApplyFilte(Filters);
  }
  const ResteFilter = () => {
    setApplyFilte("")
    setFilters()
  }


  const ChildernEnrolled = async () => {
    try {
      let token = localStorage.getItem('token');
      let USER_ROLE = localStorage.getItem('user_role');
      let URL = USER_ROLE === "franchisor_admin" ? `${BASE_URL}/children-listing/all-childrens-enrolled/franchisee=${selectedFranchisee}/search=${search}` : `${BASE_URL}/children-listing/all-childrens-enrolled/search=${search}`
      let FilterUrl = AppyFilter === "0" || AppyFilter === "1" ? `${BASE_URL}/children-listing/all-childrens-enrolled/franchisee=${selectedFranchisee}/special-needs=${AppyFilter}/search=${search}` : URL;
      

      if (URL) {
        const response = await axios.get(FilterUrl, {
          headers: {
            "Authorization": "Bearer " + token
          }
        });
        if (response) {
          setfullLoaderStatus(false)
        }
        console.log("CHild Response",response.data)

        if (response.status === 200 && response.data.status === "success") {
          let data = response.data.childrenEnrolled;
           
          let tempData = data.map((dt, index) =>
          ({

            name: `${dt.fullname} ,${dt.dob}`,
            dob: `${moment(dt.dob).format('DD/MM/YYYY')}`,
            //   franchise: `${dt.user.profile_photo},${dt.user.fullname},${dt.user.franchisee.franchisee_name} `,
            parentName: `${data[index]?.parents[0]?.user?.fullname} , ${data[index]?.parents[1]?.user?.fullname},${data[index]?.parents[2]?.user?.fullname},${data[index]?.parents[3]?.user?.fullname},${data[index]?.parents[4]?.user?.fullname},${data[index]?.parents[5]?.user?.fullname},${data[index]?.parents[6]?.user?.fullname},${data[index]?.parents[7]?.user?.fullname},${data[index]?.parents[8]?.user?.fullname},${data[index]?.parents[9]?.user?.fullname},${data[index]?.parents[0]?.user?.parent_profile_photo},${data[index]?.parents[1]?.user?.parent_profile_photo},${data[index]?.parents[2]?.user?.parent_profile_photo},${data[index]?.parents[3]?.user?.parent_profile_photo},${data[index]?.parents[4]?.user?.parent_profile_photo},${data[index]?.parents[5]?.user?.parent_profile_photo},${data[index]?.parents[6]?.user?.parent_profile_photo},${data[index]?.parents[7]?.user?.parent_profile_photo},${data[index]?.parents[8]?.user?.parent_profile_photo},${data[index]?.parents[9]?.user?.parent_profile_photo}`,

            educatorassisgned: `${data[index]?.users[0]?.fullname}, ${data[index]?.users[1]?.fullname},${data[index]?.users[2]?.fullname},${data[index]?.users[3]?.fullname},${data[index]?.users[4]?.fullname},${data[index]?.users[5]?.fullname},${data[index]?.users[6]?.fullname},${data[index]?.users[7]?.fullname},${data[index]?.users[8]?.fullname},${data[index]?.users[9]?.fullname},${data[index]?.users[0]?.educator_profile_photo}, ${data[index]?.users[1]?.educator_profile_photo},${data[index]?.users[2]?.educator_profile_photo},${data[index]?.users[3]?.educator_profile_photo},${data[index]?.users[4]?.educator_profile_photo},${data[index]?.users[5]?.educator_profile_photo},${data[index]?.users[6]?.educator_profile_photo},${data[index]?.users[7]?.educator_profile_photo},${data[index]?.users[8]?.educator_profile_photo},${data[index]?.users[9]?.educator_profile_photo}`,                                
            specailneed: `${dt?.has_special_needs}`,
            franchise: `${dt?.franchisee_id}`,
            enrolldate: `${dt?.enrollment_initiated}`,
            franchise: `${dt?.franchisee?.franchisee_name}`
          })
          )
          setChildEnroll(tempData)


          let temp = tempData;
          let csv_data = [];
          temp.map((item, index) => {

            delete item.is_deleted;

            // delete item.user_id;

            csv_data.push(item);
            let data = { ...csv_data[index] };

            let d = data.parentName.split(",")
            let educator = data.educatorassisgned.split(",");

            let educatorArray = [];

            let parent = [];
            d.map((item, index) => {
              if (item.trim() != "undefined" && item.trim() != "null" && item.trim().split('.').pop() != "blob") {
                
                parent[index] = " "+item.trim();
                console.log("THe item  ",item)
              
              }
            })
            educator.map((item,index) =>{
              if (item.trim() !== "undefined" && item.trim() !== "null" && item.trim().split('.').pop() !== "blob" ) {
                educatorArray[index] = " "+item.trim();

              
              }


            })
              console.log("Educator 123",educatorArray)
            data["specailneed"] = data.specailneed == 0 ? "No" : "Yes";
            data["enrolldate"] = moment(data.enrolldate).format('DD/MM/YYYY')
            data["parentName"] = parent
            data["educatorassisgned"] = educatorArray
            data["name"] = data.name.split(",")[0];


            csv_data[index] = data;
          });
          setCsvData(csv_data);
        }
      }
    }
    catch (error) {
      setfullLoaderStatus(false)
      setChildEnroll([])

    }
  }

  useEffect(() => {
    if (selectedFranchisee) {
      ChildernEnrolled()
    }
  }, [selectedFranchisee, AppyFilter, Filters,search])
  const columns = [
    {
      dataField: 'name',
      text: 'Name',
      formatter: (cell) => {
        cell = cell.split(',');

        return (<>
          <div className="user-list">
            <span className="user-name">
              {/* {cell[0]}  */}
              {cell[0][0].toUpperCase() + cell[0].slice(1)}

              <small>
                {/* EnrolmentInitiated<br /> */}
                DOB: {moment(cell[1]).format('DD/MM/YYYY')}
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
          <div className="parentName" style={{ maxHeight: '100px', overflowY: "scroll" }}>
            {
              cell[0] != "undefined" &&
              <div className="user-list">
                <span className="user-pic">
                  <img src={cell[10].trim()  === "undefined" || cell[10].trim() === "null" ? "../img/upload.jpg" : cell[10]} />
                </span>
                <span className="user-name">
                  {/* {cell[0] === "undefined" ? null : cell[0]} */}
                  {cell[0] === "undefined" ? null : cell[0][0].toUpperCase() + cell[0].slice(1)}

                </span>
              </div>
            }
            {
              cell[1].trim() != "undefined" &&
              <div className="user-list">
                <span className="user-pic">
                  <img src={cell[11].trim() === "undefined" || cell[11].trim() === "null" ? "../img/upload.jpg" : cell[11]} />
                </span>
                <span className="user-name">
                  {cell[1] === "undefined" ? null : cell[1][0].toUpperCase() + cell[1].slice(1)} </span>
              </div>
            }
            {
              cell[2].trim() != "undefined" &&
              <div className="user-list">
                <span className="user-pic">
                  <img src={cell[12].trim() === "undefined" || cell[12].trim() === "null" ? "../img/upload.jpg" : cell[12]} />
                </span>
                <span className="user-name">
                  {cell[2] === "undefined" ? null : cell[2][0].toUpperCase() + cell[2].slice(1)
                  } </span>
              </div>
            }
            {
              cell[3].trim() != "undefined" &&
              <div className="user-list">
                <span className="user-pic">
                  <img src={cell[13].trim() === "undefined" || cell[13].trim() === "null" ? "../img/upload.jpg" : cell[13]} />
                </span>
                <span className="user-name">
                  {cell[3] === "undefined" ? null : cell[3][0].toUpperCase() + cell[3].slice(1)
                  } </span>
              </div>
            }

            {
              cell[4].trim() != "undefined" &&
              <div className="user-list">
                <span className="user-pic">
                  <img src={cell[14].trim() === "undefined" || cell[14].trim() === "null" ? "../img/upload.jpg" : cell[14]} />
                </span>
                <span className="user-name">
                  {cell[4] === "undefined" ? null : cell[4][0].toUpperCase() + cell[4].slice(1)
                  } </span>
              </div>
            }
           {
              cell[5].trim() != "undefined" &&
              <div className="user-list">
                <span className="user-pic">
                  <img src={cell[15].trim() === "undefined" || cell[15].trim() === "null" ? "../img/upload.jpg" : cell[15]} />
                </span>
                <span className="user-name">
                  {cell[5] === "undefined" ? null : cell[5][0].toUpperCase() + cell[5].slice(1)
                  } </span>
              </div>
            }
            {
              cell[6].trim() != "undefined" &&
              <div className="user-list">
                <span className="user-pic">
                  <img src={cell[16].trim() === "undefined" || cell[16].trim() === "null" ? "../img/upload.jpg" : cell[16]} />
                </span>
                <span className="user-name">
                  {cell[6] === "undefined" ? null : cell[6][0].toUpperCase() + cell[6].slice(1)
                  } </span>
              </div>
            }

            {
              cell[7].trim() != "undefined" &&
              <div className="user-list">
                <span className="user-pic">
                  <img src={cell[17].trim() === "undefined" || cell[17].trim() === "null" ? "../img/upload.jpg" : cell[17]} />
                </span>
                <span className="user-name">
                  {cell[7] === "undefined" ? null : cell[7][0].toUpperCase() + cell[7].slice(1)
                  } </span>
              </div>
            }

            {
              cell[8].trim() != "undefined" &&
              <div className="user-list">
                <span className="user-pic">
                  <img src={cell[18].trim() === "undefined" || cell[18].trim() === "null" ? "../img/upload.jpg" : cell[18]} />
                </span>
                <span className="user-name">
                  {cell[8] === "undefined" ? null : cell[8][0].toUpperCase() + cell[8].slice(1)
                  } </span>
              </div>
            }

          {
              cell[8].trim() != "undefined" &&
              <div className="user-list">
                <span className="user-pic">
                  <img src={cell[18].trim() === "undefined" || cell[18].trim() === "null" ? "../img/upload.jpg" : cell[18]} />
                </span>
                <span className="user-name">
                  {cell[8] === "undefined" ? null : cell[8][0].toUpperCase() + cell[8].slice(1)
                  } </span>
              </div>
            }
           {
              cell[9].trim() != "undefined" &&
              <div className="user-list">
                <span className="user-pic">
                  <img src={cell[19].trim() === "undefined" || cell[19].trim() === "null" ? "../img/upload.jpg" : cell[19]} />
                </span>
                <span className="user-name">
                  {cell[9] === "undefined" ? null : cell[9][0].toUpperCase() + cell[9].slice(1)
                  } </span>
              </div>
            }
          </div>
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
          <div className="parentName" style={{ maxHeight: '100px', overflowY: "scroll" }}>
            {
              cell[0].trim() != "undefined" &&
              <div className="user-list">
                <span className="user-pic">
                  {/* <img src={ cell[1] === "null"  ? "../img/upload.jpg" : cell[1]} /> */}
                  <img src={cell[10] === "undefined" || cell[10].trim() === "null" ? "../img/upload.jpg" : cell[10]} />
                </span><span className="user-name">
                  {cell[0][0].toUpperCase() + cell[0].slice(1)}
                  {/* <span>{cell[1]}</span> */}
                </span>
              </div>
            }
            {
              cell[1].trim() != "undefined" &&
              <div className="user-list">
                <span className="user-pic">
                  <img src={cell[11] === "undefined" || cell[11].trim() === "null" ? "../img/upload.jpg" : cell[11]} />
                </span><span className="user-name">{

                  cell[1][0].toUpperCase() + cell[1].slice(1)
                }
                </span>
              </div>
            }
              {
              cell[2].trim() != "undefined" &&
              <div className="user-list">
                <span className="user-pic">
                  <img src={cell[12].trim() === "undefined" || cell[12].trim() === "null" ? "../img/upload.jpg" : cell[12]} />
                </span><span className="user-name">{

                  cell[2][0].toUpperCase() + cell[2].slice(1)
                }
                </span>
              </div>
            }
           {
              cell[3].trim() != "undefined" &&
              <div className="user-list">
                <span className="user-pic">
                  <img src={cell[13].trim() === "undefined" || cell[13].trim() === "null" ? "../img/upload.jpg" : cell[13]} />
                </span><span className="user-name">{

                  cell[3][0].toUpperCase() + cell[3].slice(1)
                }
                </span>
              </div>
            }

            {
              cell[4].trim() != "undefined" &&
              <div className="user-list">
                <span className="user-pic">
                  <img src={cell[14].trim() === "undefined" || cell[14].trim() === "null" ? "../img/upload.jpg" : cell[14]} />
                </span><span className="user-name">{

                  cell[4][0].toUpperCase() + cell[4].slice(1)
                }
                </span>
              </div>
            }
            {
              cell[5].trim() != "undefined" &&
              <div className="user-list">
                <span className="user-pic">
                  <img src={cell[15].trim() === "undefined" || cell[15].trim() === "null" ? "../img/upload.jpg" : cell[15]} />
                </span><span className="user-name">{

                  cell[5][0].toUpperCase() + cell[5].slice(1)
                }
                </span>
              </div>
            }

            {
              cell[6].trim() != "undefined" &&
              <div className="user-list">
                <span className="user-pic">
                  <img src={cell[16].trim() === "undefined" || cell[16].trim() === "null" ? "../img/upload.jpg" : cell[16]} />
                </span><span className="user-name">{

                  cell[6][0].toUpperCase() + cell[6].slice(1)
                }
                </span>
              </div>
            }

          {
              cell[7].trim() != "undefined" &&
              <div className="user-list">
                <span className="user-pic">
                  <img src={cell[17].trim() === "undefined" || cell[17].trim() === "null" ? "../img/upload.jpg" : cell[17]} />
                </span><span className="user-name">{

                  cell[7][0].toUpperCase() + cell[7].slice(1)
                }
                </span>
              </div>
            }

        {
              cell[8].trim() != "undefined" &&
              <div className="user-list">
                <span className="user-pic">
                  <img src={cell[18].trim() === "undefined" || cell[18].trim() === "null" ? "../img/upload.jpg" : cell[18]} />
                </span><span className="user-name">{

                  cell[8][0].toUpperCase() + cell[8].slice(1)
                }
                </span>
              </div>
            }
            {
              cell[9].trim() != "undefined" &&
              <div className="user-list">
                <span className="user-pic">
                  <img src={cell[19].trim() === "undefined" || cell[19].trim() === "null" ? "../img/upload.jpg" : cell[19]} />
                </span><span className="user-name">{

                  cell[9][0].toUpperCase() + cell[9].slice(1)
                }
                </span>
              </div>
            }
            {/* {
              cell[18].trim() != "undefined" &&
              <div className="user-list">
                <span className="user-pic">
                  <img src={cell[19].trim() === "undefined" || cell[19].trim() === "null" ? "../img/upload.jpg" : cell[19]} />
                </span><span className="user-name">{

                  cell[18][0].toUpperCase() + cell[18].slice(1)
                }
                </span>
              </div>
            } */}
          </div>
        </>
        )
      },
    },
    {
      dataField: 'specailneed',
      text: 'Special Needs',
      formatter: (cell) => {

        return (<><div className="user-list"><span className="user-name">{cell === "1" ? "Yes" : <>
          {
            cell === "0" ? " No" :
              " "
          }
        </>}</span></div></>)
      },
    },
    // {
    //   dataField: 'DBO',
    //   text: 'Date Of Birth',
    // },
    {
      dataField: 'enrolldate',
      text: 'Enrolment Initiated ',
      formatter: (cell) => {
        return (<><div className="user-list">
          <span className="user-name">
            {moment(cell).format('DD/MM/YYYY')} </span>
        </div>
        </>)
      },
    },
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
  const headers = [
    { label: "NAME", key: "name" },
    { label: "DOB", key: "dob" },
    { label: "PARENT NAME", key: "parentName" },
    { label: "EDUCATOR ASSIGNED", key: "educatorassisgned" },
    { label: "SPECIAL NEEDS", key: "specailneed" },
    { label: "FRANCHISE", key: "franchise" },
    { label: "ENROLMENT INITIATION DATE", key: "enrolldate" }


  ];


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
                  
                  
                  
                  exportCSV={ {
                    fileName: 'Children Enroled.csv',
                  
                  } }
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
                              <Form.Group
                                className="d-flex"
                                style={{ position: 'relative' }}
                              >
                                <div className="user-search">
                                  <img
                                    src="./img/search-icon-light.svg"
                                    alt=""
                                  />
                                </div>
                                <Form.Control
                                  className="searchBox"
                                  type="text"
                                  placeholder="Search"
                                  name="search"
                                  onChange={(e) => {

                                    //   setSearch(e.target.value, () => {
                                    //     onFilter();
                                    //  });
                                    setSearch(e.target.value);
                                    // onFilter(e.target.value);


                                  }}
                                />
                              </Form.Group>
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
                                        <label>Special Needs:</label>
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

                                        </Form.Group>
                                      </div>

                                      <footer>
                                        <Button
                                          variant="transparent"
                                          type="submit"
                                          onClick={ResteFilter}
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

                                  {/* {localStorage.getItem("user_role") === "franchisor_admin" ? ( */}
                                    <Dropdown>

                                      <Dropdown.Toggle
                                        id="extrabtn"
                                        className="ctaact"
                                      >
                                        <img src="../img/dot-ico.svg" alt="" />
                                      </Dropdown.Toggle>


                                      <Dropdown.Menu>
                                        <Dropdown.Item
                                          as="button"
                                        >
                                          <CSVLink
                                            data={csvData}
                                            filename={"Children Enroled.csv"}
                                            headers={headers}
                                            target="_blank"
                                          >

                                            {"Export CSV"}

                                          </CSVLink>
                                        </Dropdown.Item>


                                        {/* <Dropdown.Item onClick={() => { onDeleteAll() }}>
                            Delete All Row
                          </Dropdown.Item> */}
                                      </Dropdown.Menu>
                                    </Dropdown>
                                  {/* ) : (null)} */}

                                </div>
                              </div>
                            </header>
                          </>
                          {
                            chidlEnroll?.length > 0 ?
                              (
                                <div>
                                  <BootstrapTable
                                  {...props.baseProps}
                                  pagination={paginationFactory()}
                                />
                                  </div>
                              ) : (
                                !fullLoaderStatus &&
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
