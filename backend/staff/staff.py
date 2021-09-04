from flask import Blueprint, jsonify, request
from .. import db
from ..models import Staff
import json
from urllib.request import urlopen
from bs4 import BeautifulSoup
import datetime
import os
import pandas as pd
import numpy as np 
import logging
import ssl

staff_bp = Blueprint('staff_bp', __name__)

@staff_bp.route('/staff/load', methods=['POST'])
def staff_load():
    '''Refresshes DB with staff data'''

    with open('backend/data/active_staff_all_time_history.json') as f:
        staff_list = json.load(f)

    Staff.query.delete()

    [db.session.add(Staff(
            name=s[0],
            season=s[1],
            team=s[2],
            league=s[3],
            title=s[4],
            title_category=get_title_category(s[4]),
            notes=s[5],
            headshot_link=s[6]
        )) for s in staff_list]

    db.session.commit()
    return 'Successfully loaded ' + str(len(staff_list)) + ' staff members', 201

@staff_bp.route('/staff')
def staff_all():
    '''Returns 20 rows from staff table db'''
    staff_list = Staff.query.limit(20).all()
    staff = []

    for s in staff_list:
        staff.append({'name' : s.name, 
                        'season' : s.season,
                        'team' : s.team, 
                        'league' : s.league,  
                        'title' : s.title,
                        'title_category': s.title_category
        })

    return jsonify({'staff': staff})

@staff_bp.route('/staff/name')
def staff_by_name():
    '''Returns a list of staff nodes and edges corresponding to name1 and season that input into cytoscapejs object. 
        Nodes represent staff member
        Edges represent a working relationship between 2 staff members '''
    name = request.args.get('name1')
    season = request.args.get('season')

    if name == 'All':
        return jsonify({"graphData": [
        {
            "data": {
                "id": "Apply Name Filter",
                "name": "Apply Name Filter"
            }
        }]})
    elif season == 'All':
        return jsonify({"graphData": [
        {
            "data": {
                "id": "Apply Season Filter",
                "name": "Apply Season Filter"
            }
        }]})


    teams_this_season = set(s.team for s in Staff.query.filter( (Staff.name==name) & (Staff.season==season) ))
    
    staff_list = []
    for t in teams_this_season:
        staff_list.extend(Staff.query.filter( (Staff.team==t) & (Staff.season==season) ).order_by(Staff.title_category))

    return jsonify({'graphData': convert_to_cytoscape_json([{'name': s.name, 'title_category': s.title_category} for s in staff_list], name)})

def convert_to_cytoscape_json(data, name, organize='intamacy'):
    '''Returns cytoscapejs graph data given list of coworkers and person-of-interest name'''
    nodes_and_edges = []

    n = len(data)


    df = pd.DataFrame(data)
    df['years_together'] = np.array([staff_years_together(name, person['name']) for person in data])
    # df.sort_values(['title_category'], ascending=False, inplace=True)

    angle = np.linspace(0, (2-1/len(data))*np.pi, len(data)) 
    max_radius = 400
    year_factor = max_radius / (df['years_together'].max() + 2)
    df['x_pos'] = np.abs(year_factor * df['years_together'] - max_radius) * np.cos(angle)
    df['y_pos'] = np.abs(year_factor * df['years_together'] - max_radius) * np.sin(angle)

    # df['x_pos'] = [100*level*np.cos(angle) for angle in np.linspace(0 , 2 * np.pi , level*8) for level in df['level'].unique()]
    # x = []
    # for row in df['level'].index.values:
    #     if row < 8:
    #         x_pos = np.cos(2*np.pi / 8 * row) * 100
    #     elif row < 20:
    #         x_pos = 2*np.pi / 12 * (row-8) * 200
    #     elif row < 30:
    #         x_pos = 2*np.pi / 30 * (row-20) * 300
    #     else:
    #         x_pos = 2*np.pi / 40 * (row-30) * 400
    #     x.append(x_pos)


    
    # df['x_pos'] = [100*level*np.cos(angle) for level in df['level'].unique() for angle in np.linspace(0 , 2 * np.pi , level*8)][:len(df)]
    # df['y_pos'] = [100*level*np.sin(angle) for level in df['level'].unique() for angle in np.linspace(0 , 2 * np.pi , level*8)][:len(df)]
    # return df[['name', 'years_together','x_pos', 'y_pos']].values.tolist()

    # x = radius * np.cos( angle ) 
    # y = radius * np.sin( angle ) 

    # for i in range(len(data)):
    #     data[i]['x_pos'] = x[i]
    #     data[i]['y_pos'] = y[i]   

    # i = 0
    # for person in data:
    #     if person['name'] != name:
    #         person['x_pos'] = x[i]
    #         person['y_pos'] = y[i]
    #         i += 1

    cyto = [{ 'data': { 'id': row['name'], 'name': row['name'], 'nodeColor': get_node_color(row['title_category'])}, 'position': {'x': row['x_pos'], 'y': row['y_pos']} } if row['name'] != name 
            else { 'data': { 'id': row['name'], 'name': row['name'], 'nodeColor': get_node_color(row['title_category'])}, 'position': {'x': 0, 'y': 0} }
            for index, row in df.iterrows()]
    cyto.extend([{ 'data': { 'source': name, 'target': coworker } } for coworker in set(row['name'] for index, row in df.iterrows()) if coworker != name])

    # nodes_and_edges.extend([
    #     { 'data': { 'id': person['name'], 'name': person['name'], 'nodeColor': get_node_color(person['title_category'])}, 'position': {'x': person['x_pos'], 'y': person['y_pos']} } if person['name'] != name
    #         else { 'data': { 'id': name, 'name': name, 'nodeColor': get_node_color(person['title_category'])}, 'position': {'x': 0, 'y': 0} }
    #             for person in data])
    # nodes_and_edges.extend([{ 'data': { 'source': name, 'target': coworker } } for coworker in set(person['name'] for person in data) if coworker != name])

    # return df.values.tolist()
    return cyto


def staff_years_together(name1=None, name2=None):
    # name1 = 'Rod Brind\'Amour'
    # name2 = 'Kevyn Adams'
    connection = db.session.connection()
    result = db.engine.execute(f"SELECT count(*) FROM ( \
                                SELECT team, season, count(DISTINCT name) as uniqueNames \
                                FROM staff \
                                WHERE name=\"{name1}\" or name=\"{name2}\" \
                                GROUP BY team, season) \
                                WHERE uniqueNames > 1;")
    return int([row[0] for row in result][0])

hockey_ops = {
    'Analyst',
    'Asst. GM/Asst. Coach',
    'Asst. General Manager',
    'Dir. of Administration',
    'Dir. of Analytics',
    'Dir. of Hockey Administration',
    'Dir. of Hockey Operations',
    'Director',
    'Ex. VP of Hockey Operations',
    'GM/Head Coach',
    'General Manager',
    'Hockey Operations Coordinator',
    'Mgr. of Hockey Administration',
    'Pres. of Hockey Operations',
    'President',
    'Special Asst. to GM',
    'Sr. VP of Hockey Operations',
    'VP. of Hockey Operations',
    'Vice President',
}
coaching = {
    'Assoc. Coach',
    'Asst. Coach',
    'Asst. GM/Asst. Coach',
    'Dir. of Coaching',
    'Dir. of Conditioning',
    'Dir. of Player Development',
    'Dir. of Player Evaluation',
    'Goalie Consultant',
    'Goaltending Coach',
    'Head Coach',
    'Player-Asst. Coach',
    'Skating Coach',
    'Skating/Skills Coach',
    'Skills Coach',
    'Special Assignment Coach',
    'Video Coach',
}
ownership = { 
    'CEO',
    'Chairman',
    'Coach',
    'Conditioning Coach',
    'Development Coach',
    'Franchise Owner',
    'Senior Advisor',
}
scouting = {
    'Dir. of Amateur Scouting',
    'Dir. of Collegiate Scouting',
    'Dir. of European Scouting',
    'Dir. of Player Personnel',
    'Dir. of Professional Scouting',
    'Dir. of Recruitment',
    'Dir. of Scouting',
    'Scout',
    'Scouting Coordinator',
}
support = { 
    'Asst. Equipment Manager',
    'Athletic Trainer',
    'Equipment Manager',
    'Head Equipment Manager',
    'Massage Therapist',
    'Mental Coach',
    'Physical Therapist',
    'Team Consultant',
    'Team Manager',
    'Youth Hockey Supervisor'
}

def get_title_category(title):
    if title in hockey_ops:
        return 'HockeyOps'
    elif title in coaching:
        return 'Coaching'
    elif title in ownership:
        return 'Ownership'
    elif title in scouting:
        return 'Scouting'
    elif title in support:
        return 'Support'
    return 'Other'

def get_node_color(title):
    if title == 'HockeyOps':
        return 'red'
    elif title == 'Coaching':
        return 'blue'
    elif title == 'Ownership':
        return 'green'
    elif title == 'Scouting':
        return 'yellow'
    elif title == 'Support':
        return 'white'
    return 'grey'