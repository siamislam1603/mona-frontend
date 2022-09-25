
import React, { useState, useEffect } from 'react'
import { Container } from 'react-bootstrap';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit';
import paginationFactory from 'react-bootstrap-table2-paginator';
import LeftNavbar from '../components/LeftNavbar';
import TopHeader from '../components/TopHeader';
import { Link, useParams } from 'react-router-dom';
import { BASE_URL } from '../components/App';
import BootstrapTable from 'react-bootstrap-table-next';
import axios from "axios";
import VideoPopupfForFile from '../components/VideoPopupfForFile';
import FilerepoUploadFile from './FilerepoUploadFile';
import { FullLoader } from "../components/Loader";
const getUser_Role = localStorage.getItem(`user_role`)
const getFranchisee = localStorage.getItem('franchisee_id')

const FileRpositoryList = () => {
    let Params = useParams();
    const [showVideo, setVideo] = useState(false);
    const handleVideoClose = () => setVideo(false);
    const [userData, setUserData] = useState([]);
    const [Count, setCount] = useState([]);
    const [fullLoaderStatus, setfullLoaderStatus] = useState(true);
    const [selectedFranchisee, setSelectedFranchisee] = useState(null);
    const [SearchValue, setSearchValue] = useState();

    const HandelSearch = (event) => {
        setSearchValue(event.target.value);

    }




    const GetFile = async () => {
        var myHeaders = new Headers();
        myHeaders.append(
            'authorization',
            'Bearer ' + localStorage.getItem('token')
        );
        var requestOptions = {
            method: 'GET',
            redirect: 'follow',
            headers: myHeaders,
        };
        try {
            let data = selectedFranchisee === "null" ? "all" : selectedFranchisee;
            let user_Role = localStorage.getItem('user_role');
            let URL = user_Role === "guardian" ? `${BASE_URL}/fileRepo/files-by-category/${Params.id}?childId=[${data}]` :
                `${BASE_URL}/fileRepo/files-by-category/${Params.id}`

            if (URL) {
                let response = await fetch(URL, requestOptions)
                response = await response.json();
                setCount(response.result.count)
                if (response) {
                    setfullLoaderStatus(false)
                }
                const users = response.result.files;

                let tempData = users.map((dt) => ({
                    name: `${dt.repository.repository_files[0].fileType},${dt.repository.repository_files[0].fileName} ,${dt.repository.repository_files[0].filesPath}`,
                    createdAt: dt.createdAt,
                    userID: dt.id,
                    creatorName: dt.repository.repository_files[0].creatorName + "," + dt.repository.repository_files[0].creatorRole,
                    Shaired: dt.repository.repository_files[0].length,
                }));
                setUserData(tempData);
            }
        } catch (e) {
            setfullLoaderStatus(false)
        }
    }
    const GetSearchFile = async () => {
        var myHeaders = new Headers();
        myHeaders.append(
            'authorization',
            'Bearer ' + localStorage.getItem('token')
        );
        var requestOptions = {
            method: 'GET',
            redirect: 'follow',
            headers: myHeaders,
        };
        try {
            let data = selectedFranchisee === "null" ? "all" : selectedFranchisee;
            let user_Role = localStorage.getItem('user_role');
            if (SearchValue === "undefined") {
                console.log("No SearchValue")
            }
            else {
                let URL = user_Role === "guardian" ? `${BASE_URL}/fileRepo/files-by-category/${Params.id}?childId=[${data}]&search=${SearchValue}` :
                    `${BASE_URL}/fileRepo/files-by-category/${Params.id}?search=${SearchValue}`
                if (URL) {
                    let response = await fetch(URL, requestOptions)
                    response = await response.json();
                    setCount(response.result.count)
                    if (response) {
                        const users = response.result.files;
                        let tempData = users.map((dt) => ({
                            name: `${dt.repository.repository_files[0].fileType},${dt.repository.repository_files[0].fileName} ,${dt.repository.repository_files[0].filesPath}`,
                            createdAt: dt.createdAt,
                            userID: dt.id,
                            creatorName: dt.repository.repository_files[0].creatorName + "," + dt.repository.repository_files[0].creatorRole,
                            Shaired: dt.repository.repository_files[0].length,
                        }));
                        setUserData(tempData);
                    }
                }
            }
        } catch (e) {

        }
    }
    useEffect(() => {
        GetSearchFile();
    }, [SearchValue])


    useEffect(() => {
        GetFile();
    }, [selectedFranchisee])

    const [columns, setColumns] = useState([
        {
            dataField: 'name',
            text: 'Name',
            sort: true,
            formatter: (cell) => {
                cell = cell.split(',');
                return (
                    <>
                        <div div className="user-list">
                            {cell[0] === "image/jpeg" || cell[0] === "image/png" || cell[0] === "image/webp" || cell[0] === "image" ?
                                <>
                                    <span className="user-pic-tow">
                                        <a href={cell[2]} download>
                                            <img src="../img/abstract-ico.png" className="me-2" alt="" />
                                        </a>
                                    </span>
                                    <span className="user-name">
                                        {cell[1]}.img
                                    </span>
                                </>
                                :
                                cell[0] === "audio/mpeg" ?
                                    <>
                                        <span className="user-pic-tow">
                                            <a href={cell[2]} download>
                                                <img src="../img/audio-ico.png" className="me-2" alt="" />
                                            </a>
                                        </span>
                                        <span className="user-name">
                                            {cell[1]}.mp3
                                        </span>
                                    </>
                                    : cell[0] === "video/mp4" ?
                                        <>
                                            <div style={{ width: "100%", display: "flex" }}>
                                                <VideoPopupfForFile
                                                    data={cell[2]}
                                                    title={cell[0]}
                                                    name={cell[1]}
                                                    // duration={cell[0]}
                                                    fun={handleVideoClose}
                                                />
                                            </div>

                                        </> :
                                        cell[0] === "application/octet-stream" || cell[0] === "application/pdf" || cell[0] === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || cell[0] === "text/csv" || cell[0] === "text/html" || cell[0] === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ?
                                            <>
                                                <span className="user-pic-tow">
                                                    <a href={cell[2]} download >
                                                        <img src="../img/abstract-ico.png" className="me-2" alt="" />
                                                    </a>
                                                </span>
                                                <span className="user-name">
                                                    {cell[1]}.Doc
                                                </span>
                                            </> : <>
                                                <span className="user-pic-tow">
                                                    <a href={cell[2]} download >
                                                        <img src="../img/abstract-ico.png" className="me-2" alt="" />
                                                    </a>
                                                </span>
                                                <span className="user-name">
                                                    {cell[0]}
                                                </span>
                                            </>
                            }
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
            dataField: 'Shaired',
            text: 'Shared',
            sort: true,
            formatter: (cell) => {
                return (
                    <>
                        <div className="user-list">
                            <span className="user-name">
                                <img src="../img/sharing-ico.png" className="me-2" alt="" />
                                Access Given
                            </span>
                        </div>
                    </>
                );
            }
        },
        {
            dataField: 'repository_files',
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
                                    <Dropdown.Item href="#">Delete</Dropdown.Item>
                                    <Dropdown.Item href="#">Edit</Dropdown.Item>
                                    <Dropdown.Item href="#">Share</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </div> */}
                    </>
                );
            },
        },
    ]);
    return (
        <>
            <div id="main">
                <FullLoader loading={fullLoaderStatus} />
                <section className="mainsection">
                    <Container>
                        <div className="admin-wrapper">
                            <aside className="app-sidebar">
                                <LeftNavbar />
                            </aside>
                            <div className="sec-column">
                                <TopHeader
                                    selectedFranchisee={selectedFranchisee}
                                    setSelectedFranchisee={setSelectedFranchisee} />
                                <div className="entry-container">
                                    <div className="user-management-sec repository-sec">
                                        <ToolkitProvider
                                            keyField="name"
                                            data={userData}
                                            columns={columns}
                                            search
                                        >
                                            {(props) => (
                                                <>
                                                    <h1 className="title-lg"><Link to="/file-repository"><img src="../../img/back-arrow.svg" /></Link> File Repository</h1>
                                                    <header className="title-head">
                                                        <div className="user-list">
                                                            <span>
                                                                <img src="../img/gfolder-ico.png" className="me-2" alt="" />
                                                            </span>
                                                            <span className="user-name">
                                                                {Params?.id === "1" ? "Daily Use" :
                                                                    Params?.id === "2" ? "Business Management" :
                                                                        Params?.id === "3" ? "Employment" :
                                                                            Params?.id === "4" ? "Compliance" :
                                                                                Params?.id === "5" ? "Care Giving" :
                                                                                    Params?.id === "6" ? "Curriculum & Planning" :
                                                                                        Params?.id === "7" ? "Resources" :
                                                                                            Params?.id === "8" ? "General" : "Null"
                                                                }
                                                                <small>
                                                                    {Count > 1 ? (<>
                                                                        {Count} Files
                                                                    </>) : (<>
                                                                        {Count} File
                                                                    </>)}
                                                                </small>
                                                                {/* <small>{Count} files</small> */}
                                                            </span>
                                                        </div>
                                                        <div className="othpanel">
                                                            <div className="extra-btn">
                                                                <div className="data-search me-3">
                                                                    <label for="search-bar" className="search-label">
                                                                        <input
                                                                            id="search-bar"
                                                                            type="text"
                                                                            className="form-control"
                                                                            placeholder="Search"
                                                                            value={SearchValue}
                                                                            onChange={HandelSearch} />
                                                                    </label>
                                                                    {/* <SearchBar {...props.searchProps} /> */}
                                                                </div>
                                                                <FilerepoUploadFile />
                                                            </div>
                                                        </div>
                                                    </header>
                                                    <BootstrapTable
                                                        {...props.baseProps}
                                                        // selectRow={selectRow}
                                                        pagination={paginationFactory()}

                                                    />

                                                </>
                                            )}
                                        </ToolkitProvider>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Container>
                </section>

            </div>
        </>
    )
}

export default FileRpositoryList