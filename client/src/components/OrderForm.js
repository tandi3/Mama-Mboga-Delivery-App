import { Formik, Field, Form, ErrorMessage } from 'formik';
import axios from 'axios';
import { useEffect, useState } from 'react';
import * as Yup from 'yup';

const OrderForm = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token) {
      axios
        .get(`${process.env.REACT_APP_API_URL}/products`, { headers: { Authorization: `Bearer ${token}` } })
        .then((response) => setProducts(response.data))
        .catch(() => setError('Failed to fetch products. Please try again.'));
    } else {
      setError('Please log in to place an order.');
    }
  }, [token]);

  const handleSubmit = async (values) => {
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/order`, values, { headers: { Authorization: `Bearer ${token}` } });
      alert('Order placed successfully!');
    } catch {
      alert('Error placing order. Please try again.');
    }
  };

  if (error) return <div className="alert alert-danger text-center">{error}</div>;

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow-lg">
            <div className="card-header bg-primary text-white text-center"><h3>Place an Order</h3></div>
            <div className="card-body">
              <Formik
                initialValues={{ product_id: '', quantity: 1 }}
                validationSchema={Yup.object({
                  product_id: Yup.string().required('Product is required'),
                  quantity: Yup.number().required('Quantity is required').positive('Quantity must be positive'),
                })}
                onSubmit={handleSubmit}
              >
                <Form>
                  <div className="mb-3">
                    <label htmlFor="product_id" className="form-label">Product</label>
                    <Field as="select" name="product_id" className="form-control">
                      <option value="">Select Product</option>
                      {products.map((product) => (
                        <option key={product.id} value={product.id}>{product.name} - KSh {product.price}</option>
                      ))}
                    </Field>
                    <ErrorMessage name="product_id" component="div" className="text-danger" />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="quantity" className="form-label">Quantity</label>
                    <Field type="number" name="quantity" min="1" className="form-control" placeholder="Enter quantity" />
                    <ErrorMessage name="quantity" component="div" className="text-danger" />
                  </div>
                  <button type="submit" className="btn btn-success w-100 mt-3">Place Order</button>
                </Form>
              </Formik>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderForm;
