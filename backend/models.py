from . import db 

class Trade(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    team1 = db.Column(db.String(100))
    team2 = db.Column(db.String(100))
    team1_gm = db.Column(db.String(100))
    team2_gm = db.Column(db.String(100))
    # team1_aquires = db.Column(db.Array(db.String(100)))
    # team2_aquires = db.Column(db.Array(db.String(100)))
    date = db.Column(db.Date)