import React, { useEffect, useState } from 'react';
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
import { CSVDownload,CSVLink } from 'react-csv';

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
            
            name: `${dt.child_name} ,${dt.dob}`,
            dob: `${moment(dt.dob).format('DD/MM/YYYY')}`,
            //   franchise: `${dt.user.profile_photo},${dt.user.fullname},${dt.user.franchisee.franchisee_name} `,
            parentName: `${data[index]?.parents[0]?.user?.parent_name},${data[index]?.parents[1]?.user?.parent_name},${data[index]?.parents[2]?.user?.parent_name},${data[index]?.parents[0]?.user?.parent_profile_photo},${data[index]?.parents[1]?.user?.parent_profile_photo},${data[index]?.parents[2]?.user?.parent_profile_photo}`,
            educatorassisgned: `${data[index]?.users[0]?.educator_assigned}, ${data[index]?.users[0]?.educator_profile_photo},${data[index]?.users[1]?.educator_assigned}, ${data[index]?.users[1]?.educator_profile_photo}`,
            specailneed: `${dt?.has_special_needs}`,
            franchise: `${dt?.franchisee_id}`,
            enrolldate: `${dt?.enrollment_initiated}`,
            franchise: `${dt?.franchisee?.franchisee_name}`
          })
          )
          setChildEnroll(tempData)


          let temp = tempData;
          let csv_data = [];
          console.log("Temo new",tempData)
          temp.map((item, index) => {
    
            delete item.is_deleted;
            
            // delete item.user_id;
            
            csv_data.push(item);
            let data = { ...csv_data[index] };

            console.log("THE DATA",data)

            let d = data.parentName.split(",")
            let educator  = data.educatorassisgned.split(",");
            console.log()
            let educatorArray =[];

            let parent = [];
            d.map((item,index) => {
              if(item !="undefined" && item !="null"&& item.trim().split('.').pop() != "blob"){
                 parent[index] = item;
              }
            })

            educator.map((item,index) =>{
              
              if(item.trim() !="undefined" && item.trim() !="null" && item.trim().split('.').pop() !== "blob" &&item != ""){
                educatorArray[index] = item;
             }
            })
            // console.log("educatorArray[1]",educatorArray[1])
            let DOB =  moment(data.dob).format('DD/MM/YYYY')
            console.log("EDut",educatorArray[1])
         
            data["specailneed"]= data.specailneed == 0 ?"No":"Yes"; 
            data["enrolldate"] = moment(data.enrolldate).format('DD/MM/YYYY')
            data["parentName"] = parent
            data["educatorassisgned"]=educatorArray
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
                  <img src={cell[3] === "undefined" || cell[3] === "null" ? "../img/upload.jpg" : cell[3]} />
                </span>
                <span className="user-name">
                  {/* {cell[0] === "undefined" ? null : cell[0]} */}
                  {cell[0] === "undefined" ? null : cell[0][0].toUpperCase() + cell[0].slice(1)}

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
                  {cell[1] === "undefined" ? null : cell[1][0].toUpperCase() + cell[1].slice(1)} </span>
              </div>
            }
            {
              cell[2] != "undefined" &&
              <div className="user-list">
                <span className="user-pic">
                  <img src={cell[5] === "undefined" || cell[3] === "null" ? "../img/upload.jpg" : cell[5]} />
                </span>
                <span className="user-name">
                  {cell[2] === "undefined" ? null : cell[2][0].toUpperCase() + cell[2].slice(1)
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
          {
            cell[0] != "undefined" &&
            <div className="user-list">
              <span className="user-pic">
                {/* <img src={ cell[1] === "null"  ? "../img/upload.jpg" : cell[1]} /> */}
                <img src={cell[1] === "undefined" || cell[1].trim() === "null" ? "../img/upload.jpg" : cell[1]} />
              </span><span className="user-name">
                {cell[0][0].toUpperCase() + cell[0].slice(1)}
                {/* <span>{cell[1]}</span> */}
              </span>
            </div>
          }

          {
            cell[2] != "undefined" &&
            <div className="user-list">
              <span className="user-pic">
                <img src={cell[3] === "undefined" || cell[1].trim() === "null" ? "../img/upload.jpg" : cell[3]} />
              </span><span className="user-name">{
             
                cell[2][0].toUpperCase()+cell[2].slice(1)
              }
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

const CSV = () =>{
  return (
    <CSVLink
    data={csvData}
    filename={"my-file.csv"}
    className="btn btn-primary"
    target="_blank"
  >
    Download me
  </CSVLink>
  )
}
console.log("CSV",csvDownloadFlag)

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
console.log("CSV DATA",csvData)
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
                                  onClick={() => {
                                    setCsvDownloadFlag(true);
                                  }}
                                >
                                  
                                  <CSVLink
                                      data={csvData}
                                      filename={"Children Enroled.csv"}  
                                      // filename="dskak.csv"
                                      target="_blank"
                                      // ref={csvLink}
                                    >
                                      {/* {setCsvDownloadFlag(false)} */}
                                      {/* {setTimeout(() => {
                                        setCsvDownloadFlag(false)
                                      }, 1000)} */}
                                      {"Export CSV"}
                                      
                                      </CSVLink> 
                                    


                                
                                  
                                </Dropdown.Item>
                                {/* <Dropdown.Item onClick={() => { onDeleteAll() }}>
                                  Delete All Row
                                </Dropdown.Item> */}
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
