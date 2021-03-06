from flask import Flask
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)

    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'

    db.init_app(app)

    from .trades import trades
    app.register_blueprint(trades.trade_bp)

    from .staff import staff
    app.register_blueprint(staff.staff_bp)

    from .standings import standing
    app.register_blueprint(standing.standing_bp)

    from .thresholds import threshold
    app.register_blueprint(threshold.threshold_bp)

    from .dates import dates
    app.register_blueprint(dates.dates_bp)
    
    return app