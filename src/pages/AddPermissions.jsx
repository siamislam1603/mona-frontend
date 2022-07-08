import axios from 'axios';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { BASE_URL } from '../components/App';

const AddPermissions = () => {
    // handle events
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const [permissions, setPermissions] = useState(null);
    const [role, setRole] = useState();
    
    const savePermissions = async (data) => {
        const response = await axios.post(`${BASE_URL}/rbac/add_role_permissions`, data, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem('token')
            }
        });

        console.log('REACT -> RESPONSE:', response);
    };

    // handle submit
    const onSubmit = data => {
        
        const temp = Object.entries(data)
        .filter(([key, value], count) => value !== false)
        .reduce((obj, [key, value]) => {
            return Object.assign(obj, {
            [key]: value
            });
        }, {});

        console.log('TEMP:', temp);

        // setPermissions(JSON.stringify(temp));

        if(role && temp) 
            savePermissions({ role_name: role, role_permissions: JSON.stringify(temp) });
        
    };

    // console.log('ROLE:', permissions);

    return (
        <React.Fragment>
            <section>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="bg-light w-auto h-auto pb-10 mt-16 mx-5 rounded-lg">
                        {/* HEADER SECTION */}
                        <div className="h-24 flex justify-center items-center shadow p-5">
                            <h1 className="display-3 text-center">Add / Edit Permissions</h1>
                        </div>

                        {/* BODY SECTION */}
                        <div>
                            <table className="w-100 p-3">
                                <thead className="bg-dark text-light">
                                    <tr>
                                        <th>
                                        <select defaultValue={'DEFAULT'} onChange={(event) => setRole(event.target.value)}>
                                            <option value="DEFAULT" disabled>Choose Role</option>
                                            <option value="franchisor_admin">Franchisor Admin</option>
                                            <option value="franchisee_admin">Franchisee Admin</option>
                                            <option value="coordinator">Coordinator</option>
                                            <option value="educator">Educator</option>
                                        </select>
                                        </th>
                                        <th className="h5 text-center py-4 px-4">Listing</th>
                                        <th className="h5 text-center py-4 px-4">Add</th>
                                        <th className="h5 text-center py-4 px-4">Edit</th>
                                        <th className="h5 text-center py-4 px-4">View Detail</th>
                                        <th className="h5 text-center py-4 px-4">Delete</th>
                                        <th className="h5 text-center py-4 px-4">Change Status</th>
                                        <th className="h5 text-center py-4 px-4">Share</th>
                                        <th className="h5 text-center py-4 px-4">Download</th>
                                    </tr>
                                </thead>
                                
                                <tbody>
                                    <tr>
                                        <td className="h3 text-left py-4 px-4">User Management</td>
                                        
                                        <td className="text-center">
                                            <input 
                                                type="checkbox"
                                                value="1"
                                                className="w-8 h-8"
                                                {...register("1", { required: false })} />
                                        </td>
                                        
                                        <td className="text-center">
                                            <input 
                                                type="checkbox"
                                                value="2"
                                                className="w-8 h-8"
                                                {...register("1", { required: false })} />
                                        </td>
                                        
                                        <td className="text-center">
                                            <input 
                                                type="checkbox"
                                                value="3"
                                                className="w-8 h-8"
                                                {...register("1", { required: false })} />
                                        </td>
                                        
                                        <td className="text-center">
                                            <input 
                                                type="checkbox"
                                                value="4"
                                                className="w-8 h-8"
                                                {...register("1", { required: false })} />
                                        </td>
                                        
                                        <td className="text-center">
                                            <input 
                                                type="checkbox"
                                                value="5"
                                                className="w-8 h-8"
                                                {...register("1", { required: false })} />
                                        </td>

                                        <td className="text-center">
                                            <input 
                                                type="checkbox"
                                                value="6"
                                                className="w-8 h-8"
                                                {...register("1", { required: false })} />
                                        </td>

                                        <td className="text-center">
                                            <input 
                                                type="checkbox"
                                                value="7"
                                                className="w-8 h-8"
                                                {...register("1", { required: false })} />
                                        </td>

                                        <td className="text-center">
                                            <input 
                                                type="checkbox"
                                                value="8"
                                                className="w-8 h-8"
                                                {...register("1", { required: false })} />
                                        </td>
                                    </tr>

                                    <tr>
                                        <td className="h3 text-left py-4 px-4">Form Builder</td>
                                        
                                        <td className="text-center">
                                            <input 
                                                type="checkbox"
                                                value="1"
                                                className="w-8 h-8"
                                                {...register("2", { required: false })} />
                                        </td>
                                        
                                        <td className="text-center">
                                            <input 
                                                type="checkbox"
                                                value="2"
                                                className="w-8 h-8"
                                                {...register("2", { required: false })} />
                                        </td>
                                        
                                        <td className="text-center">
                                            <input 
                                                type="checkbox"
                                                value="3"
                                                className="w-8 h-8"
                                                {...register("2", { required: false })} />
                                        </td>
                                        
                                        <td className="text-center">
                                            <input 
                                                type="checkbox"
                                                value="4"
                                                className="w-8 h-8"
                                                {...register("2", { required: false })} />
                                        </td>
                                        
                                        <td className="text-center">
                                            <input 
                                                type="checkbox"
                                                value="5"
                                                className="w-8 h-8"
                                                {...register("2", { required: false })} />
                                        </td>

                                        <td className="text-center">
                                            <input 
                                                type="checkbox"
                                                value="6"
                                                className="w-8 h-8"
                                                {...register("2", { required: false })} />
                                        </td>

                                        <td className="text-center">
                                            <input 
                                                type="checkbox"
                                                value="7"
                                                className="w-8 h-8"
                                                {...register("2", { required: false })} />
                                        </td>

                                        <td className="text-center">
                                            <input 
                                                type="checkbox"
                                                value="8"
                                                className="w-8 h-8"
                                                {...register("2", { required: false })} />
                                        </td>
                                    </tr>

                                    <tr>
                                        <td className="h3 text-left py-4 px-4">File Repository</td>
                                        
                                        <td className="text-center">
                                            <input 
                                                type="checkbox"
                                                value="1"
                                                className="w-8 h-8"
                                                {...register("3", { required: false })} />
                                        </td>
                                        
                                        <td className="text-center">
                                            <input 
                                                type="checkbox"
                                                value="2"
                                                className="w-8 h-8"
                                                {...register("3", { required: false })} />
                                        </td>
                                        
                                        <td className="text-center">
                                            <input 
                                                type="checkbox"
                                                value="3"
                                                className="w-8 h-8"
                                                {...register("3", { required: false })} />
                                        </td>
                                        
                                        <td className="text-center">
                                            <input 
                                                type="checkbox"
                                                value="4"
                                                className="w-8 h-8"
                                                {...register("3", { required: false })} />
                                        </td>
                                        
                                        <td className="text-center">
                                            <input 
                                                type="checkbox"
                                                value="5"
                                                className="w-8 h-8"
                                                {...register("3", { required: false })} />
                                        </td>

                                        <td className="text-center">
                                            <input 
                                                type="checkbox"
                                                value="6"
                                                className="w-8 h-8"
                                                {...register("3", { required: false })} />
                                        </td>

                                        <td className="text-center">
                                            <input 
                                                type="checkbox"
                                                value="7"
                                                className="w-8 h-8"
                                                {...register("3", { required: false })} />
                                        </td>

                                        <td className="text-center">
                                            <input 
                                                type="checkbox"
                                                value="8"
                                                className="w-8 h-8"
                                                {...register("3", { required: false })} />
                                        </td>
                                    </tr>

                                    <tr>
                                        <td className="h3 text-left py-4 px-4">Child Enrollment</td>
                                        
                                        <td className="text-center">
                                            <input 
                                                type="checkbox"
                                                value="1"
                                                className="w-8 h-8"
                                                {...register("4", { required: false })} />
                                        </td>
                                        
                                        <td className="text-center">
                                            <input 
                                                type="checkbox"
                                                value="2"
                                                className="w-8 h-8"
                                                {...register("4", { required: false })} />
                                        </td>
                                        
                                        <td className="text-center">
                                            <input 
                                                type="checkbox"
                                                value="3"
                                                className="w-8 h-8"
                                                {...register("4", { required: false })} />
                                        </td>
                                        
                                        <td className="text-center">
                                            <input 
                                                type="checkbox"
                                                value="4"
                                                className="w-8 h-8"
                                                {...register("4", { required: false })} />
                                        </td>
                                        
                                        <td className="text-center">
                                            <input 
                                                type="checkbox"
                                                value="5"
                                                className="w-8 h-8"
                                                {...register("4", { required: false })} />
                                        </td>

                                        <td className="text-center">
                                            <input 
                                                type="checkbox"
                                                value="6"
                                                className="w-8 h-8"
                                                {...register("4", { required: false })} />
                                        </td>

                                        <td className="text-center">
                                            <input 
                                                type="checkbox"
                                                value="7"
                                                className="w-8 h-8"
                                                {...register("4", { required: false })} />
                                        </td>

                                        <td className="text-center">
                                            <input 
                                                type="checkbox"
                                                value="8"
                                                className="w-8 h-8"
                                                {...register("4", { required: false })} />
                                        </td>
                                    </tr>

                                    <tr>
                                        <td className="h3 text-left py-4 px-4">Operating Manual</td>
                                        
                                        <td className="text-center">
                                            <input 
                                                type="checkbox"
                                                value="1"
                                                className="w-8 h-8"
                                                {...register("5", { required: false })} />
                                        </td>
                                        
                                        <td className="text-center">
                                            <input 
                                                type="checkbox"
                                                value="2"
                                                className="w-8 h-8"
                                                {...register("5", { required: false })} />
                                        </td>
                                        
                                        <td className="text-center">
                                            <input 
                                                type="checkbox"
                                                value="3"
                                                className="w-8 h-8"
                                                {...register("5", { required: false })} />
                                        </td>
                                        
                                        <td className="text-center">
                                            <input 
                                                type="checkbox"
                                                value="4"
                                                className="w-8 h-8"
                                                {...register("5", { required: false })} />
                                        </td>
                                        
                                        <td className="text-center">
                                            <input 
                                                type="checkbox"
                                                value="5"
                                                className="w-8 h-8"
                                                {...register("5", { required: false })} />
                                        </td>

                                        <td className="text-center">
                                            <input 
                                                type="checkbox"
                                                value="6"
                                                className="w-8 h-8"
                                                {...register("5", { required: false })} />
                                        </td>

                                        <td className="text-center">
                                            <input 
                                                type="checkbox"
                                                value="7"
                                                className="w-8 h-8"
                                                {...register("5", { required: false })} />
                                        </td>

                                        <td className="text-center">
                                            <input 
                                                type="checkbox"
                                                value="8"
                                                className="w-8 h-8"
                                                {...register("5", { required: false })} />
                                        </td>
                                    </tr>
                                    
                                    <tr>
                                        <td className="h3 text-left py-4 px-4">Training Files</td>
                                        
                                        <td className="text-center">
                                            <input 
                                                type="checkbox"
                                                value="1"
                                                className="w-8 h-8"
                                                {...register("6", { required: false })} />
                                        </td>
                                        
                                        <td className="text-center">
                                            <input 
                                                type="checkbox"
                                                value="2"
                                                className="w-8 h-8"
                                                {...register("6", { required: false })} />
                                        </td>
                                        
                                        <td className="text-center">
                                            <input 
                                                type="checkbox"
                                                value="3"
                                                className="w-8 h-8"
                                                {...register("6", { required: false })} />
                                        </td>
                                        
                                        <td className="text-center">
                                            <input 
                                                type="checkbox"
                                                value="4"
                                                className="w-8 h-8"
                                                {...register("6", { required: false })} />
                                        </td>
                                        
                                        <td className="text-center">
                                            <input 
                                                type="checkbox"
                                                value="5"
                                                className="w-8 h-8"
                                                {...register("6", { required: false })} />
                                        </td>

                                        <td className="text-center">
                                            <input 
                                                type="checkbox"
                                                value="6"
                                                className="w-8 h-8"
                                                {...register("6", { required: false })} />
                                        </td>

                                        <td className="text-center">
                                            <input 
                                                type="checkbox"
                                                value="7"
                                                className="w-8 h-8"
                                                {...register("6", { required: false })} />
                                        </td>

                                        <td className="text-center">
                                            <input 
                                                type="checkbox"
                                                value="8"
                                                className="w-8 h-8"
                                                {...register("6", { required: false })} />
                                        </td>
                                    </tr>

                                    <tr>
                                        <td className="h3 text-left py-4 px-4">Form Management</td>
                                        
                                        <td className="text-center">
                                            <input 
                                                type="checkbox"
                                                value="1"
                                                className="w-8 h-8"
                                                {...register("7", { required: false })} />
                                        </td>
                                        
                                        <td className="text-center">
                                            <input 
                                                type="checkbox"
                                                value="2"
                                                className="w-8 h-8"
                                                {...register("7", { required: false })} />
                                        </td>
                                        
                                        <td className="text-center">
                                            <input 
                                                type="checkbox"
                                                value="3"
                                                className="w-8 h-8"
                                                {...register("7", { required: false })} />
                                        </td>
                                        
                                        <td className="text-center">
                                            <input 
                                                type="checkbox"
                                                value="4"
                                                className="w-8 h-8"
                                                {...register("7", { required: false })} />
                                        </td>
                                        
                                        <td className="text-center">
                                            <input 
                                                type="checkbox"
                                                value="5"
                                                className="w-8 h-8"
                                                {...register("7", { required: false })} />
                                        </td>

                                        <td className="text-center">
                                            <input 
                                                type="checkbox"
                                                value="6"
                                                className="w-8 h-8"
                                                {...register("7", { required: false })} />
                                        </td>

                                        <td className="text-center">
                                            <input 
                                                type="checkbox"
                                                value="7"
                                                className="w-8 h-8"
                                                {...register("7", { required: false })} />
                                        </td>

                                        <td className="text-center">
                                            <input 
                                                type="checkbox"
                                                value="8"
                                                className="w-8 h-8"
                                                {...register("7", { required: false })} />
                                        </td>
                                    </tr>
                                    
                                    <tr>
                                        <td className="h3 text-left py-4 px-4">Notification Management</td>
                                        
                                        <td className="text-center">
                                            <input 
                                                type="checkbox"
                                                value="1"
                                                className="w-8 h-8"
                                                {...register("8", { required: false })} />
                                        </td>
                                        
                                        <td className="text-center">
                                            <input 
                                                type="checkbox"
                                                value="2"
                                                className="w-8 h-8"
                                                {...register("8", { required: false })} />
                                        </td>
                                        
                                        <td className="text-center">
                                            <input 
                                                type="checkbox"
                                                value="3"
                                                className="w-8 h-8"
                                                {...register("8", { required: false })} />
                                        </td>
                                        
                                        <td className="text-center">
                                            <input 
                                                type="checkbox"
                                                value="4"
                                                className="w-8 h-8"
                                                {...register("8", { required: false })} />
                                        </td>
                                        
                                        <td className="text-center">
                                            <input 
                                                type="checkbox"
                                                value="5"
                                                className="w-8 h-8"
                                                {...register("8", { required: false })} />
                                        </td>

                                        <td className="text-center">
                                            <input 
                                                type="checkbox"
                                                value="6"
                                                className="w-8 h-8"
                                                {...register("8", { required: false })} />
                                        </td>

                                        <td className="text-center">
                                            <input 
                                                type="checkbox"
                                                value="7"
                                                className="w-8 h-8"
                                                {...register("8", { required: false })} />
                                        </td>

                                        <td className="text-center">
                                            <input 
                                                type="checkbox"
                                                value="8"
                                                className="w-8 h-8"
                                                {...register("8", { required: false })} />
                                        </td>
                                    </tr>
                                    
                                    <tr>
                                        <td className="h3 text-left py-4 px-4">Franchisee Management</td>
                                        
                                        <td className="text-center">
                                            <input 
                                                type="checkbox"
                                                value="1"
                                                className="w-8 h-8"
                                                {...register("9", { required: false })} />
                                        </td>
                                        
                                        <td className="text-center">
                                            <input 
                                                type="checkbox"
                                                value="2"
                                                className="w-8 h-8"
                                                {...register("9", { required: false })} />
                                        </td>
                                        
                                        <td className="text-center">
                                            <input 
                                                type="checkbox"
                                                value="3"
                                                className="w-8 h-8"
                                                {...register("9", { required: false })} />
                                        </td>
                                        
                                        <td className="text-center">
                                            <input 
                                                type="checkbox"
                                                value="4"
                                                className="w-8 h-8"
                                                {...register("9", { required: false })} />
                                        </td>
                                        
                                        <td className="text-center">
                                            <input 
                                                type="checkbox"
                                                value="5"
                                                className="w-8 h-8"
                                                {...register("9", { required: false })} />
                                        </td>

                                        <td className="text-center">
                                            <input 
                                                type="checkbox"
                                                value="6"
                                                className="w-8 h-8"
                                                {...register("9", { required: false })} />
                                        </td>

                                        <td className="text-center">
                                            <input 
                                                type="checkbox"
                                                value="7"
                                                className="w-8 h-8"
                                                {...register("9", { required: false })} />
                                        </td>

                                        <td className="text-center">
                                            <input 
                                                type="checkbox"
                                                value="8"
                                                className="w-8 h-8"
                                                {...register("9", { required: false })} />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>

                            {/* SUBMIT SECTION */}
                            <div className="flex justify-center items-center mt-10 p-5">
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