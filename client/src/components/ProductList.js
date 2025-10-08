import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap CSS is imported
import { Button, Card, Row, Col } from 'react-bootstrap'; // Import Bootstrap components for layout

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);  // Handle error state
  const [successMessage, setSuccessMessage] = useState(''); // Success message state
  const token = localStorage.getItem('token');  // Ensure JWT token is retrieved

  useEffect(() => {
    // Fetch products without requiring authentication
    axios
      .get(`${process.env.REACT_APP_API_URL}/products`)
      .then((response) => {
        setProducts(response.data); // Set products state
      })
      .catch((error) => {
        setError('Failed to fetch products');
        console.error('Error fetching products:', error);
      });
  }, []);

  const handleAddToCart = async (productId) => {
    if (!token) {
      setError('Please log in to add items to cart.');
      return;
    }

    try {
      // Make the request to add product to cart
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/cart`,
        { product_id: productId, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Success: Show success message and reset error
      setSuccessMessage('Product added to cart successfully!');
      setError(null);
    } catch (error) {
      // Handle error when adding to cart
      setError('Failed to add to cart.');
      console.error('Error adding to cart:', error);
    }
  };

  if (error) {
    return <div className="alert alert-danger text-center">{error}</div>;  // Show error message if fetching fails
  }

  if (successMessage) {
    return <div className="alert alert-success text-center">{successMessage}</div>;  // Show success message after order placement
  }

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Product List</h2>
      
      {/* Check if products are available */}
      {products.length === 0 ? (
        <div className="alert alert-info text-center">No products available.</div>
      ) : (
        <Row>
          {products.map((product) => (
            <Col key={product.id} md={4} className="mb-4">
              <Card>
                <Card.Body>
                  <Card.Title>{product.name}</Card.Title>
                  <Card.Text>
                    KSh {product.price}
                  </Card.Text>
                  <div className="d-flex justify-content-between">
                    {/* Edit and Delete buttons removed for simplicity */}
                    <Button 
                      variant="primary" 
                      size="sm" 
                      onClick={() => handleAddToCart(product.id)}
                    >
                      Add to Cart
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default ProductList;
