import os
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity, get_jwt
from flask_cors import CORS

app = Flask(__name__)
CORS(app, origins=["*"], supports_credentials=True)

# Simple database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///mama_mboga.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'your-secret-key-here'
app.config['JWT_SECRET_KEY'] = 'jwt-secret-string'

db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)

# In-memory storage (for demo purposes)
user_carts = {}
user_orders = {}

# Models
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    role = db.Column(db.String(50), nullable=False)

class Product(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(200), nullable=True)
    price = db.Column(db.Float, nullable=False)
    vendor_id = db.Column(db.Integer, nullable=False, default=1)

# Routes
@app.route('/')
def home():
    return jsonify({"message": "Mama Mboga Delivery App API is running!", "status": "success"})

@app.route('/products')
def get_products():
    try:
        products = Product.query.all()
        return jsonify([{
            "id": p.id,
            "name": p.name,
            "description": p.description,
            "price": p.price
        } for p in products])
    except:
        return jsonify([
            {"id": 1, "name": "Tomato", "description": "Fresh red tomatoes", "price": 3.5},
            {"id": 2, "name": "Cabbage", "description": "Green cabbage", "price": 2.0},
            {"id": 3, "name": "Onion", "description": "White onions", "price": 1.5},
            {"id": 4, "name": "Potato", "description": "Fresh potatoes", "price": 4.0},
            {"id": 5, "name": "Carrot", "description": "Organic carrots", "price": 3.0}
        ])

@app.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        print(f"Registration data received: {data}")  # Debug log
        
        if not data:
            return jsonify({"message": "No data provided"}), 400
            
        # Check required fields
        required_fields = ['email', 'password', 'role']
        missing_fields = [field for field in required_fields if field not in data or not data[field]]
        if missing_fields:
            return jsonify({"message": f"Missing required fields: {', '.join(missing_fields)}"}), 400
        
        # Validate email format
        import re
        email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        if not re.match(email_pattern, data['email']):
            return jsonify({"message": "Invalid email format"}), 400
        
        # Check if user already exists
        if User.query.filter_by(email=data['email']).first():
            return jsonify({"message": "Email already exists"}), 400
        
        # Validate password length
        if len(data['password']) < 6:
            return jsonify({"message": "Password must be at least 6 characters"}), 400
        
        # Only allow customer role for now
        if data['role'] not in ['customer', 'vendor']:
            return jsonify({"message": "Invalid role"}), 400
        
        hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
        new_user = User(email=data['email'], password=hashed_password, role=data['role'])
        db.session.add(new_user)
        db.session.commit()
        print(f"User created successfully: {data['email']}")  # Debug log
        return jsonify({"message": "User created successfully"}), 201
    except Exception as e:
        print(f"Registration error: {str(e)}")  # Debug log
        return jsonify({"message": f"Registration failed: {str(e)}"}), 500

@app.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        if not data or not all(k in data for k in ['email', 'password']):
            return jsonify({"message": "Missing email or password"}), 400
        
        user = User.query.filter_by(email=data['email']).first()
        if user and bcrypt.check_password_hash(user.password, data['password']):
            token = create_access_token(
                identity=str(user.id),
                additional_claims={'email': user.email, 'role': user.role}
            )
            return jsonify({'token': token}), 200
        
        return jsonify({"message": "Invalid credentials"}), 401
    except Exception as e:
        return jsonify({"message": f"Error: {str(e)}"}), 500

@app.route('/cart', methods=['GET'])
@jwt_required()
def get_cart():
    try:
        user_id = get_jwt_identity()
        cart_items = user_carts.get(user_id, [])
        
        # Convert cart items to the format expected by frontend
        formatted_cart = []
        for item in cart_items:
            product = Product.query.get(item['product_id'])
            if product:
                formatted_cart.append({
                    'product_id': product.id,
                    'product_name': product.name,
                    'price': product.price,
                    'quantity': item['quantity']
                })
        
        return jsonify(formatted_cart), 200
    except Exception as e:
        print(f"Cart GET error: {str(e)}")
        return jsonify({"message": f"Error: {str(e)}"}), 500

@app.route('/cart', methods=['POST'])
@jwt_required()
def add_to_cart():
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        print(f"Add to cart data: {data}")
        
        if not data or 'product_id' not in data:
            return jsonify({"message": "Product ID is required"}), 400
        
        product_id = data['product_id']
        quantity = data.get('quantity', 1)
        
        # Verify product exists
        product = Product.query.get(product_id)
        if not product:
            return jsonify({"message": "Product not found"}), 404
        
        # Initialize user cart if it doesn't exist
        if user_id not in user_carts:
            user_carts[user_id] = []
        
        # Check if product already in cart
        existing_item = None
        for item in user_carts[user_id]:
            if item['product_id'] == product_id:
                existing_item = item
                break
        
        if existing_item:
            existing_item['quantity'] += quantity
        else:
            user_carts[user_id].append({
                'product_id': product_id,
                'quantity': quantity
            })
        
        print(f"Cart updated for user {user_id}: {user_carts[user_id]}")
        return jsonify({"message": "Product added to cart"}), 201
    except Exception as e:
        print(f"Add to cart error: {str(e)}")
        return jsonify({"message": f"Error: {str(e)}"}), 500

@app.route('/order', methods=['POST'])
@jwt_required()
def place_order():
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        print(f"Place order data: {data}")
        
        if not data or 'cart_items' not in data:
            return jsonify({"message": "Cart items are required"}), 400
        
        cart_items = data['cart_items']
        if not cart_items:
            return jsonify({"message": "Cart is empty"}), 400
        
        # Initialize user orders if not exists
        if user_id not in user_orders:
            user_orders[user_id] = []
        
        # Create order ID
        order_id = len(user_orders[user_id]) + 1
        
        # Process each cart item
        order_items = []
        for item in cart_items:
            product = Product.query.get(item['product_id'])
            if product:
                order_items.append({
                    'id': order_id,
                    'product_id': product.id,
                    'product_name': product.name,
                    'quantity': item['quantity'],
                    'price': product.price,
                    'status': 'processing',
                    'delivery_status': 'pending'
                })
        
        # Add to user orders
        user_orders[user_id].extend(order_items)
        
        # Clear user cart after placing order
        if user_id in user_carts:
            user_carts[user_id] = []
        
        print(f"Order placed for user {user_id}: {len(order_items)} items")
        return jsonify({"message": "Order placed successfully"}), 201
    except Exception as e:
        print(f"Place order error: {str(e)}")
        return jsonify({"message": f"Error: {str(e)}"}), 500

@app.route('/orders', methods=['GET'])
@jwt_required()
def get_orders():
    try:
        user_id = get_jwt_identity()
        orders = user_orders.get(user_id, [])
        print(f"Fetching orders for user {user_id}: {len(orders)} orders")
        return jsonify(orders), 200
    except Exception as e:
        print(f"Get orders error: {str(e)}")
        return jsonify({"message": f"Error: {str(e)}"}), 500

# Initialize database
try:
    with app.app_context():
        db.create_all()
        
        if not User.query.filter_by(role='vendor').first():
            vendor = User(
                email='vendor@example.com', 
                password=bcrypt.generate_password_hash('password123').decode('utf-8'), 
                role='vendor'
            )
            db.session.add(vendor)
            db.session.commit()
            print("✓ Default vendor created")
        
        if Product.query.count() == 0:
            products = [
                Product(name="Tomato", description="Fresh red tomatoes", price=3.5, vendor_id=1),
                Product(name="Cabbage", description="Green cabbage", price=2.0, vendor_id=1),
                Product(name="Onion", description="White onions", price=1.5, vendor_id=1),
                Product(name="Potato", description="Fresh potatoes", price=4.0, vendor_id=1),
                Product(name="Carrot", description="Organic carrots", price=3.0, vendor_id=1),
            ]
            for product in products:
                db.session.add(product)
            db.session.commit()
            print(f"✓ Added {len(products)} products")
        
        print("✓ Database initialized successfully")
except Exception as e:
    print(f"✗ Database error: {e}")

if __name__ == '__main__':
    print("Starting Mama Mboga Flask server...")
    app.run(host='0.0.0.0', port=5000, debug=True)