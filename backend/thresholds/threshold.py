from flask import Blueprint, jsonify, request
from .. import db
from ..models import PlayoffThreshold
import json
from urllib.request import urlopen
from bs4 import BeautifulSoup
import datetime
import os
import pandas as pd
import logging
import ssl

threshold_bp = Blueprint('threshold_bp', __name__)

@threshold_bp.route('/threshold/load', methods=['POST'])
def threshold_load():
    '''Refresshes DB with threshold data'''

    df = pd.read_csv('backend/data/playoff_thresholds.csv', index_col=None, header=0)

    PlayoffThreshold.query.delete()

    [db.session.add(PlayoffThreshold(
            season=row.season,
            date=datetime.datetime.strptime(row.date, '%Y-%m-%d').date(),
            div_conf=row.div_conf_name,
            threshold=row.points_threshold
        )) for row in df.itertuples()]

    db.session.commit()
    return 'Successfully loaded ' + str(len(df)) + ' threshold data', 201