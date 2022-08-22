import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AddUserRole.css';
import { BASE_URL } from '../components/App';

const AddUserRole = (props) => {

  const [data, setData] = useState([]);
  const [userRole, setUserRole] = useState("");
  const [permissions, setPermissions] = useState([]);

  // SAVING THE SELECTED PERMISSIONS INSIDE DATABASE
  const savePermissions = async data => {
    console.log('saving permissions!');
    let response = await axios.post(`${BASE_URL}/rbac/addRolePermissions`, data);
    console.log(response);
  }

  const handleUserRoleInput = event => {
    setUserRole(event.target.value);
  };

  const handleChange = (event, id) => {
    const { name, id: actioncontrollername } = event.target;
    if(!actioncontrollername) {
      setPermissions(prevState => ({
        ...prevState,
        [name]: {
          id: id
        }
      }));  
    } else {
      const actionData = {...permissions};
      actionData[actioncontrollername]['actions'] = {...actionData[actioncontrollername]['actions']};
      actionData[actioncontrollername]['actions'][name] = id;
      setPermissions(actionData);
    }
    
  };

  const handleSubmit = event => {
    event.preventDefault();
    savePermissions({user_role: userRole, permissions});
  }

  const loadControllerAndActions = async () => {
    let response = await axios.get(`${BASE_URL}/rbac/fetchControllerAndActions`);
    if(response.status === 200) {
      const { dataList } = response.data;
      setData(dataList);
    }
  };

  useEffect(() => {
    loadControllerAndActions();
  }, []);

  console.log('PERMISSIONS:', permissions);

  return (
    <>
      <form className="control-box" onSubmit={handleSubmit}>
          <div className="control-box-header">
            <h1 className="control-box-title">Role Permission</h1>

            <div className="right-section">
              <div className="select-all-checkbox">
                <input 
                  type="checkbox" 
                  name="select_all" 
                  id="select_all"
                  value="" />
                <label htmlFor="">Select All</label>
              </div>
              <button className="btn btn-secondary btn-long">Expand/Collapse All</button>
            </div>
          </div>

          <div className="search-section">
            <input 
              type="text" 
              name="create_role" 
              id="create_role"
              onChange={handleUserRoleInput}
              placeholder="Enter role name here" />
          </div>

          <div className="control-box-content">
            <div className="controller-box">
              {/* CONTROLLERS ARE LOADED HERE */}
              {
                data.map(ca => {
                  return (
                    <div className="controller-section" key={ca.controller.id}>
                      <input 
                      type="checkbox" 
                      name={`${ca.controller.controller_name}`} 
                      className={`${ca.controller.controller_name}`}
                      value=""
                      onChange={(event) => handleChange(event, ca.controller.id)} />
                      <label htmlFor="">{ca.controller.controller_label}</label>
                      
                      {/* ACTIONS ARE LOADED HERE */}
                      <ul className="action-section">
                        {
                          ca.actions.map(a => {
                            return(
                              <li className="action-1" key={a.id}>
                                <input
                                  type="checkbox" 
                                  name={`${a.action_name}`} 
                                  className={`${a.action_name}`} 
                                  id={`${ca.controller.controller_name}`}
                                  value=""
                                  onChange={(event) => handleChange(event, a.id)} />
                                <label htmlFor="">{a.action_label}</label>
                              </li>
                            );
                          })
                        }
                      </ul>
                    </div>
                  );
                })
              }
            </div>
          </div>

        <div className="submit-section">
          <input 
            type="submit" 
            value="Create" />
        </div>

      </form>
    </>
  );
}

export default AddUserRole;