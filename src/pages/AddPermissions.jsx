import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { get, useForm } from 'react-hook-form';
import { BASE_URL } from '../components/App';

const AddPermissions = () => {
    // handle events
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const [permissions, setPermissions] = useState([[0],[]]);
    const [role, setRole] = useState();
    const [controllers, setControllers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [finalObj , setFinalObj] = useState();
    const actionObj = ["Listing","Add","Edit","View Detail","Delete","Change Status","Share","Download"]
    
    const savePermissions = async (data) => {
        const response = await axios.post(`${BASE_URL}/rbac/add_role_permissions`, data, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem('token')
            }
        });
        console.log('REACT -> RESPONSE:', response);
    };

    const format = (id,value,checked) => {
        let obj = finalObj
        if(obj[id] && checked){
            obj[id].push(value)
            obj[id] = [...new Set(obj[id])];
            console.log(obj,"obj")
            setFinalObj(obj)
        } 
        else if(obj[id] && !checked){
            let arr = obj[id]
            let index = arr.indexOf(value)
            let removed = arr.splice(index, 1);
            if(arr.length == 0){
                delete obj[id]
            }
            obj[id] = [...new Set(obj[id])];
            setFinalObj(obj)
        }
        else{
            obj[id] = [value]
        }
    }

    // handle submit
    const onSubmit = (data)=> {
        if(role && Object.keys(finalObj).length > 0) {
            console.log({ role_name: role, role_permissions: JSON.stringify(finalObj) },"submission")

            //  uncomment the line below when we need to call the api.
            // savePermissions({ role_name: role, role_permissions: JSON.stringify(finalObj) });
        } else{
            window.alert("Role and permissions Must be Selected!")
            return
        }
    };

    const getControllersAndActions = async () => {
        const response = await axios.get(`${BASE_URL}/rbac/fetch_controller_and_actions`, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem('token')
            }
        });

        setControllers(response.data.controllers)
    };

    const getRoles = async () => {
        const response = await axios.get(`${BASE_URL}/rbac/fetch-roles`, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem('token')
            }
        });

        setRoles(response.data.roles)
    };

    const getPermissions = async (role) => {
        const response = await axios.get(`${BASE_URL}/rbac/get_role_permissions/${role}`, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem('token')
            }
        });
        let keys = Object.keys(response.data.permissions)
        let values = Object.values(response.data.permissions)
        setPermissions([keys,values])
        setFinalObj(response.data.permissions)
    };

    const setRoleAndPermissions = async (Role) => {
        await getPermissions(Role)
        setRole(Role)
    }

    useEffect(()=>{
        getControllersAndActions()
        getRoles()
    },[])

    useEffect(()=>{
        console.log("updated permissions",permissions,role)
    },[role])

    return (
        <React.Fragment>
            <section>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="bg-light w-auto h-auto pb-10 mt-16 mx-5 rounded-lg">
                        {/* HEADER SECTION */}
                        <div className="h-24 flex justify-center items-center shadow p-5">
                            <h2 className="display-3 text-center">Add / Edit Permissions</h2>
                        </div>

                        {/* BODY SECTION */}
                        <div>
                            <table className="w-100 p-3 table-responsive px-3">
                                <thead className="bg-dark text-light">
                                    <tr>
                                        <th>
                                        <select defaultValue={'DEFAULT'} onChange={(event) => {setRoleAndPermissions(event.target.value)}} style={{"width":"20rem","height":"3rem","fontSize":"1.3rem"}}>
                                            <option value="DEFAULT" disabled>&nbsp;&nbsp;Choose Role</option>
                                            {
                                                (roles || []).map((role,idx)=>{
                                                    return (
                                                        <option value={role.role_name} key={idx}>&nbsp;&nbsp;{role.role_label}</option>
                                                    )
                                                })
                                            }
                                        </select>
                                        </th>
                                        {
                                            actionObj.map((act,idx)=>{
                                                return (
                                                    <th className="h5 text-center py-4 px-4" key={idx}>
                                                        {act}
                                                    </th>
                                                )
                                            })
                                        }
                                    </tr>
                                </thead>
                                
                                <tbody>
                                    {
                                        (controllers || []).map((controller,idx)=>{
                                            return (
                                                <tr key={idx}>
                                                    <td><h4>{controller.controller_label}</h4></td>
                                                    {
                                                        controller.controller_actions.map((i,idx)=>{
                                                            {
                                                                console.log("ll",permissions[0].includes(controller.id.toString()) )}
                                                            return (
                                                                <td className="text-center" key={idx}>
                                                                    <input 
                                                                        type="checkbox"
                                                                        value={idx+1}
                                                                        className="w-8 h-8"
                                                                        {...register(toString(controller.id), { required: false })}
                                                                        onChange={(e)=>{format(controller.id,e.target.value,e.target.checked)}} 
                                                                        style={{"width":"1.2rem","height":"1.2rem"}}
                                                                        checked={permissions[0].includes(controller.id.toString()) ? true : false} />
                                                                </td>)
                                                        })
                                                    }
                                                </tr>   
                                            )   
                                        })
                                    }
                                </tbody>
                            </table>

                            {/* SUBMIT SECTION */}
                            <div className="p-5 text-center">
                                <input 
                                    type="submit"
                                    value="Submit"
                                    className="w-1/3 h-10 bg-dark text-light rounded-lg p-3" />
                            </div>
                        </div>
                    </div>
                </form>
            </section>
        </React.Fragment>
    )
};

export default AddPermissions;