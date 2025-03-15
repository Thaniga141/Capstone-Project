import React, { useContext, useEffect } from 'react';
import { UserContext } from '../../context/UserContext';
import { Field, Formik, ErrorMessage, Form } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';

import { getUserByEmailAndPassword } from '../../Service/UsersService';


const Login = () => {

    const { login } = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (sessionStorage.getItem('user')) {
            navigate('/profiles');
        }
    }, [navigate]);

    const handleLogin = (values) => {
        const { email, password } = values;
        getUserByEmailAndPassword(email, password)
            .then((response) => {
                if (response.data.length > 0) {
                    const user = response.data[0];
                    login(user);
                    if (user.role === 'admin') {
                        navigate('/');
                    }
                    else {
                        navigate('/profiles');
                    }
                } else {
                    alert('Invalid email or password');
                }
            }).catch((error) => {
                console.error('Error logging in:', error);
            });
    }
    return (
        <div>
            <h2>Login</h2>
            <Formik
                initialValues={{ email: '', password: '' }}
                onSubmit={(values, { resetForm }) => {
                    handleLogin(values);
                    resetForm();
                }}
                validationSchema={Yup.object().shape({
                    email: Yup.string().email("Please include an '@'").required('Email is required'),
                    password: Yup.string().required('Password is required')
                })}
            >
                {
                    (formik) => {
                        return (
                            <Form id="loginForm">
                                <label>
                                    Email:
                                    <Field type="email" name="email" onChange={formik.handleChange} required />
                                    <ErrorMessage name="email" component="div" style={{ color: "red" }} />
                                </label>
                                <label>
                                    Password:
                                    <Field type="password" name="password" onChange={formik.handleChange} required />
                                    <ErrorMessage name="password" component="div" style={{ color: "red" }} />
                                </label>
                                <button type="submit" disabled={!(formik.isValid && formik.dirty)}>Login</button>

                            </Form>);
                    }
                }

            </Formik>
            <button onClick={() => navigate('/signup')}>Sign Up</button>
        </div>
    );
};

export default Login;
