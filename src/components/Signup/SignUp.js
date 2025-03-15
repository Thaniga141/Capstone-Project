import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

import { addUser } from '../../Service/UsersService';

const SignUp = () => {

    const navigate = useNavigate();

    const handleSignUp = (values) => {
        const payload = {
            name: values.name,
            email: values.email,
            password: values.password,
            role: 'employee'
        }
        addUser(payload)
            .then((response) => {
                console.log(response);
                navigate('/login');
            })
            .catch((error) => {
                console.log(error);
            });
    };

    return (
        <div>
            <h2>Sign Up</h2>
            <Formik
                initialValues={{ name: '', email: '', password: '' }}
                onSubmit={(values) => {
                    handleSignUp(values);
                }}
                validationSchema={Yup.object({
                    name: Yup.string()
                        .required('Required'),
                    email: Yup.string()
                        .email("Please include an '@'")
                        .required('Required'),
                    password: Yup.string()
                        .required('Required')
                        .min(8, 'Password is too short - should be 8 chars minimum')
                })}

            >
                {
                    (formik) => {
                        return (
                            <Form id='signUpForm'>
                                <label htmlFor="name">Name</label>
                                <Field type="text" id="name" name="name" />
                                <ErrorMessage name="name" component="div" />
                                <label htmlFor="email">Email</label>
                                <Field type="email" id="email" name="email" />
                                <ErrorMessage name="email" component="div" />
                                <label htmlFor="password">Password</label>
                                <Field type="password" id="password" name="password" />
                                <ErrorMessage name="password" component="div" />
                                <button type="submit" disabled={!(formik.isValid && formik.dirty)}>Sign Up</button>
                            </Form>)
                    }
                }


            </Formik>
        </div>
    );
};

export default SignUp;
