import os
import sqlite3
from datetime import datetime
from flask import Flask, jsonify, request
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, 'innovation_portal.db')

app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret-key')
CORS(app)


def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    conn = get_db_connection()
    cur = conn.cursor()

    cur.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            role TEXT NOT NULL DEFAULT 'user',
            created_at TEXT NOT NULL
        )
    ''')

    cur.execute('''
        CREATE TABLE IF NOT EXISTS reports (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            title TEXT NOT NULL,
            category TEXT NOT NULL,
            metric_value REAL NOT NULL,
            notes TEXT,
            status TEXT NOT NULL DEFAULT 'submitted',
            created_at TEXT NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    ''')

    conn.commit()
    conn.close()


@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'ok', 'message': 'AtomQuest Flask API running'})


@app.route('/api/auth/signup', methods=['POST'])
def signup():
    data = request.json
    required = ['name', 'email', 'password']
    if not all(k in data and data[k] for k in required):
        return jsonify({'error': 'Missing required fields'}), 400

    conn = get_db_connection()
    cur = conn.cursor()

    try:
        cur.execute(
            'INSERT INTO users (name, email, password, role, created_at) VALUES (?, ?, ?, ?, ?)',
            (
                data['name'],
                data['email'].lower(),
                generate_password_hash(data['password']),
                data.get('role', 'user'),
                datetime.utcnow().isoformat()
            )
        )
        conn.commit()
        return jsonify({'message': 'Signup successful'}), 201
    except sqlite3.IntegrityError:
        return jsonify({'error': 'Email already registered'}), 409
    finally:
        conn.close()


@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email', '').lower()
    password = data.get('password', '')

    conn = get_db_connection()
    user = conn.execute('SELECT * FROM users WHERE email = ?', (email,)).fetchone()
    conn.close()

    if not user or not check_password_hash(user['password'], password):
        return jsonify({'error': 'Invalid credentials'}), 401

    return jsonify({
        'message': 'Login successful',
        'user': {
            'id': user['id'],
            'name': user['name'],
            'email': user['email'],
            'role': user['role']
        }
    })


@app.route('/api/reports', methods=['GET'])
def list_reports():
    conn = get_db_connection()
    reports = conn.execute('''
        SELECT r.*, u.name as submitted_by
        FROM reports r
        JOIN users u ON r.user_id = u.id
        ORDER BY r.created_at DESC
    ''').fetchall()
    conn.close()
    return jsonify([dict(r) for r in reports])


@app.route('/api/reports', methods=['POST'])
def create_report():
    data = request.json
    required = ['user_id', 'title', 'category', 'metric_value']
    if not all(k in data and data[k] not in (None, '') for k in required):
        return jsonify({'error': 'Missing required fields'}), 400

    conn = get_db_connection()
    conn.execute(
        '''INSERT INTO reports (user_id, title, category, metric_value, notes, status, created_at)
           VALUES (?, ?, ?, ?, ?, ?, ?)''',
        (
            data['user_id'],
            data['title'],
            data['category'],
            float(data['metric_value']),
            data.get('notes', ''),
            data.get('status', 'submitted'),
            datetime.utcnow().isoformat(),
        )
    )
    conn.commit()
    conn.close()
    return jsonify({'message': 'Report submitted successfully'}), 201


@app.route('/api/analytics/overview', methods=['GET'])
def analytics_overview():
    conn = get_db_connection()
    total_users = conn.execute('SELECT COUNT(*) AS c FROM users').fetchone()['c']
    total_reports = conn.execute('SELECT COUNT(*) AS c FROM reports').fetchone()['c']
    avg_metric = conn.execute('SELECT COALESCE(AVG(metric_value),0) AS a FROM reports').fetchone()['a']

    category_rows = conn.execute('''
        SELECT category, COUNT(*) AS count
        FROM reports
        GROUP BY category
        ORDER BY count DESC
    ''').fetchall()

    status_rows = conn.execute('''
        SELECT status, COUNT(*) AS count
        FROM reports
        GROUP BY status
    ''').fetchall()
    conn.close()

    return jsonify({
        'kpis': {
            'total_users': total_users,
            'total_reports': total_reports,
            'average_metric': round(avg_metric, 2)
        },
        'category_breakdown': [dict(r) for r in category_rows],
        'status_breakdown': [dict(r) for r in status_rows]
    })


@app.route('/api/admin/users', methods=['GET'])
def admin_users():
    conn = get_db_connection()
    users = conn.execute('SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC').fetchall()
    conn.close()
    return jsonify([dict(u) for u in users])


if __name__ == '__main__':
    init_db()
    app.run(debug=True, host='0.0.0.0', port=5000)
