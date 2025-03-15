import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import React, { useState, useContext, useEffect } from 'react';
import { UserContext } from '../../context/UserContext';
import ScrumDetails from '../Scrum Details/ScrumDetails';

import { addScrum, getAllScrums, getScrumsById } from '../../Service/ScrumsService';
import { getAllUsers } from '../../Service/UsersService';
import { addTask } from '../../Service/TasksService';


const Dashboard = () => {

    const [scrums, setScrums] = useState([]);
    const [selectedScrum, setSelectedScrum] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [users, setUsers] = useState([]);
    const { user } = useContext(UserContext);

    useEffect(() => {
        getAllScrums().then(res => setScrums(res.data)).catch(err => console.log(err));

        getAllUsers().then(res => setUsers(res.data)).catch(err => console.log(err));

    }, []);

    const handleGetDetails = (scrumId) => {
        getScrumsById(scrumId).then(res => setSelectedScrum(res.data)).catch(err => console.log(err));
    }
    const handleAddScrum = (values) => {

        let existingScrum = scrums.find(scrum => scrum.name === values.name);

        if (existingScrum) {
            const taskPayload = {
                title: values.title,
                description: values.description,
                assignedTo: values.assignedTo,
                status: values.status,
                scrumId: existingScrum.id,
                history: [{
                    status: values.status,
                    date: new Date().toISOString().split("T")[0],
                }],
            };
            addTask(taskPayload)
                .then(() => setShowForm(false))
                .catch(err => console.log(err));

        } else {
            const scrumPayload = {
                name: values.name,
            };

            addScrum(scrumPayload)
                .then(res => {
                    const newScrum = res.data;

                    const taskPayload = {
                        title: values.title,
                        description: values.description,
                        assignedTo: values.assignedTo,
                        status: values.status,
                        scrumId: newScrum.id,
                        history: [{
                            status: values.status,
                            date: new Date().toISOString().split("T")[0],
                        }],
                    };

                    return addTask(taskPayload);
                })
                .then(() => getAllScrums())
                .then(res => {
                    setScrums(res.data);
                    setShowForm(false);
                })
                .catch(err => console.log(err));
        }


    };
    return (

        <div>
            <h2>Scrum Teams</h2>
            {user?.role === 'admin' && (
                <div>
                    <button onClick={() => setShowForm(!showForm)}>{showForm ? 'Cancel' : 'Add New Scrum'}</button>

                    {showForm && (
                        <Formik
                            initialValues={{
                                name: '',
                                title: '',
                                description: '',
                                assignedTo: '',
                                status: 'To Do',
                            }}
                            validationSchema={Yup.object({
                                name: Yup.string().required('Required Name'),
                                title: Yup.string().required('Required Title'),
                                description: Yup.string().required('Required Description'),
                                assignedTo: Yup.string().required('Required Assigned To'),

                            })}
                            onSubmit={(values, { resetForm }) => {
                                handleAddScrum(values);
                                resetForm();
                            }}

                        >
                            {
                                (formik) => (
                                    <Form id="addScrumForm">
                                        <label htmlFor="name">Name</label>
                                        <Field name="name" type="text" id="name" />
                                        <ErrorMessage name="name" component="div" />

                                        <label htmlFor="title">Title</label>
                                        <Field name="title" type="text" id="title" />
                                        <ErrorMessage name="title" component="div" />

                                        <label htmlFor="description">Description</label>
                                        <Field name="description" type="text" id="description" />
                                        <ErrorMessage name="description" component="div" />

                                        <label htmlFor="status">Status</label>
                                        <Field name="status" as="select" id="status">
                                            <option value="To Do">To Do</option>
                                            <option value="In Progress">In Progress</option>
                                            <option value="Done">Done</option>
                                        </Field>
                                        <ErrorMessage name="status" component="div" />

                                        <label htmlFor="assignedTo">Assigned To</label>
                                        <Field name="assignedTo" as="select" id="assignedTo">
                                            <option value="">Select a user</option>
                                            {users.filter(u => u.role !== 'admin').map(u => (
                                                <option key={u.id} value={u.id}>{u.name}</option>
                                            ))}</Field>
                                        <ErrorMessage name="assignedTo" component="div" />

                                        <button type="submit" disabled={!(formik.isValid && formik.dirty)}>Create Scrum</button>

                                    </Form>
                                )
                            }
                        </Formik>
                    )}
                </div>
            )}
            <ul>
                {scrums.map(scrum => (
                    <li key={scrum.id}>
                        {scrum.name}
                        <button onClick={() => handleGetDetails(scrum.id)}>Get Details</button>
                    </li>
                ))}
            </ul>
            {selectedScrum && <ScrumDetails scrum={selectedScrum} />}
        </div>
    );
};

export default Dashboard;
