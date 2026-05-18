import sqlite3
from datetime import datetime
from werkzeug.security import generate_password_hash
from app import DB_PATH, init_db


def seed():
    init_db()
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()

    users = [
        ('Admin User', 'admin@atomquest.dev', generate_password_hash('admin123'), 'admin', datetime.utcnow().isoformat()),
        ('Maya Engineer', 'maya@atomquest.dev', generate_password_hash('maya1234'), 'user', datetime.utcnow().isoformat()),
        ('Leo Innovator', 'leo@atomquest.dev', generate_password_hash('leo12345'), 'user', datetime.utcnow().isoformat()),
    ]

    for u in users:
        cur.execute('INSERT OR IGNORE INTO users (name, email, password, role, created_at) VALUES (?, ?, ?, ?, ?)', u)

    user_ids = {row[1]: row[0] for row in cur.execute('SELECT id, email FROM users').fetchall()}

    reports = [
        (user_ids['maya@atomquest.dev'], 'Solar Sensor Retrofit', 'Energy Efficiency', 78.4, 'Pilot in Building A', 'approved', datetime.utcnow().isoformat()),
        (user_ids['leo@atomquest.dev'], 'Factory Water Reuse Loop', 'Sustainability', 65.0, 'Needs budget review', 'submitted', datetime.utcnow().isoformat()),
        (user_ids['maya@atomquest.dev'], 'Predictive Motor Monitoring', 'Automation', 88.2, 'Strong anomaly detection', 'under_review', datetime.utcnow().isoformat()),
    ]

    for r in reports:
        cur.execute('''
            INSERT INTO reports (user_id, title, category, metric_value, notes, status, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ''', r)

    conn.commit()
    conn.close()
    print('Seed data inserted.')


if __name__ == '__main__':
    seed()
