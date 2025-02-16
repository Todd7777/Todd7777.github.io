from flask import Flask, render_template, jsonify, request, redirect, url_for, flash
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
from datetime import datetime, timedelta
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
import uuid
import json
from ipaddress import ip_network
import random

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key-here'  # In production, use environment variable
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

# Sample metrics for demonstration
SAMPLE_METRICS = {
    'api_calls': {
        'total': 245789,
        'growth': '+12.5%',
        'peak': 8500
    },
    'response_times': {
        'average': 125,
        'trend': '-15ms',
        'peak': 150
    },
    'error_rates': {
        'average': 0.45,
        'trend': '-0.12%',
        'peak': 0.8
    },
    'active_keys': {
        'total': 867,
        'growth': '+5.2%',
        'peak': 920
    }
}

class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128))
    api_keys = db.relationship('ApiKey', backref='user', lazy=True)
    ip_whitelist = db.relationship('IpWhitelist', backref='user', lazy=True)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

class ApiKey(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    key = db.Column(db.String(50), unique=True, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    last_used = db.Column(db.DateTime)
    is_active = db.Column(db.Boolean, default=True)

class IpWhitelist(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    ip_range = db.Column(db.String(50), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

def init_db():
    with app.app_context():
        db.create_all()
        # Create a test user if none exists
        if not User.query.filter_by(email='test@example.com').first():
            user = User(email='test@example.com')
            user.set_password('password123')
            db.session.add(user)
            db.session.commit()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password')
        user = User.query.filter_by(email=email).first()
        
        if user and user.check_password(password):
            login_user(user)
            return redirect(url_for('dashboard'))
        
        flash('Invalid email or password')
    return render_template('login.html')

@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('index'))

@app.route('/dashboard')
@login_required
def dashboard():
    # Sample metrics data
    metrics = {
        'api_calls': {
            'total': 245789,
            'growth': '+12.5%',
            'average': 7250,
            'peak': 8500,
            'hourly': []
        },
        'response_times': {
            'average': 125,
            'trend': '-15ms',
            'peak': 150,
            'hourly': []
        },
        'error_rates': {
            'average': 0.45,
            'trend': '-0.12%',
            'peak': 0.8,
            'hourly': []
        },
        'active_keys': {
            'total': 867,
            'growth': '+5.2%',
            'peak': 920,
            'hourly': []
        }
    }

    # Generate hourly data for the last 24 hours
    now = datetime.now()
    for i in range(24):
        timestamp = (now - timedelta(hours=23-i)).strftime('%Y-%m-%d %H:%M:%S')
        metrics['api_calls']['hourly'].append({
            'timestamp': timestamp,
            'value': random.randint(5000, 8500)
        })
        metrics['response_times']['hourly'].append({
            'timestamp': timestamp,
            'value': random.randint(75, 150)
        })
        metrics['error_rates']['hourly'].append({
            'timestamp': timestamp,
            'value': round(random.uniform(0.1, 0.8), 2)
        })
        metrics['active_keys']['hourly'].append({
            'timestamp': timestamp,
            'value': random.randint(800, 920)
        })

    # Sample API keys
    api_keys = [
        {'key': 'ak_test_123456789012', 'created_at': datetime.now() - timedelta(days=2)},
        {'key': 'ak_test_987654321098', 'created_at': datetime.now() - timedelta(days=5)}
    ]

    return render_template('dashboard.html', metrics=metrics, api_keys=api_keys)

@app.route('/api/keys', methods=['POST'])
@login_required
def create_api_key():
    key = f"ak_{uuid.uuid4().hex[:24]}"
    new_key = ApiKey(key=key, user_id=current_user.id)
    db.session.add(new_key)
    db.session.commit()
    return jsonify({'key': key})

@app.route('/api/keys/<key_id>', methods=['DELETE'])
@login_required
def delete_api_key(key_id):
    key = ApiKey.query.filter_by(id=key_id, user_id=current_user.id).first_or_404()
    db.session.delete(key)
    db.session.commit()
    return '', 204

@app.route('/api/whitelist', methods=['GET'])
@login_required
def get_whitelist():
    whitelist = IpWhitelist.query.filter_by(user_id=current_user.id).all()
    return jsonify([{'id': item.id, 'ip_range': item.ip_range} for item in whitelist])

@app.route('/api/whitelist', methods=['POST'])
@login_required
def add_to_whitelist():
    ip_range = request.json.get('ip_range')
    try:
        # Validate IP range
        ip_network(ip_range)
        whitelist_entry = IpWhitelist(ip_range=ip_range, user_id=current_user.id)
        db.session.add(whitelist_entry)
        db.session.commit()
        return jsonify({'id': whitelist_entry.id, 'ip_range': ip_range})
    except ValueError:
        return jsonify({'error': 'Invalid IP range'}), 400

@app.route('/api/whitelist/<entry_id>', methods=['DELETE'])
@login_required
def remove_from_whitelist(entry_id):
    entry = IpWhitelist.query.filter_by(id=entry_id, user_id=current_user.id).first_or_404()
    db.session.delete(entry)
    db.session.commit()
    return '', 204

@app.route('/api/metrics/<time_range>')
@login_required
def get_metrics_by_range(time_range):
    now = datetime.now()
    data_points = {
        'day': 24,
        'week': 7 * 24,
        'month': 30 * 24,
        'year': 365 * 24
    }
    
    if time_range not in data_points:
        return jsonify({'error': 'Invalid time range'}), 400
        
    points = data_points[time_range]
    metrics_data = {
        'api_calls': [],
        'response_times': [],
        'error_rates': [],
        'active_keys': []
    }
    
    for i in range(points):
        timestamp = (now - timedelta(hours=points-i-1)).strftime('%Y-%m-%d %H:%M:%S')
        metrics_data['api_calls'].append({
            'timestamp': timestamp,
            'value': random.randint(5000, 8500)
        })
        metrics_data['response_times'].append({
            'timestamp': timestamp,
            'value': random.randint(75, 150)
        })
        metrics_data['error_rates'].append({
            'timestamp': timestamp,
            'value': round(random.uniform(0.1, 0.8), 2)
        })
        metrics_data['active_keys'].append({
            'timestamp': timestamp,
            'value': random.randint(800, 920)
        })
    
    return jsonify(metrics_data)

@app.route('/documentation')
def documentation():
    return render_template('documentation.html')

if __name__ == '__main__':
    init_db()
    app.run(debug=True, port=5004)
