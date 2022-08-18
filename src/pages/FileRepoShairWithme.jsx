import React, { useState, useEffect } from 'react'
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import axios from "axios";
import { Link } from 'react-router-dom';
import { BASE_URL } from '../components/App';
import {
  Button,
  Container,
  Dropdown,
  Form,
  Modal,
  Row,
  Col,
} from 'react-bootstrap';
import ToolkitProvider, {
  Search,
  CSVExport,
} from 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit';


const selectRow = {
  mode: 'checkbox',
  clickToSelect: true,
};
const FileRepoShairWithme = () => {
  const [userData, setUserData] = useState([]);
  userData && console.log('USER DATA:', userData.map(data => data));

  const GetData = async () => {
    let response = await axios.get(`${BASE_URL}/fileRepo/`, {
      headers: {
        authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })

    console.log(response, "+++++++++++++++++++++", "response")
    if (response.status === 200) {
      const users = response.data.dataDetails;
      console.log(users, "successsuccesssuccesssuccesssuccess")
      let tempData = users.map((dt) => ({
        name: `${dt.categoryId}, ${dt.count}`,
        createdAt: dt.updatedAt,
        userID: dt.id,
        creatorName: dt.ModifierName + "," + dt.updatedBy
      }));
      // tempData = tempData.filter((data) => data.is_deleted === 0);
      console.log("eeeeeeeeeeeeeeeeeeeeeeeeeee", tempData)
      setUserData(tempData);
      let temp = tempData;
    }
  }
  const [columns, setColumns] = useState([
    {
      dataField: 'name',
      text: 'Name',
      sort: true,
      formatter: (cell) => {
        cell = cell.split(',');
        return (
          <>

            <div className="user-list">
              <Link to={`/file-repository-List/${cell[0]}`} className="FileResp">
                <span>
                  <img src="../img/gfolder-ico.png" className="me-2" alt="" />
                </span>
              </Link>
              <span className="user-name">
                {cell[0] === "1" ? "Daily Use" :
                  cell[0] === "2" ? "Business Management" :
                    cell[0] === "3" ? "Employment" :
                      cell[0] === "4" ? "Compliance" :
                        cell[0] === "5" ? "Care Giving" :
                          cell[0] === "6" ? "Curriculum & Planning" :
                            cell[0] === "7" ? "Resources" :
                              cell[0] === "8" ? "General" : "Null"
                }
                <small>{cell[1]} Files</small>
              </span>

            </div>

          </>
        );
      },
    },
    {
      dataField: 'createdAt',
      text: 'Created on',
      sort: true,
    },
    {
      dataField: 'creatorName',
      text: 'Created by',
      sort: true,
      formatter: (cell) => {
        cell = cell.split(',');
        return (
          <>
            <div className="user-list">
              <span className="user-name">
                {cell[0]}
                <small>{cell[1]}</small>
              </span>
            </div>
          </>
        );
      }
    },
    {
      dataField: 'repository_files',
      text: '',
      // formatter: (cell) => {
      //   return (
      //     <>
      //       <div className="cta-col">
      //         <Dropdown>
      //           <Dropdown.Toggle variant="transparent" id="ctacol">
      //             <img src="../img/dot-ico.svg" alt="" />
      //           </Dropdown.Toggle>
      //           <Dropdown.Menu>
      //             <Dropdown.Item href="#">Delete</Dropdown.Item>
      //           </Dropdown.Menu>
      //         </Dropdown>
      //       </div>
      //     </>
      //   );
      // },
    },
  ]);
  useEffect(() => {
    GetData();
    // getUserRoleAndFranchiseeData();
    // getMyAddedFileRepoData();
    // getFilesSharedWithMeData();
    // getFileCategory();
    // getUser();
  }, []);
  return (




    <div>
      <ToolkitProvider
        keyField="name"
        data={userData}
        columns={columns}
        search
      >
        {(props) => (
          <>
            <BootstrapTable
              {...props.baseProps}
              selectRow={selectRow}
              pagination={paginationFactory()}
            />
          </>
        )}

      </ToolkitProvider>
    </div>
  )
}

export default FileRepoShairWithme