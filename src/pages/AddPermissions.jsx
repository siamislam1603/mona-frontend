import React, { useState } from 'react';
import { useEffect } from 'react';
import { Form } from 'react-bootstrap';
import { controllers, actions } from '../assets/data/permissions';

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
        <div className="container">
            {
                controllerList && controllerList.map(controller => (
                    <div>
                        <h1 onClick={() => handleSelectAll(controller.id)}>
                            {controller.label}
                        </h1>
                        {
                            actionList && actionList.map(action => (
                                <div className="action">
                                    <p>{action.label}</p>
                                    <Form.Group className="mb-3">
                                        <div className="btn-checkbox">
                                            <Form.Check
                                                type="checkbox"
                                                id={`${controller.value}_${action.value}`}
                                                checked={savedPermissions[`${controller.id}`].includes(action.id)}
                                                label=""
                                                onChange={() => {
                                                    handleSavePermission(controller.id, action.id);
                                                }} />
                                        </div>
                                    </Form.Group>
                                </div>  
                            ))
                        }
                    </div>
                ))
            }
        </div>
    );
}

export default AddPermissions;