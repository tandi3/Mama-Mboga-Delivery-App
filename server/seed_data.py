from app import app, db
from models import Product

def seed_products():
    """Seed the database with sample products"""
    with app.app_context():
        # Check if products already exist
        if Product.query.count() > 0:
            print("Products already exist in database")
            return
        
        sample_products = [
            {"name": "Tomatoes", "description": "Fresh red tomatoes", "price": 50.0},
            {"name": "Onions", "description": "Fresh white onions", "price": 40.0},
            {"name": "Carrots", "description": "Fresh orange carrots", "price": 60.0},
            {"name": "Spinach", "description": "Fresh green spinach", "price": 30.0},
            {"name": "Potatoes", "description": "Fresh potatoes", "price": 45.0}
        ]
        
        for product_data in sample_products:
            product = Product(**product_data)
            db.session.add(product)
        
        db.session.commit()
        print(f"Added {len(sample_products)} products to database")

if __name__ == "__main__":
    seed_products()