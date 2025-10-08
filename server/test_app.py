from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
CORS(app, origins=["*"], supports_credentials=True)

@app.route('/')
def home():
    return {"message": "Mama Mboga Delivery App API is running!", "status": "success"}

@app.route('/api/products')
def get_products():
    return {
        "products": [
            {"id": 1, "name": "Tomato", "price": 3.5, "description": "Fresh red tomatoes"},
            {"id": 2, "name": "Cabbage", "price": 2.0, "description": "Green cabbage"}
        ]
    }

if __name__ == '__main__':
    print("Starting Mama Mboga Flask server...")
    app.run(host='0.0.0.0', port=5000, debug=True)