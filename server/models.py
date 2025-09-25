from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


class User(db.Model):
    __tablename__ = "user"

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    role = db.Column(db.String(50), nullable=False)

    # Relationships
    orders = db.relationship("Order", back_populates="customer", lazy=True)
    products = db.relationship("Product", back_populates="vendor", lazy=True)
    cart_items = db.relationship("Cart", back_populates="user", lazy=True)

    def __repr__(self):
        return f'<User {self.email}>'


class Product(db.Model):
    __tablename__ = "product"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(200), nullable=True)
    price = db.Column(db.Float, nullable=False)
    vendor_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    # Relationships
    vendor = db.relationship("User", back_populates="products")
    orders = db.relationship("Order", back_populates="product", lazy=True)
    cart_items = db.relationship("Cart", back_populates="product", lazy=True)

    def __repr__(self):
        return f'<Product {self.name}>'


class Order(db.Model):
    __tablename__ = "order"

    id = db.Column(db.Integer, primary_key=True)
    customer_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('product.id'), nullable=False)
    status = db.Column(db.String(50), nullable=False, default='processing')

    # Relationships
    customer = db.relationship("User", back_populates="orders")
    product = db.relationship("Product", back_populates="orders")
    delivery = db.relationship("Delivery", back_populates="order", uselist=False)

    def __repr__(self):
        return f'<Order {self.id} - {self.status}>'


class Delivery(db.Model):
    __tablename__ = "delivery"

    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey('order.id'), nullable=False, unique=True)
    delivery_status = db.Column(db.String(50), nullable=False, default='pending')

    # Relationships
    order = db.relationship("Order", back_populates="delivery")

    def __repr__(self):
        return f'<Delivery {self.id} - {self.delivery_status}>'


class Cart(db.Model):
    __tablename__ = "cart"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('product.id'), nullable=False)
    quantity = db.Column(db.Integer, nullable=False, default=1)

    # Relationships
    user = db.relationship("User", back_populates="cart_items")
    product = db.relationship("Product", back_populates="cart_items")

    def __repr__(self):
        return f'<Cart {self.user_id} - Product {self.product_id} - Quantity {self.quantity}>'
