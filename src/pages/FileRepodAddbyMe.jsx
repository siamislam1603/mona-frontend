
import React, { useState, useEffect } from 'react'
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import axios from "axios";
import { Link, useNavigate } from 'react-router-dom';
import { BASE_URL } from '../components/App';
import ToolkitProvider from 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit';
import { FullLoader } from "../components/Loader";

const FileRepodAddbyMe = ({ selectedFranchisee, SearchValue, seteditCategoryModalFlag }) => {
    const Navigate = useNavigate();
    const [userData, setUserData] = useState([]);
    const [fullLoaderStatus, setfullLoaderStatus] = useState(true);

    const GetData = async () => {
        try {
            if (selectedFranchisee) {
                let response = await axios.get(`${BASE_URL}/fileRepo/created-filesBy-category/${localStorage.getItem('user_id')}?franchiseAlias=${selectedFranchisee ? selectedFranchisee: "" }`, {
                    headers: {
                        authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                })

                if (response.status === 200 && response.data.status === "success") {
                    const users = response.data.dataDetails;
                    let tempData = users.map((dt) => ({
                        name: `${dt.categoryName},${dt.count},${dt.categoryId}`,
                        updatedAt: dt.updatedAt,
                        createdAt: dt.createdAt,
                        userID: dt.id,
                        creatorName: dt.ModifierName + "," + dt.updatedBy,
                    }));
                    setUserData(tempData);
                    setfullLoaderStatus(false)
                } else if (response.status === 404) {
                    setUserData([])
                    setfullLoaderStatus(false)
                }
            }
        } catch (err) {
            setUserData([])
            setfullLoaderStatus(false)
        }
    }

    const GetSaachhData = async () => {
        try {
            let response = await axios.get(`${BASE_URL}/fileRepo/created-filesBy-category/${localStorage.getItem('user_id')}?franchiseAlias=${selectedFranchisee ? selectedFranchisee: "" }&search=${SearchValue}`, {
                headers: {
                    authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            })

            if (response.status === 200) {
                const users = response.data.dataDetails;
                let tempData = users.map((dt) => ({
                    name: `${dt.categoryName},${dt.count},${dt.categoryId}`,
                    updatedAt: dt.updatedAt,
                    createdAt: dt.createdAt,
                    userID: dt.id,
                    creatorName: dt.ModifierName + "," + dt.updatedBy,
                }));
                setUserData(tempData);
                setfullLoaderStatus(false)
          
            }
            else if (response.status === 404) {
                setUserData([])
                setfullLoaderStatus(false)
            }
        } catch (err) {
            setUserData([])
            setfullLoaderStatus(false)
        }
    }
    useEffect(() => {
        GetData();
    }, []);

    useEffect(() => {
        GetSaachhData();
    }, [SearchValue])

    useEffect(() => {
        if (selectedFranchisee) {
            GetData();
        }
    }, [selectedFranchisee]);

    const defaultSortedBy = [{
        dataField: "name",
        order: "asc"  // or desc
      }];


    const columns = [
        {
            dataField: 'name',
            text: 'Name',
            sort: true,
            formatter: (cell) => {
                cell = cell.split(',');

                return (
                    <>
                        <div className="user-list">
                            <Link to={`/file-repository-List-me/${cell[2]}`} className="FileResp">
                                <span>
                                    <img src="../img/gfolder-ico.png" className="me-2" alt="" />
                                </span>
                            </Link>
                            <span className="user-name">
                                {cell[0]}
                                <small>
                                    {cell[1] > 1 ? (<>
                                        {cell[1]} Files
                                    </>) : (<>
                                        {cell[1]} File
                                    </>)}
                                </small>
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
            dataField: 'updatedAt',
            text: 'Updated on',
            sort: true,
        },
        {
            dataField: 'creatorName',
            text: 'Updated by',
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
            dataField: 'userID',
            text: '',
            formatter: (cell) => {
                return (
                    <>
                        {/* <div className="cta-col">
                            <Dropdown>
                                <Dropdown.Toggle variant="transparent" id="ctacol">
                                    <img src="../img/dot-ico.svg" alt="" />
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <Dropdown.Item onClick={() => { seteditCategoryModalFlag(true) }}>Edit</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </div> */}
                    </>
                );
            },
        },
    ]

    return (
        <div>
            <FullLoader loading={fullLoaderStatus} />
            <ToolkitProvider
                keyField="name"
                data={userData}
                columns={columns}
                search
            >
                {(props) => (
                    <>
                        {userData.length > 0 ? (
                            <BootstrapTable
                                {...props.baseProps}
                                defaultSorted={defaultSortedBy}
                                pagination={paginationFactory()}
                            />
                        ) :
                            (!fullLoaderStatus && <>
                                <div className="text-center mb-5 mt-5"><strong>No File Added By You</strong></div>
                            </>
                            )
                        }
                    </>
                )}

            </ToolkitProvider>

        </div>
    )
}

export default FileRepodAddbyMe
