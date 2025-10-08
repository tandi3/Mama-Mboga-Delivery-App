import os
from flask import Flask, request, jsonify, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_cors import CORS

app = Flask(__name__, static_folder='client/build', static_url_path='')
CORS(app)

# Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'sqlite:///mama_mboga.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-secret-key')
app.config['JWT_SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-secret-key')

db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)

# Models
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    role = db.Column(db.String(50), nullable=False)

class Product(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(200))
    price = db.Column(db.Float, nullable=False)

# In-memory storage
user_carts = {}
user_orders = {}

# Serve React App
@app.route('/')
def serve_react_app():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/<path:path>')
def serve_static_files(path):
    if path and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    return send_from_directory(app.static_folder, 'index.html')

# API Routes
@app.route('/api/products')
def get_products():
    products = Product.query.all()
    if not products:
        return jsonify([
            {"id": 1, "name": "Tomato", "description": "Fresh red tomatoes", "price": 3.5},
            {"id": 2, "name": "Cabbage", "description": "Green cabbage", "price": 2.0},
            {"id": 3, "name": "Onion", "description": "White onions", "price": 1.5},
            {"id": 4, "name": "Potato", "description": "Fresh potatoes", "price": 4.0},
            {"id": 5, "name": "Carrot", "description": "Organic carrots", "price": 3.0}
        ])
    return jsonify([{"id": p.id, "name": p.name, "description": p.description, "price": p.price} for p in products])

@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    if User.query.filter_by(email=data['email']).first():
        return jsonify({"message": "Email already exists"}), 400
    
    hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
    new_user = User(email=data['email'], password=hashed_password, role=data['role'])
    db.session.add(new_user)
    db.session.commit()
    return jsonify({"message": "User created successfully"}), 201

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data['email']).first()
    if user and bcrypt.check_password_hash(user.password, data['password']):
        token = create_access_token(identity=str(user.id))
        return jsonify({'token': token}), 200
    return jsonify({"message": "Invalid credentials"}), 401

@app.route('/api/cart', methods=['GET'])
@jwt_required()
def get_cart():
    user_id = get_jwt_identity()
    return jsonify(user_carts.get(user_id, []))

@app.route('/api/cart', methods=['POST'])
@jwt_required()
def add_to_cart():
    user_id = get_jwt_identity()
    data = request.get_json()
    if user_id not in user_carts:
        user_carts[user_id] = []
    user_carts[user_id].append(data)
    return jsonify({"message": "Added to cart"}), 201

@app.route('/api/order', methods=['POST'])
@jwt_required()
def place_order():
    user_id = get_jwt_identity()
    data = request.get_json()
    if user_id not in user_orders:
        user_orders[user_id] = []
    user_orders[user_id].extend(data['cart_items'])
    user_carts[user_id] = []
    return jsonify({"message": "Order placed"}), 201

@app.route('/api/orders', methods=['GET'])
@jwt_required()
def get_orders():
    user_id = get_jwt_identity()
    return jsonify(user_orders.get(user_id, []))

# Initialize database
with app.app_context():
    db.create_all()
    if Product.query.count() == 0:
        products = [
            Product(name="Tomato", description="Fresh red tomatoes", price=3.5),
            Product(name="Cabbage", description="Green cabbage", price=2.0),
            Product(name="Onion", description="White onions", price=1.5),
            Product(name="Potato", description="Fresh potatoes", price=4.0),
            Product(name="Carrot", description="Organic carrots", price=3.0),
        ]
        for product in products:
            db.session.add(product)
        db.session.commit()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 5000)))