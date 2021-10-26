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

class Staff(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    season = db.Column(db.String(100))
    team = db.Column(db.String(100))
    league = db.Column(db.String(50))
    title = db.Column(db.String(100))
    title_category = db.Column(db.String(100))
    notes = db.Column(db.String(100))
    headshot_link = db.Column(db.String(100))

class Standing(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    season = db.Column(db.String(100))
    date = db.Column(db.Date)
    team = db.Column(db.String(100))
    division = db.Column(db.String(100))
    conference = db.Column(db.String(100))
    points = db.Column(db.Integer)
    
class PlayoffThreshold(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    season = db.Column(db.String(100))
    date = db.Column(db.Date)
    div_conf = db.Column(db.String(100))
    threshold = db.Column(db.Integer)

class Dates(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    season = db.Column(db.String(50))
    type = db.Column(db.String(50))
    date = db.Column(db.Date)