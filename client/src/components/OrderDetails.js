// OrderDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const OrderDetails = () => {
  const { id } = useParams(); // Get the order id from the URL
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please log in to view order details.');
      setLoading(false);
      return;
    }
    axios
      .get(`${process.env.REACT_APP_API_URL}/order/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setOrder(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching order details:', error);
        toast.error('Failed to fetch order details');
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!order) return <div>No order found.</div>;

  return (
    <div className="container mt-5">
      <h2>Order Details for Order #{order.id}</h2>
      <p><strong>Status:</strong> {order.status}</p>
      <p><strong>Product:</strong> {order.product_name}</p>
      <p><strong>Delivery:</strong> {order.delivery_status}</p>
      {/* Render additional details as needed */}
    </div>
  );
};

export default OrderDetails;