import React, { useEffect, useState, } from 'react';
import {
  Button,
  Container,
  Dropdown,
  DropdownButton,
  Form,
} from 'react-bootstrap';
import LeftNavbar from '../components/LeftNavbar';
import TopHeader from '../components/TopHeader';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import Select from 'react-select';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit';
import makeAnimated from 'react-select/animated';
import axios from 'axios';
import { BASE_URL } from '../components/App';
import { CSVDownload } from 'react-csv';
import { useRef } from 'react';
import { debounce } from 'lodash';
import { useNavigate } from 'react-router-dom';
import { verifyPermission } from '../helpers/roleBasedAccess';
import { FullLoader } from "../components/Loader";
import { useParams } from 'react-router-dom';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import moment from 'moment';
// const { ExportCSVButton } = CSVExport;



const ChildrenEnrol = () => {
  const Key = useParams()
  console.log('Key+++++++++', Key.key)
  const navigate = useNavigate();
  const [userData, setUserData] = useState([]);
  const [userEducator, setEducator] = useState([]);
  const [selectedFranchisee, setSelectedFranchisee] = useState(null);
  const [csvDownloadFlag, setCsvDownloadFlag] = useState(false);
  const [csvData, setCsvData] = useState([]);
  const [topSuccessMessage, setTopSuccessMessage] = useState();
  const [filter, setFilter] = useState(null);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true)
  const [datad, setDatad] = useState([])

  const [deleteResponse, setDeleteResponse] = useState(null);
  const [fullLoaderStatus, setfullLoaderStatus] = useState(true);
  const [chidlEnroll, setChildEnroll] = useState([])
  const { SearchBar } = Search;





  const ChildernEnrolled = async () => {
    try {
      let token = localStorage.getItem('token');
      // let token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/children-listing/all-childrens-enrolled`, {
        headers: {
          "Authorization": "Bearer " + token
        }
      });
      console.log("response cdsada", response)
      if (response.status === 200 && response.data.status === "success") {
        let data = response.data.childrenEnrolled;
        // setChildEnroll(response.data.childrenEnrolled)
        // data.map((dt,index) =>{
        //     console.log("dt",dt.parents[index].user.parent_name)
        // })
        console.log("Franchise name", data[0]?.franchisee.franchisee_name)
        let tempData = data.map((dt, index) =>

        ({
          name: `${dt.child_name}`,
          //   franchise: `${dt.user.profile_photo},${dt.user.fullname},${dt.user.franchisee.franchisee_name} `,
          parentName: `${data[index]?.parents[0]?.user?.parent_name},${data[index]?.parents[1]?.user?.parent_name},${data[index]?.parents[2]?.user?.parent_name},${data[index]?.parents[0]?.user?.parent_profile_photo},${data[index]?.parents[1]?.user?.parent_profile_photo},${data[index]?.parents[2]?.user?.parent_profile_photo}`,
          educatorassisgned: `${data[index]?.users[0]?.educator_assigned}, ${data[index]?.users[0]?.educator_profile_photo},${data[index]?.users[1]?.educator_assigned}, ${data[index]?.users[1]?.educator_profile_photo}`,
          specailneed: `${dt?.child_medical_information?.has_special_needs}`,
          franchise: `${dt?.franchisee_id}`,
          enrolldate: `${dt?.enrollment_initiated}`,
          franchise: `${dt?.franchisee?.franchisee_name}`
        })

        )
        console.log("TEMPDATA", tempData)
        setChildEnroll(tempData)
      }
    }
    catch (error) {
      console.log("ERROR child enroll", error)
    }
  }




  const columns1 = [
    {
      dataField: 'name',
      text: 'Name',
      // filter: textFilter(),
      // formatter: (cell) => {
      //   console.log("name cell", cell)
      //   return (<><div className="user-list"><span className="user-name">{cell}</span></div></>)
      // },
    },
    {
      dataField: 'parentName',
      text: 'Parent Name',
      formatter: (cell) => {

        cell = cell.split(',');
        console.log("Cell image", cell[3])

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
      dataField: 'enrolldate',
      text: 'Enrolment Initiated ',
      formatter: (cell) => {
        console.log("frnahise CELL", cell)
        // cell = cell.split(",");
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
        console.log("frnahise CELL", cell)
        // cell = cell.split(",");
        return (<>
          <div className="user-list"><span className="user-name">{cell === "undefined" || cell === "null" ? " " : cell} </span></div></>)
      },
    },
  ];



  const onFilter = debounce(() => {
    fetchUserDetails();
  }, 200);

  const getData = () => {
    axios("https://jsonplaceholder.typicode.com/comments").then((res) => {
      console.log("dumby", res.data)
      setDatad(res.data)
    }

    )
  }
  const columnsee = [{
    dataField: "id",
    text: "Product Id",

  },
  {
    dataField: "email",
    text: "Email"
  }
  ]


  const fetchUserDetails = async () => {
    let api_url = '';
    let id = localStorage.getItem('user_role') === 'guardian' ? localStorage.getItem('franchisee_id') : selectedFranchisee;

    if (search) {
      api_url = `${BASE_URL}/role/user/${id}?search=${search}`;
    }
    if (filter) {
      api_url = `${BASE_URL}/role/user/${id}?filter=${filter}`;
    }
    if (search && filter) {
      api_url = `${BASE_URL}/role/user/${id}?search=${search}&filter=${filter}`;
    }

    if (!search && !filter) {
      api_url = `${BASE_URL}/role/user/${id}`;
    }

    let response = await axios.get(api_url, {
      headers: {
        authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (response) {
      setfullLoaderStatus(false)
    }
    if (response.status === 200) {

      const { users } = response.data;
      console.log('USERS:', users);
      let tempData = users.map((dt) => ({
        name: `${dt.profile_photo}, ${dt.fullname}, ${dt.role
          .split('_')
          .map((d) => d.charAt(0).toUpperCase() + d.slice(1))
          .join(' ')}, ${dt.is_active}`,
        email: dt.email,
        number: (dt.phone !== null ? dt.phone.slice(1) : null),
        location: dt.city,
        role: dt.role,
        is_deleted: dt.is_deleted,
        role: dt.role,
        userID: dt.id,
        roleDetail: dt.role + "," + dt.isChildEnrolled + "," + dt.franchisee_id + "," + dt.id,
        action: dt.is_active
      }));
      console.log('TEMP =>>>>>>>>>>>>>>>>>', tempData);
      // tempData = tempData.filter((data) => data.is_deleted === 0);
      // console.log('Temp Data:', tempData);
      if (localStorage.getItem('user_role') === 'guardian') {
        tempData = tempData.filter(d => parseInt(d.userID) === parseInt(localStorage.getItem('user_id')));
      }

      if (localStorage.getItem('user_role') === 'coordinator' || localStorage.getItem('user_role') === 'educator') {
        tempData = tempData.filter(d => d.action === 1);
      }

      setUserDataAfterFilter(tempData);
      setIsLoading(false)

      let temp = tempData;
      let csv_data = [];
      temp.map((item, index) => {
        // item['Name'] = item['name'];
        // item['Email'] = item['email'];
        // item['Phone Number'] = item['number'];
        // item['Location'] = item['location'];
        // delete item['name'];
        // delete item['email'];
        // delete item['number'];
        // delete item['location'];

        delete item.is_deleted;
        // delete item.user_id;
        csv_data.push(item);
        let data = { ...csv_data[index] };
        data["name"] = data.name.split(",")[1];
        csv_data[index] = data;
      });
      setCsvData(csv_data);
    }
  };

  const setUserDataAfterFilter = data => {
    console.log('DATA:', data);
    let role = localStorage.getItem('user_role');
    let filteredData = null;

    if (role === 'franchisor_admin') {
      filteredData = data.filter(d => d.role !== 'franchisor_admin');
    }

    if (role === 'franchisee_admin') {
      filteredData = data.filter(d => d.role !== 'franchisor_admin')
      filteredData = filteredData.filter(d => d.role !== 'franchisee_admin')

    }

    if (role === 'coordinator') {
      filteredData = data.filter(d => d.role === 'educator' || d.role === 'guardian');
      console.log('COORDINATOR:', filteredData);
    }

    if (role === 'educator') {
      filteredData = data.filter(d => d.role === 'guardian');
    }

    setUserData(filteredData);
  };



  const handleApplyFilter = async () => {
    fetchUserDetails();
  }


  const Show_eduactor = async () => {
    let api_url = '';
    // let id = localStorage.getItem('user_role') === 'guardian' ? localStorage.getItem('franchisee_id') : selectedFranchisee;
    let filter = Key.key
    // console.log(alert(filter))
    if (filter) {
      api_url = `${BASE_URL}/role/user/All?filter=${filter}`;
    }

    let response = await axios.get(api_url, {
      headers: {
        authorization: `Bearer ${localStorage.getItem('token')} `,
      },
    });


    if (response.status === 200) {
      const { users } = response.data;
      console.log('USERS =>>>>>>>>>>>>>>>>>>:', users);
      let tempData = users.map((dt) => ({
        name: `${dt.profile_photo}, ${dt.fullname}, ${dt.role
          .split('_')
          .map((d) => d.charAt(0).toUpperCase() + d.slice(1))
          .join(' ')
          }, ${dt.is_active} `,
        email: dt.email,
        number: (dt.phone !== null ? dt.phone.slice(1) : null),
        location: dt.city,
        is_deleted: dt.is_deleted,
        userID: dt.id,
        role: dt.role,
        roleDetail: dt.role + "," + dt.isChildEnrolled + "," + dt.franchisee_id + "," + dt.id,
        action: dt.is_active
      }));

      if (localStorage.getItem('user_role') === 'guardian') {
        tempData = tempData.filter(d => parseInt(d.userID) === parseInt(localStorage.getItem('user_id')));
      }

      if (localStorage.getItem('user_role') === 'coordinator' || localStorage.getItem('user_role') === 'educator') {
        tempData = tempData.filter(d => d.action === 1);
      }
      setEducator(tempData);
      setIsLoading(false)




      let temp = tempData;
      let csv_data = [];
      temp.map((item, index) => {
        delete item.is_deleted;
        csv_data.push(item);
        let data = { ...csv_data[index] };
        data["name"] = data.name.split(",")[1];
        csv_data[index] = data;
      });
      setCsvData(csv_data);
    }
  }
  const columns = [
    { dataField: 'id', text: 'Id' },
    { dataField: 'name', text: 'Name' },
    { dataField: 'animal', text: 'Animal' },
  ]


  useEffect(() => {
    Show_eduactor()
    ChildernEnrolled()
    getData()
  }, [])


  useEffect(() => {
    if (selectedFranchisee) {
      fetchUserDetails();
    }
  }, [selectedFranchisee]);

  useEffect(() => {
    if (deleteResponse !== null)
      fetchUserDetails();
  }, [deleteResponse]);

  useEffect(() => {
    if (filter === "")
      fetchUserDetails();
  }, [filter]);

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


  userData && console.log('USER DATA:', userData.map(data => data));
  userEducator && console.log('userEducator DATA:', userEducator.map(data => data))
  selectedFranchisee && console.log('Selected Franchisee:', selectedFranchisee);
  console.log("Child enorrled", chidlEnroll)
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


                          </div>
                        </div>
                      </header>


                    </>

                    {
                      chidlEnroll?.length > 0 ?
                        (
                          <BootstrapTable
                            keyField="name"
                            data={chidlEnroll}
                            columns={columns1}
                            pagination={paginationFactory()}
                            // filter={filterFactory()}
                          />
                        ) : (
                          <div className="text-center mb-5 mt-5"><strong>
                            No forms present!
                          </strong></div>

                        )
                    }


                    {/* {
                      chidlEnroll?.length > 0 ?
                        <ToolkitProvider
                        bootstrap4
                        keyField="name"
                          data={chidlEnroll}
                          columns={columns1}
                          search
                        >
                          {(props) => (

                            <>

                              <BootstrapTable
                                {...props.baseProps}
                              // filter ={filterFactory()}
                              filter={filterFactory()} 
                              noDataIndication="There is no solution"

                                // rowEvents={rowEvents}
                              


                                // selectRow={selectRow}
                                pagination={paginationFactory()}
                              />
                            </>
                          )}
                        </ToolkitProvider>
                        : (
                          <div className="text-center mb-5 mt-5"><strong>
                            No Child enrol Yet!
                          </strong></div>

                        )
                    } */}


                  </div>
                </div>
              </div>
            </div>
          </Container>
        </section>
      </div>
    </>
  );
};

export default ChildrenEnrol;
