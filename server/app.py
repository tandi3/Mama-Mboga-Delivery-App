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

app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'sqlite:///mama_mboga.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'secret_key')

db.init_app(app)
ma = Marshmallow(app)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)
migrate = Migrate(app, db)

with app.app_context():
    db.create_all()
    from models import Product
    if not Product.query.first():
        product1 = Product(name="Tomato", description="Fresh red tomatoes", price=3.5, vendor_id=1)
        product2 = Product(name="Cabbage", description="Green cabbage", price=2.0, vendor_id=1)
        product3 = Product(name="Onion", description="White onions", price=1.5, vendor_id=1)
        product4 = Product(name="Potato", description="Fresh potatoes", price=4.0, vendor_id=1)
        product5 = Product(name="Carrot", description="Organic carrots", price=3.0, vendor_id=1)
        product6 = Product(name="Bell Pepper", description="Colorful bell peppers", price=3.2, vendor_id=1)
        product7 = Product(name="Spinach", description="Fresh green spinach", price=2.5, vendor_id=1)
        product8 = Product(name="Eggplant", description="Purple eggplants", price=2.8, vendor_id=1)
        product9 = Product(name="Broccoli", description="Fresh broccoli", price=3.5, vendor_id=1)
        product10 = Product(name="Zucchini", description="Green zucchini", price=2.7, vendor_id=1)
        product11 = Product(name="Cucumber", description="Crisp cucumbers", price=1.8, vendor_id=1)
        product12 = Product(name="Lettuce", description="Fresh lettuce leaves", price=2.2, vendor_id=1)


        db.session.add(product1)
        db.session.add(product2)
        db.session.add(product3)
        db.session.add(product4)
        db.session.add(product5)
        db.session.add(product6)
        db.session.add(product7)
        db.session.add(product8)
        db.session.add(product9)
        db.session.add(product10)
        db.session.add(product11)
        db.session.add(product12)
        
                

        db.session.commit()

        print("Products added to the database.")
    else:
        print("Products already exist.")

import routes

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)
