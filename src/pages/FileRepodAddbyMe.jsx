
import React, { useState, useEffect } from 'react'
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import axios from "axios";
import { Link, useNavigate } from 'react-router-dom';
import { BASE_URL } from '../components/App';
import ToolkitProvider from 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit';
import { FullLoader } from "../components/Loader";


const FileRepodAddbyMe = ({ selectedFranchisee, SearchValue }) => {
    const Navigate = useNavigate();
    const [userData, setUserData] = useState([]);
    const [fullLoaderStatus, setfullLoaderStatus] = useState(true);

    const GetData = async () => {
        try {
            if (selectedFranchisee) {
                let response = await axios.get(`${BASE_URL}/fileRepo/created-filesBy-category/${localStorage.getItem('user_id')}?franchiseAlias=${selectedFranchisee}`, {
                    headers: {
                        authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                })
                if (response.status === 200 && response.data.status === "success") {
                    const users = response.data.dataDetails;
                    let tempData = users.map((dt) => ({
                        name: `${dt.categoryId}, ${dt.count} , ${dt.categoryName}`,
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
                    updatedAt: dt.updatedAt,
                    createdAt: dt.createdAt,
                    userID: dt.id,
                    creatorName: dt.ModifierName + "," + dt.updatedBy,
                }));
                setUserData(tempData);
                console.log(tempData, "tempData")
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


    const columns = [
        {
            dataField: 'name',
            text: 'Name',
            sort: true,
            formatter: (cell) => {
                cell = cell.split(',');
                let category_id = () => {
                    localStorage.setItem("category_type", cell[2])
                }
                return (
                    <>
                        <div className="user-list">
                            <Link to={`/file-repository-List-me/${cell[0]}`} className="FileResp">
                                <span onClick={category_id}>
                                    <img src="../img/gfolder-ico.png" className="me-2" alt="" />
                                </span>
                            </Link>
                            <span className="user-name">
                                {cell[2]}
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
            dataField: 'repository_files',
            text: '',

        },
    ]

    return (
        <div>
            <FullLoader loading={fullLoaderStatus} />
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
                            />
                        </>
                    )}

                </ToolkitProvider>
            ) : (
                <>
                    <div className="text-center mb-5 mt-5"><strong>No File Added By You</strong></div>
                </>
            )}
        </div>
    )
}

export default FileRepodAddbyMe
