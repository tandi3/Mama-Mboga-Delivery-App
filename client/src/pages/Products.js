import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Products = ({ searchQuery }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantities, setQuantities] = useState({});

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/products`)
      .then((response) => { setProducts(response.data); setLoading(false); })
      .catch(() => { setLoading(false); toast.error('Failed to fetch products!'); });
  }, []);

  const handleAddToCart = (productId) => {
    const token = localStorage.getItem('token');
    const quantity = quantities[productId] || 1;

    if (!token) { toast.error('Please log in to add items to your cart'); return; }
    if (quantity <= 0 || isNaN(quantity)) { toast.error('Quantity must be a positive integer'); return; }
    axios.post(
      `${process.env.REACT_APP_API_URL}/cart`, 
      { product_id: productId, quantity }, 
      { 
        headers: { 
          'Content-Type': 'application/json', 
          Authorization: `Bearer ${token}` 
        } 
      }
    )
      .then(() => { toast.success('Item added to cart!'); setQuantities(prev => ({ ...prev, [productId]: 1 })); })
      .catch(() => { toast.error('Failed to add item to cart'); });
  };

  const handleQuantityChange = (productId, quantity) => setQuantities(prev => ({ ...prev, [productId]: quantity }));

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Products</h2>
      <div className="row">
        {products.filter(product => product.name.toLowerCase().includes(searchQuery.toLowerCase()))
          .map(product => (
            <div key={product.id} className="col-md-4 mb-4">
              <div className="card shadow-lg">
                <div className="card-body">
                  <h5 className="card-title">{product.name}</h5>
                  <p className="card-text">{product.description}</p>
                  <p className="card-text"><strong>KSh {product.price}</strong></p>
                  <div className="d-flex justify-content-between">
                    <input type="number" value={quantities[product.id] || 1} onChange={(e) => handleQuantityChange(product.id, +e.target.value)} min="1" className="form-control w-25" />
                    <button className="btn btn-success btn-sm" onClick={() => handleAddToCart(product.id)}>
                      <FontAwesomeIcon icon={faShoppingCart} /> Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Products;
