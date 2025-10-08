import { Formik, Field, Form, ErrorMessage } from 'formik';
import axios from 'axios';
import * as Yup from 'yup';

const Register = () => {
  const handleSubmit = async (values) => {
    try {
      // Send the request with Content-Type: application/json
      await axios.post(`${process.env.REACT_APP_API_URL}/register`, values, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      alert('Registration successful!');
    } catch (error) {
      console.error('Registration failed:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Registration failed';
      alert('Registration failed: ' + errorMessage);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <div className="card shadow-lg p-4" style={{ width: '400px' }}>
        <h3 className="text-center mb-4">Register</h3>
        <Formik
          initialValues={{ email: '', password: '', confirmPassword: '', role: '' }} // Removed username field
          validationSchema={Yup.object({
            email: Yup.string().email('Invalid email').required('Email is required'),
            password: Yup.string().required('Password is required'),
            confirmPassword: Yup.string()
              .oneOf([Yup.ref('password'), null], 'Passwords must match')
              .required('Confirm Password is required'),
            role: Yup.string().required('Role is required'), // Role validation
          })}
          onSubmit={handleSubmit}
        >
          <Form>
            {/* Email */}
            <div className="mb-3">
              <div className="input-group">
                <Field
                  type="email"
                  name="email"
                  className="form-control"
                  placeholder="Email"
                />
              </div>
              <ErrorMessage name="email" component="div" className="text-danger mt-1" />
            </div>

            {/* Password */}
            <div className="mb-3">
              <div className="input-group">
                <Field
                  type="password"
                  name="password"
                  className="form-control"
                  placeholder="Password"
                />
              </div>
              <ErrorMessage name="password" component="div" className="text-danger mt-1" />
            </div>

            {/* Confirm Password */}
            <div className="mb-3">
              <div className="input-group">
                <Field
                  type="password"
                  name="confirmPassword"
                  className="form-control"
                  placeholder="Confirm Password"
                />
              </div>
              <ErrorMessage name="confirmPassword" component="div" className="text-danger mt-1" />
            </div>

            {/* Role */}
            <div className="mb-3">
              <div className="input-group">
                <Field
                  as="select"
                  name="role"
                  className="form-control"
                >
                  <option value="">Select Role</option>
                  <option value="customer">Customer</option>
                  <option value="vendor">Vendor</option>
                </Field>
              </div>
              <ErrorMessage name="role" component="div" className="text-danger mt-1" />
            </div>

            {/* Submit Button */}
            <div className="d-grid gap-2">
              <button type="submit" className="btn btn-primary">
                Register
              </button>
            </div>
          </Form>
        </Formik>
      </div>
    </div>
  );
};

export default Register;
