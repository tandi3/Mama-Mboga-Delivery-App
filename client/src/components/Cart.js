import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");
    axios
      .get(`${process.env.REACT_APP_API_URL}/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setCartItems(response.data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        setError("Failed to load cart items.");
      });
  }, [navigate]);

  const handlePlaceOrder = () => {
    const token = localStorage.getItem("token");
    const cartItemsData = cartItems.map((item) => ({
      product_id: item.product_id,
      quantity: item.quantity,
    }));
    axios
      .post(
        `${process.env.REACT_APP_API_URL}/order`,
        { cart_items: cartItemsData },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => navigate("/orders"))
      .catch(() => setError("Failed to place order."));
  };

  const calculateTotalPrice = () =>
    cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  if (loading)
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status"></div>
      </div>
    );

  if (error)
    return (
      <div className="alert alert-danger text-center my-4" role="alert">
        {error}
      </div>
    );

  return (
    <div className="container my-5">
      <div className="card shadow-lg p-4">
        <h2 className="text-center mb-4">🛒 Your Cart</h2>
        {cartItems.length === 0 ? (
          <p className="text-center text-muted">Your cart is empty.</p>
        ) : (
          <>
            <ul className="list-group mb-3">
              {cartItems.map((item) => (
                <li
                  key={item.id}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  <div>
                    <h6 className="my-0">{item.product_name}</h6>
                    <small className="text-muted">Quantity: {item.quantity}</small>
                  </div>
                  <span className="text-success fw-bold">
                    KSh {item.price * item.quantity}
                  </span>
                </li>
              ))}
            </ul>

            <div className="d-flex justify-content-between align-items-center border-top pt-3">
              <h4>Total</h4>
              <h4 className="text-primary">KSh {calculateTotalPrice()}</h4>
            </div>

            <div className="text-center mt-4">
              <button
                className="btn btn-success btn-lg px-5"
                onClick={handlePlaceOrder}
              >
                Place Order
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;