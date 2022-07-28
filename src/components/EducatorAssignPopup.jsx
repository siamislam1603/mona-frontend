import React, { useState, useEffect } from "react";
import { Button, Col, Container, Row, Form, Dropdown,Modal } from "react-bootstrap";
import BootstrapTable from 'react-bootstrap-table-next';
import axios from 'axios';
import { BASE_URL } from '../components/App';

const EducatorAssignPopup = (props) => {
    
//   const [show, setShow] = useState(false);

  const [selectedEducators, setSelectedEducators] = useState([])
  const handleClose = () => props.handleClose();
    const assignEducators = async() => {
        let childId = localStorage.getItem("SelectedChild")
        let response =await axios.post(`${BASE_URL}/enrollment/child/assign-educators/${childId}`,{educatorIds:selectedEducators}, {
            headers: {
                authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });
        if (response.status === 201) {
            handleClose()
            window.location.reload()
        }
        
    }

const selectRow = {
    mode: 'checkbox',
    clickToSelect:true,
    onSelect: (row, isSelect, rowIndex, e) => {
        if (isSelect) {
            let arr = selectedEducators
            arr.push(row.id)
            setSelectedEducators(arr)
        }
        else {
            let arr = selectedEducators
            let index = arr.indexOf(row.id)
            let removed = arr.splice(index, 1);
            setSelectedEducators(arr)
        }
    },
    onSelectAll: (isSelect, rows, e) => {
    
        if (isSelect) {
            rows = rows.map((row)=>{
                return row.id
            })
            setSelectedEducators(rows)
        }
        else {
            setSelectedEducators([])
        }
    }
};

const products = props.educators.map((educator)=>({
    id: educator.id,
    name: educator.fullname + "," + (educator.profile_photo ? educator.profile_photo : "../img/user.png"),
    Location: educator.city
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
                    <Modal.Title>Select Educator</Modal.Title>
                    <Button variant="outline-secondary" onClick={handleClose} style={{ position: 'absolute', right: '80px' }}>
                        Add New
                    </Button>
                </Modal.Header>
                <Modal.Body>
                    <div className="data-search me-3">
                        <label for="search-bar" className="search-label">
                            <input
                                id="search-bar"
                                type="text"
                                className="form-control"
                                placeholder="Search"
                            // value={search}
                            // onChange={(e) => {
                            //     setSearch(e.target.value);
                            // }}

                            />
                        </label>
                    </div>
                    <div className="column-table user-management-sec user_management_sec">
                        <BootstrapTable
                            keyField="id"
                            selectRow={selectRow}
                            data={products}
                            columns={PopColumns}
                        />
                    </div>
                </Modal.Body>
                <Modal.Footer className="justify-content-md-center">
                    <Button variant="transparent" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={()=>assignEducators()}>
                        Add
                    </Button>
                </Modal.Footer>
            </Modal >
        </div>
    </>
  )
}
export default EducatorAssignPopup;
