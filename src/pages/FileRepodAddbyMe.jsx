
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

const FileRepodAddbyMe = ({ selectedFranchisee, SearchValue }) => {
    const [userData, setUserData] = useState([]);
    const [fullLoaderStatus, setfullLoaderStatus] = useState(true);


    const GetData = async () => {
        try {
            let response = await axios.get(`${BASE_URL}/fileRepo/created-filesBy-category/${localStorage.getItem('user_id')}?franchiseAlias=${selectedFranchisee}`, {
                headers: {
                    authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            })
            if (response) {
                setfullLoaderStatus(false)
            }
            if (response.status === 200) {
                const users = response.data.dataDetails;
                let tempData = users.map((dt) => ({
                    name: `${dt.categoryId}, ${dt.count} , ${dt.categoryName}`,
                    createdAt: dt.updatedAt,
                    userID: dt.id,
                    creatorName: dt.ModifierName + "," + dt.updatedBy
                }));
                setUserData(tempData);
            }
        } catch (err) {
            setfullLoaderStatus(false)
        }

    }
    const GetSaachhData = async () => {
        try {
            let response = await axios.get(`${BASE_URL}/fileRepo/created-filesBy-category/${localStorage.getItem('user_id')}?franchiseAlias=${selectedFranchisee}&search=${SearchValue}`, {
                headers: {
                    authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            })
            if (response) {
                setfullLoaderStatus(false)
            }
            if (response.status === 200) {
                const users = response.data.dataDetails;
                let tempData = users.map((dt) => ({
                    name: `${dt.categoryId}, ${dt.count} , ${dt.categoryName}`,
                    createdAt: dt.updatedAt,
                    userID: dt.id,
                    creatorName: dt.ModifierName + "," + dt.updatedBy
                }));
                setUserData(tempData);
            }
        } catch (err) {
            setfullLoaderStatus(false)
        }

    }
    useEffect(() => {
        GetSaachhData();
    }, [SearchValue])

    useEffect(() => {
        GetData();
    }, []);


    useEffect(() => {
        if (selectedFranchisee) {
            GetData();
            setUserData();
        }
    }, [selectedFranchisee]);

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
                                {cell[2]}
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
                                <small>
                                    {
                                        cell[1] === "franchisor_admin" ? "Franchisor Admin" :
                                            cell[1] === "franchisee_admin" ? "Franchisee Admin" :
                                                cell[1] === "guardian" ? "Guardian" :
                                                    cell[1] === "educator" ? "Educator" :
                                                        cell[1] === "coordinator" ? "Coordinator" :
                                                            cell[1]
                                    }
                                </small>
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

    return (
        <div>
            <FullLoader loading={fullLoaderStatus} />
            {userData ? (
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
                            />
                        </>
                    )}

                </ToolkitProvider>
            ) : null}
            {!userData ?
                <div className="text-center mb-5 mt-5">  <strong>No File Added By You</strong> </div>
                : null}
            {/* <div className="text-center mb-5 mt-5"><strong>No File Added By You</strong></div> */}
        </div>
    )
}

export default FileRepodAddbyMe
