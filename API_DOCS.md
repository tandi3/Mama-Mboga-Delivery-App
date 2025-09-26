# Mama Mboga Delivery API Documentation

## Authentication Endpoints

### POST /register
Register a new customer account.
- **Body**: `{"email": "string", "password": "string", "role": "customer"}`
- **Response**: `{"message": "User created successfully"}`

### POST /login
Login to get access token.
- **Body**: `{"email": "string", "password": "string"}`
- **Response**: `{"token": "jwt_token"}`

## Product Endpoints

### GET /products
Get all available products.
- **Response**: Array of products with id, name, description, price

## Cart Endpoints

### POST /cart
Add product to cart (requires authentication).
- **Body**: `{"product_id": "number", "quantity": "number"}`

### GET /cart
Get current user's cart items (requires authentication).

### DELETE /cart/{product_id}
Remove product from cart (requires authentication).

## Order Endpoints

### POST /order
Place order from cart items (requires authentication).
- **Body**: `{"cart_items": [{"product_id": "number", "quantity": "number"}]}`

### GET /orders
Get user's order history (requires authentication).

### POST /checkout
Complete pending orders (requires authentication).