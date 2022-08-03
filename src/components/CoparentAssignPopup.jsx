import React, { useState, useEffect } from "react";
import { Button, Col, Container, Row, Form, Dropdown,Modal } from "react-bootstrap";
import BootstrapTable from 'react-bootstrap-table-next';
import axios from 'axios';
import { BASE_URL } from '../components/App';

const CoparentAssignPopup = (props) => {
    
//   const [show, setShow] = useState(false);

  const [selectedParents, setSelectedParents] = useState([])
  const handleClose = () => props.handleClose();
    const assignParents = async() => {
        let childId = localStorage.getItem("SelectedChild")
        let response =await axios.post(`${BASE_URL}/enrollment/child/assign-parents/${childId}`,{parentIds:selectedParents}, {
            headers: {
                authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });
        if (response.status === 201) {
            handleClose()
            window.location.reload()
        }
        
    }

 useEffect(()=>{
    const defaultParents = JSON.parse(localStorage.getItem("DefaultParents"))
        setSelectedParents(defaultParents)
 },[])

const selectRow = {
    mode: 'checkbox',
    selected:[...selectedParents],
    clickToSelect:true,
    onSelect: (row, isSelect, rowIndex, e) => {
        if (isSelect) {
            let arr = selectedParents
            arr.push(row.id)
            setSelectedParents(arr)
        }
        else {
            let arr = selectedParents
            let index = arr.indexOf(row.id)
            let removed = arr.splice(index, 1);
            setSelectedParents(arr)
        }
    },
    onSelectAll: (isSelect, rows, e) => {
    
        if (isSelect) {
            rows = rows.map((row)=>{
                return row.id
            })
            setSelectedParents(rows)
        }
        else {
            setSelectedParents([])
        }
    }
};

const products = props.parents.map((parent)=>({
    id: parent.id,
    name: parent.fullname + "," + (parent.profile_photo ? parent.profile_photo : "../img/user.png"),
    Location: parent.city
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
                    <Button variant="primary" onClick={()=>assignParents()}>
                        Add
                    </Button>
                </Modal.Footer>
            </Modal >
        </div>
    </>
  )
}
export default CoparentAssignPopup;
