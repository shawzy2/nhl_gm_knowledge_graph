from flask import Blueprint, jsonify, request
from .. import db
from ..models import Dates
from urllib.request import urlopen
import datetime
import pandas as pd

dates_bp = Blueprint('dates_bp', __name__)

@dates_bp.route('/dates/load', methods=['POST'])
def dates_load():
    '''Refresshes DB with staff data'''

    with open('backend/hand_tracked_data/seasonDatesNHL.csv') as f:
        df = pd.read_csv(f)

    Dates.query.delete()

    [db.session.add(Dates(
            season=row.season,
            type=row.type,
            date=datetime.datetime.strptime(row.date, '%m/%d/%Y').date()
        )) for row in df.itertuples()]

    db.session.commit()
    return 'Successfully loaded ' + str(len(df)) + ' date data', 201