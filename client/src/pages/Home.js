import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const Home = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <div
      className="min-vh-100 d-flex flex-column"
      style={{
        backgroundImage:
          "url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTpJcWD0UmptUU4tFFcCBjVOQhoFN1RFfddA&s')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "relative",
      }}
    >
      {/* Dark overlay */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.6)",
          zIndex: 1,
        }}
      ></div>

      {/* Page content */}
      <div className="container text-white py-5" style={{ zIndex: 2 }}>
        <div className="text-center mb-5">
          <h1 className="display-3 fw-bold text-success">
            Welcome to Mama Mboga!
          </h1>
          <p className="lead">
            Fresh vegetables, fruits, and groceries delivered to your doorstep.
          </p>
        </div>

        <div className="row justify-content-center text-center">
          {/* Shop option */}
          <div className="col-lg-4 col-md-6 mb-4">
            <div
              className="p-4 rounded-4 shadow-lg"
              style={{
                background: "rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(8px)",
              }}
            >
              <h5 className="fw-bold text-success">Browse Products</h5>
              <p className="text-light">
                Explore a variety of fresh produce and add them to your cart.
              </p>
              <Link
                to="/products"
                className="btn btn-success btn-lg px-4 py-2 rounded-pill"
              >
                Shop Now
              </Link>
            </div>
          </div>

          {/* Orders option */}
          <div className="col-lg-4 col-md-6 mb-4">
            <div
              className="p-4 rounded-4 shadow-lg"
              style={{
                background: "rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(8px)",
              }}
            >
              <h5 className="fw-bold text-primary">Track Your Delivery</h5>
              <p className="text-light">
                Stay updated on your order progress with real-time tracking.
              </p>
              <Link
                to="/orders"
                className="btn btn-primary btn-lg px-4 py-2 rounded-pill"
              >
                Track Delivery
              </Link>
            </div>
          </div>
        </div>

        {/* Auth Section */}
        <div className="text-center mt-5">
          {!isLoggedIn ? (
            <>
              <h3 className="fw-bold mb-3 text-info">Join Us Today!</h3>
              <Link
                to="/login"
                className="btn btn-info btn-lg px-4 py-2 rounded-pill"
              >
                Login / Register
              </Link>
            </>
          ) : (
            <>
              <h3 className="fw-bold mb-3 text-light">Welcome Back!</h3>
              <button
                className="btn btn-danger btn-lg px-4 py-2 rounded-pill"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;