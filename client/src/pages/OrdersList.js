// OrdersList.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTruck,
  faCheckCircle,
  faTimesCircle,
} from "@fortawesome/free-solid-svg-icons";

const OrdersList = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      setError("Please log in to view your orders.");
      setLoading(false);
      navigate("/login");
      return;
    }

    axios
      .get("http://localhost:5000/orders", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setOrders(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching orders:", error);
        if (error.response && error.response.status === 401) {
          setError("Unauthorized access. Please log in again.");
          navigate("/login");
        } else if (error.response && error.response.status === 403) {
          setError("Forbidden access. You do not have permission to view these orders.");
        } else {
          setError("Failed to fetch orders. Please try again later.");
        }
        setLoading(false);
      });
  }, [token, navigate]);

  const handleViewDetails = (orderId) => {
    navigate(`/order-details/${orderId}`);
  };

  const handleCheckout = () => {
    navigate("/checkout");
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="alert alert-danger text-center mt-5">{error}</div>;
  }

  return (
    <div className="container my-5">
      <div className="card shadow-lg p-4">
        <h2 className="text-center mb-4">📦 Your Orders</h2>

        {orders.length === 0 ? (
          <div className="alert alert-info text-center">
            You have no orders yet.
          </div>
        ) : (
          <div className="list-group">
            {orders.map((order) => (
              <div
                key={order.id}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                <div>
                  <h5 className="mb-1">Order #{order.id}</h5>
                  <p className="mb-1">
                    <strong>Status:</strong> {order.status}
                  </p>
                </div>
                <div className="d-flex align-items-center">
                  <FontAwesomeIcon
                    icon={
                      order.status === "Delivered"
                        ? faCheckCircle
                        : order.status === "In Transit"
                        ? faTruck
                        : faTimesCircle
                    }
                    className={`me-3 ${
                      order.status === "Delivered"
                        ? "text-success"
                        : order.status === "In Transit"
                        ? "text-primary"
                        : "text-danger"
                    }`}
                    size="2x"
                  />
                  <button
                    className="btn btn-outline-info btn-sm me-2"
                    onClick={() => handleViewDetails(order.id)}
                  >
                    View Details
                  </button>
                  <button
                    className="btn btn-success btn-sm"
                    onClick={handleCheckout}
                  >
                    Checkout
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersList;
