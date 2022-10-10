import React, { useState } from 'react';
import { useEffect } from 'react';
import { Form, Container } from 'react-bootstrap';
import { controllers, actions } from '../assets/data/permissions';
import LeftNavbar from "../components/LeftNavbar";
import TopHeader from "../components/TopHeader";
import Table from 'react-bootstrap/Table';

const AddPermissions = (props) => {
    const [controllerList, setControllerList] = useState(null);
    const [actionList, setActionList] = useState(null);
    const [savedPermissions, setSavedPermissions] = useState({
        "1": [],
        "2": [],
        "3": [],
        "4": [],
        "5": [],
        "6": [],
        "7": [],
        "8": [],
        "9": [],
        "10": [],
        "11": []
    });

    const handleSavePermission = (controllerId, actionId) => {
        if(savedPermissions[`${controllerId}`].includes(actionId)) {
           let array = savedPermissions[`${controllerId}`];
           array = array.filter(data => data !== actionId);
           setSavedPermissions(prevState => ({
            ...prevState,
            [controllerId]: array
           }));
        } else {
            setSavedPermissions(prevState => ({
                ...prevState,
                [controllerId]: [...savedPermissions[`${controllerId}`], actionId]
            }));
        }
    }

    const handleSelectAll = (controllerId) => {
        if(savedPermissions[`${controllerId}`].length === actionList.length) {
            setSavedPermissions(prevState => ({
                ...prevState,
                [controllerId]: []
            }));
        } else {
            let array = actionList.map(action => action.id);
            setSavedPermissions(prevState => ({
                ...prevState,
                [controllerId]: array
            }));
        }
    }

    useEffect(() => {
        setControllerList(controllers);
        setActionList(actions);
    }, []);

    console.log('SAVED PERMISSION:', savedPermissions);

    return (
        <div id="main">
          <section className="mainsection">
            <Container>
              <div className="admin-wrapper">
                <aside className="app-sidebar">
                  <LeftNavbar />
                </aside>
                <div className="sec-column">
                  <TopHeader />
                  <div className="entry-container">
                    <header className="title-head">
                      <h1 className="title-lg">Add Permissions</h1>
                    </header>
                    <div className="permissions-sec">
                    <Table bordered>
                      <tbody>
                      
            {
                controllerList && controllerList.map(controller => (
                    <tr>
                    <td>
                        <p className="head" onClick={() => handleSelectAll(controller.id)}>
                            <strong>{controller.label}</strong>
                        </p>
                    </td>
                    <td>
                        <div className="d-flex">
                        {
                            actionList && actionList.map(action => (
                                <div className="action">
                                    <Form.Group className="mb-3 me-4">
                                        <div className="btn-checkbox">
                                            <Form.Check
                                                type="checkbox"
                                                id={`${controller.value}_${action.value}`}
                                                checked={savedPermissions[`${controller.id}`].includes(action.id)}
                                                label={action.label}
                                                onChange={() => {
                                                    handleSavePermission(controller.id, action.id);
                                                }} />
                                        </div>
                                    </Form.Group>
                                </div>  
                            ))
                        }
                        </div>
                        </td>
                    </tr>
                ))
            }
            </tbody>
                    </Table>
        </div>
                  </div>
                </div>
              </div>
            </Container>
          </section>
        </div>
        
        
    );
}

export default AddPermissions;