import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from flask_migrate import Migrate
from models import db

app = Flask(__name__)
CORS(app, origins=["*"], supports_credentials=True)

database_url = os.environ.get('DATABASE_URL')
if not database_url:
    db_path = os.path.join(os.getcwd(), 'mama_mboga.db')
    database_url = f'sqlite:///{db_path}'
    print(f"Using database at: {db_path}")
if database_url.startswith('postgres://'):
    database_url = database_url.replace('postgres://', 'postgresql://', 1)
app.config['SQLALCHEMY_DATABASE_URI'] = database_url
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'your-secret-key-here')

db.init_app(app)
ma = Marshmallow(app)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)
migrate = Migrate(app, db)

try:
    with app.app_context():
        db.create_all()
        print("Database tables created successfully!")
        
        from models import Product, User
        
        if not User.query.filter_by(role='vendor').first():
            vendor = User(email='vendor@example.com', password=bcrypt.generate_password_hash('password123').decode('utf-8'), role='vendor')
            db.session.add(vendor)
            db.session.commit()
            print("Default vendor created (email: vendor@example.com, password: password123)")
        
        if not Product.query.first():
            vendor = User.query.filter_by(role='vendor').first()
            products = [
                Product(name="Tomato", description="Fresh red tomatoes", price=3.5, vendor_id=vendor.id),
                Product(name="Cabbage", description="Green cabbage", price=2.0, vendor_id=vendor.id),
                Product(name="Onion", description="White onions", price=1.5, vendor_id=vendor.id),
                Product(name="Potato", description="Fresh potatoes", price=4.0, vendor_id=vendor.id),
                Product(name="Carrot", description="Organic carrots", price=3.0, vendor_id=vendor.id),
            ]
            for product in products:
                db.session.add(product)
            db.session.commit()
            print(f"Added {len(products)} sample products to database.")
        
        print("Flask server starting...")
except Exception as e:
    print(f"Database initialization error: {e}")
    print("Starting server without database...")

import routes

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
