import React, { useState, useEffect } from "react";
import { Button, Col, Container, Row, Form, Dropdown, Modal } from "react-bootstrap";
import BootstrapTable from 'react-bootstrap-table-next';
import axios from 'axios';
import { BASE_URL } from '../components/App';
import { useNavigate } from 'react-router';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit';

const CoparentAssignPopup = (props) => {
    const navigate = useNavigate();
    const { SearchBar } = Search;
    //   const [show, setShow] = useState(false);

    const [selectedParents, setSelectedParents] = useState([])
    const handleClose = () => props.handleClose();

    const assignParents = async () => {
        let childId = localStorage.getItem("SelectedChild")
        let clearMapping = await axios.post(`${BASE_URL}/enrollment/child/assign-parents/${childId}`, { parentIds: [] }, {
            headers: {
                authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });

        selectedParents.map(async (parent) => {
            let token = localStorage.getItem('token');
            let response = await axios.post(`${BASE_URL}/enrollment/parent/`, { user_parent_id: parent, childId: childId }, {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (response.status === 201) {
                response = await axios.patch(`${BASE_URL}/auth/user/update/${parent}`, {
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem('token')}`
                    }
                });
                if (response.status === 201 && response.data.status === "success") {
                    const response = await axios.post(`${BASE_URL}/enrollment/send-mail/${parent}`, { childId, user_role: localStorage.getItem('user_role') }, {
                        headers: {
                            "Authorization": `Bearer ${token}`
                        }
                    });

                    if (response.status === 201 && response.data.status === "success") {
                        handleClose()
                        window.location.reload()
                    }
                }
            }
        })

    }

    useEffect(() => {
        const defaultParents = JSON.parse(localStorage.getItem("DefaultParents"))
        setSelectedParents(defaultParents)
    }, [])

    const selectRow = {
        mode: 'checkbox',
        selected: [...selectedParents],
        clickToSelect: true,
        onSelect: (row, isSelect, rowIndex, e) => {
            if (isSelect) {
                let arr = selectedParents
                arr.push(row.parentId)
                setSelectedParents(arr)
            }
            else {
                let arr = selectedParents
                let index = arr.indexOf(row.parentId)
                let removed = arr.splice(index, 1);
                setSelectedParents(arr)
            }
        },
        onSelectAll: (isSelect, rows, e) => {

            if (isSelect) {
                rows = rows.map((row) => {
                    return row.parentId
                })
                setSelectedParents(rows)
            }
            else {
                setSelectedParents([])
            }
        }
    };

    const products = props.parents.map((parent) => ({
        id: parent.id,
        name: parent.fullname + "," + (parent.profile_photo ? parent.profile_photo : "../img/user.png"),
        Location: parent.city,
        parentId: parent.id
    }))

    const PopColumns = [
        {
            dataField: 'name',
            text: 'Name',
            formatter: (cell) => {
                cell = cell.split(",");
                return (<><div className="user-list"><span className="user-pic"><img src={cell[1]} alt='' /></span><span className="user-name">{cell[0]}</span></div></>)
            },
        },
        {
            dataField: 'Location',
            text: 'Location',

        }
    ];

    return (
        <>
            <div className="item mb-3">
                <Modal size="lg" show={props.show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Select Co-Parent</Modal.Title>
                        <Button variant="outline-secondary" onClick={() => (navigate(`/new-user?franchise=${props.franchise}&childId=${props.childId}&role=guardian&parentId=${props.paramsParentId}`))} style={{ position: 'absolute', right: '80px' }}>
                            Add New
                        </Button>
                    </Modal.Header>
                    <Modal.Body style={{ height: "40rem", overflowY: "scroll" }}>
                        <ToolkitProvider
                            bootstrap4
                            keyField="id"
                            data={products}
                            columns={PopColumns}
                            search
                        >
                            {(props) => (
                                <div className="data-search me-3">
                                    <label for="search-bar" className="search-label">
                                        {/* <input
                                id="search-bar"
                                type="text"
                                className="form-control"
                                placeholder="Search"
                            // value={search}
                            // onChange={(e) => {
                            //     setSearch(e.target.value);
                            // }}

                            /> */}
                                        <SearchBar {...props.searchProps} />
                                    </label>
                                    <div className="mb-3"></div>
                                    {/* </div>
                    <div className="column-table user-management-sec user_management_sec"> */}
                                    <BootstrapTable
                                        selectRow={selectRow}
                                        {...props.baseProps}
                                        noDataIndication="There is no similar Parent!"
                                    />
                                </div>
                            )}
                        </ToolkitProvider>
                    </Modal.Body>
                    <Modal.Footer className="justify-content-md-center">
                        <Button variant="transparent" onClick={handleClose}>
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={() => assignParents()}>
                            Add
                        </Button>
                    </Modal.Footer>
                </Modal >
            </div>
        </>
    )
}
export default CoparentAssignPopup;
