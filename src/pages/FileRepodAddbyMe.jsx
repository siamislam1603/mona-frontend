
import React, { useState, useEffect } from 'react'
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import axios from "axios";
import { Link } from 'react-router-dom';
import { BASE_URL } from '../components/App';
import ToolkitProvider from 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit';
import { FullLoader } from "../components/Loader";

const selectRow = {
    mode: 'checkbox',
    clickToSelect: true,
};

const FileRepodAddbyMe = () => {
    const [userData, setUserData] = useState([]);
    const [fullLoaderStatus, setfullLoaderStatus] = useState(true);


    const GetData = async () => {
        let response = await axios.get(`${BASE_URL}/fileRepo/created-filesBy-category/${localStorage.getItem('user_id')}`, {
            headers: {
                authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        })

        if (response.status === 200) {
            const users = response.data.dataDetails;
            let tempData = users.map((dt) => ({
                name: `${dt.categoryId}, ${dt.count}`,
                createdAt: dt.updatedAt,
                userID: dt.id,
                creatorName: dt.ModifierName + "," + dt.updatedBy
            }));
            setUserData(tempData);
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
                            <Link to={`/file-repository-List-me/${cell[0]}`} className="FileResp">
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
            //     return (
            //         <>
            //             <div className="cta-col">
            //                 <Dropdown>
            //                     <Dropdown.Toggle variant="transparent" id="ctacol">
            //                         <img src="../img/dot-ico.svg" alt="" />
            //                     </Dropdown.Toggle>
            //                     <Dropdown.Menu>
            //                         <Dropdown.Item href="#">Delete</Dropdown.Item>
            //                     </Dropdown.Menu>
            //                 </Dropdown>
            //             </div>
            //         </>
            //     );
            // },
        },
    ]);
    useEffect(() => {
        GetData();
    }, []);
    return (
        <div>
            {userData.length > 0 ? (
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
            ) : (<div className="text-center mb-5 mt-5"><strong>No File Added By You</strong></div>)}

        </div>
    )
}

export default FileRepodAddbyMe
