import React from "react";

const Checkout = () => {
  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div
        className="card shadow-lg p-5 text-center"
        style={{ maxWidth: "500px" }}
      >
        <h2 className="mb-4 text-success">🎉 Thank You for Shopping with Us!</h2>
        <p className="text-muted">
          Your order has been placed successfully. We’ll start processing your
          delivery right away.
        </p>
      </div>
    </div>
  );
};

export default Checkout;
