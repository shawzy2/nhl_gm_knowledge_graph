from flask import Blueprint, jsonify, request
from .. import db
from ..models import Standing
import json
from urllib.request import urlopen
from bs4 import BeautifulSoup
import datetime
import os
import pandas as pd
import logging
import ssl

standing_bp = Blueprint('standing_bp', __name__)

@standing_bp.route('/standing/load', methods=['POST'])
def standing_load():
    '''Refresshes DB with standings data'''

    df = pd.read_csv('backend/data/cumulative_points.csv', index_col=None, header=0)

    Standing.query.delete()

    [db.session.add(Standing(
            season=row.season,
            date=datetime.datetime.strptime(row.date, '%Y-%m-%d').date(),
            team=row.team,
            division=row.division,
            conference=row.conference,
            points=row.points
        )) for row in df.itertuples()]

    db.session.commit()
    return 'Successfully loaded ' + str(len(df)) + ' standings data', 201

@standing_bp.route('/standing/name')
def trades_all():
    '''Returns list of Standings in db for name1 when name1 is gm of a team'''
    name1 = request.args.get('name1')
    if name1 is None:
        return jsonify([])

    db.session.connection()
    result = db.engine.execute(
        f"""WITH teams as (
            SELECT season, team 
            FROM staff 
            WHERE title='General Manager' and league='NHL' and name='{name1}'
            ),
            standings as (
            SELECT t.season, t.team, s.date, s.division, s.conference, s.points
            FROM teams t 
            INNER JOIN standing s ON t.season=s.season and t.team=s.team
            ),
            cutoffs as (
            SELECT *
            FROM playoff_threshold
            )
        SELECT s.season, 
                s.date, 
                s.points, 
                (s.points-cd.threshold) as divThreshold, 
                CASE 
                    WHEN s.season = '2020-21' THEN 0 
                    ELSE (s.points-cc.threshold) 
                END as confThreshold
        FROM standings s 
        LEFT JOIN cutoffs cd ON s.date = cd.date AND s.division = cd.div_conf
        LEFT JOIN cutoffs cc ON s.date = cc.date AND s.conference = cc.div_conf;""")

    # list of rows, each row is ['season', 'date', 'points', 'points_outside_div_playoff_spot', 'points_outside_conf_playoff_spot']
    standings = [row[0:len(row)] for row in result]
    return jsonify(standings)