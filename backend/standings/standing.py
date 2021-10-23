from flask import Blueprint, jsonify, request
from .. import db
from ..models import Standing
import json
from urllib.request import urlopen
from bs4 import BeautifulSoup
import datetime
import os
import pandas as pd
import numpy as np
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

@standing_bp.route('/standing/graph')
def daily_standings(conf_or_div = 'pointsAboveConf'):
    '''Returns list of Standings in db for name1 when name1 is gm of a team'''
    name1 = request.args.get('name1')
    if name1 is None or name1 == 'undefined':
        return jsonify({
            'labels': [1,2,3],
            'seasons': [['season', []]],
            'trades': [['seasonTrades', []]]
        })

    if request.args.get('confOrDiv') == 'pointsAboveDiv':
        conf_or_div = 'pointsAboveDiv'

    db.session.connection()
    result = db.engine.execute(
        f"""
            WITH teams as (
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
                ),
                tradeDeadlines as (
                SELECT *
                FROM dates
                WHERE type='deadline'
                ),
                openingDay as (
                SELECT *
                FROM dates
                WHERE type='start'
                ),
                trades as (
                SELECT *
                FROM trade
                WHERE team1_gm='{name1}' or team2_gm='{name1}'
                )
            SELECT s.season,
                    s.date, 
                    CAST(JULIANDAY(s.date) - JULIANDAY(tdl.date) as INTEGER) as daysTillDeadline,
                    CAST(JULIANDAY(s.date) - JULIANDAY(od.date) as INTEGER) as daysSinceOpeningDay,
                    s.points, 
                    (s.points-cd.threshold) as divThreshold, 
                    CASE 
                        WHEN s.season = '2020-21' THEN 0 
                        ELSE (s.points-cc.threshold) 
                    END as confThreshold,
                    CASE 
                        WHEN tr.id > 0 THEN 1
                        ELSE 0
                    END as madeTrade
            FROM standings s 
            LEFT JOIN cutoffs cd ON s.date = cd.date AND s.division = cd.div_conf
            LEFT JOIN cutoffs cc ON s.date = cc.date AND s.conference = cc.div_conf
            LEFT JOIN tradeDeadlines tdl ON s.season = tdl.season
            LEFT JOIN openingDay od ON s.season = od.season
            LEFT JOIN trades tr ON s.date = tr.date
            WHERE (JULIANDAY(s.date) - JULIANDAY(od.date)) >= 0 AND (JULIANDAY(s.date) - JULIANDAY(tdl.date)) < 45;
        """)

    # list of rows, each row is ['season', 'date', 'days_til_trade_deadline', 'days_since_opening_day', 
    #                               'points', 'points_outside_div_playoff_spot', 'points_outside_conf_playoff_spot']
    daily_standings = [row[0:len(row)] for row in result]

    # read values into dataframe
    df = pd.DataFrame(daily_standings)
    df.columns = ['season', 'date', 'daysTillTDL', 'daysSinceOpeningDay', 'points', 
                'pointsAboveDiv', 'pointsAboveConf', 'madeTrade']

    # extract point thresholds for conf/div over each season
    tbl = df.pivot_table(index='daysTillTDL', columns='season', values=[conf_or_div, 'madeTrade'], fill_value='NaN')

    # return list of lables (daysTillTDL) and values for each season
    r = {
        'labels': tbl.index.values.tolist(),
        'seasons': [[season, tbl[conf_or_div][season].values.tolist()] 
                            for season in tbl[conf_or_div].columns.values],
        'trades': [[season, np.where(tbl['madeTrade'][season]==1, 
                                    tbl[conf_or_div][season], 
                                    'NaN').tolist()] 
                        for season in tbl['madeTrade'].columns.values]
    }

    return jsonify(r)