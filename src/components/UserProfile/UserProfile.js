import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../context/UserContext';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

import { addUser, getAllUsers } from '../../Service/UsersService';
import { getTasksByUserId } from '../../Service/TasksService';


const UserProfile = () => {
    const [users, setUsers] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const { user } = useContext(UserContext);

    useEffect(() => {
        if (user) {
            getAllUsers()
                .then(res => {
                    if (user.role === 'admin') {
                        setUsers(res.data.filter(u => u?.role !== 'admin'));
                    } else {
                        setSelectedUser(user);
                    }
                })
                .catch(err => console.log(err));
        }
    }, [user]);

    useEffect(() => {
        if (user?.id) {
            fetchTasks(user.id);
        }
    }, [user]);

    const fetchTasks = (userId) => {
        getTasksByUserId(userId)
            .then(res => setTasks(res.data))
            .catch(err => console.log('Error fetching tasks:', err));
    };

    const handleGetHistory = (userId) => {
        fetchTasks(userId);

        setSelectedUser(users.find(u => u?.id === userId));

    };

    const handleAddUser = (values) => {
        const payload = {
            name: values.name,
            email: values.email,
            password: values.password,
            role: values.role
        };
        addUser(payload)
            .then(() => {
                return getAllUsers();
            })
            .then(res => {
                setUsers(res.data.filter(u => u?.role !== 'admin'));
                setShowForm(false);
            })
            .catch(err => console.log('Error adding user:', err));
    };

    return (
        <div>
            <h2>User Profiles</h2>
            {user?.role === 'admin' && (
                <div>
                    <button onClick={() => setShowForm(!showForm)}>
                        {showForm ? "Cancel" : 'Add New User'}
                    </button>
                    {showForm && (
                        <Formik
                            initialValues={{
                                name: '',
                                email: '',
                                password: '',
                                role: 'employee'
                            }}
                            onSubmit={(values, { resetForm }) => {
                                handleAddUser(values);
                                resetForm();
                            }}
                            validationSchema={Yup.object({
                                name: Yup.string().required('Required'),
                                email: Yup.string().email('Invalid email format').required('Required'),
                                password: Yup.string().required('Required'),
                                role: Yup.string().required('Required')
                            })}
                        >
                            {formik => (
                                <Form id='addUserForm'>
                                    <label htmlFor="name">Name</label>
                                    <Field type="text" id="name" name="name" />
                                    <ErrorMessage name="name" component="div" />

                                    <label htmlFor="email">Email</label>
                                    <Field type="email" id="email" name="email" />
                                    <ErrorMessage name="email" component="div" />

                                    <label htmlFor="password">Password</label>
                                    <Field type="password" id="password" name="password" />
                                    <ErrorMessage name="password" component="div" />

                                    <label htmlFor="role">Role</label>
                                    <Field as="select" id="role" name="role">
                                        <option value="employee">Employee</option>
                                        <option value="admin">Admin</option>
                                    </Field>
                                    <ErrorMessage name="role" component="div" />

                                    <button type="submit" disabled={!(formik.isValid && formik.dirty)}>
                                        Create User
                                    </button>
                                </Form>
                            )}
                        </Formik>
                    )}

                    <ul>
                        {users.map(user => (
                            <li key={user?.id}>
                                <strong>Name:</strong> {user?.name}<br />
                                <strong>Email:</strong> {user?.email}<br />
                                <button onClick={() => handleGetHistory(user?.id)}>Get History</button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {selectedUser && (

                <div>
                        <h3 className='text-center'>Tasks Worked By {selectedUser.name}</h3>
                        {
                            tasks.length > 0 ? (
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Title</th>
                                            <th>Description</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {tasks.map(task => (
                                            <tr key={task.id}>
                                                <td>{task.title}</td>
                                                <td>{task.description}</td>
                                                <td>{task.status}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : <p>No tasks found for {selectedUser.name}</p>
                        }
                    </div>

            )}
        </div>
    );
};

export default UserProfile;
