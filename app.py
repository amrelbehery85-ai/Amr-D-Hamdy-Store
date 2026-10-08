from flask import Flask, jsonify, render_template
from flask_cors import CORS
import mysql.connector

app = Flask(__name__)
CORS(app)

DB_CONFIG = {
    "host": "localhost",
    "user": "root",
    "password": "MyNewPass123",
    "database": "store_db",
}

def get_connection():
    return mysql.connector.connect(**DB_CONFIG)

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/api/products")
def get_products():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT id, name, description, price, stock FROM products")
    products = cursor.fetchall()
    cursor.close()
    conn.close()

    for p in products:
        p["price"] = float(p["price"])

    return jsonify(products)

if __name__ == "__main__":
    app.run(debug=True)