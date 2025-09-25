import React, { useState, useEffect } from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import 'bootstrap/dist/css/bootstrap.min.css';

const Login = () => {
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState('');

  useEffect(() => {
    if (localStorage.getItem('token')) navigate('/products');
  }, [navigate]);

  const handleSubmit = async (values) => {
    try {
      const response = await axios.post('http://localhost:5000/login', values);
      localStorage.setItem('token', response.data.token);
      navigate('/products');
    } catch (error) {
      setLoginError(error.response?.data?.message || 'Invalid credentials');
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow-lg">
            <div className="card-header bg-primary text-white text-center"><h3>Login</h3></div>
            <div className="card-body">
              {loginError && <div className="alert alert-danger">{loginError}</div>}
              <Formik
                initialValues={{ email: '', password: '' }}
                validationSchema={Yup.object({
                  email: Yup.string().email('Invalid email').required('Required'),
                  password: Yup.string().required('Required'),
                })}
                onSubmit={handleSubmit}
              >
                <Form>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <Field type="email" name="email" id="email" className="form-control" />
                    <ErrorMessage name="email" component="div" className="text-danger" />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <Field type="password" name="password" id="password" className="form-control" />
                    <ErrorMessage name="password" component="div" className="text-danger" />
                  </div>
                  <button type="submit" className="btn btn-primary w-100 mt-3">Login</button>
                </Form>
              </Formik>
            </div>
            <div className="card-footer text-center">
              <p>Don't have an account? <a href="/register" className="text-primary">Sign Up</a></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
