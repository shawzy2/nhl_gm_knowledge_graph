from flask import Blueprint, jsonify, request
from .. import db
from ..models import Trade
import json
from urllib.request import urlopen
from bs4 import BeautifulSoup
import datetime
import os
import pandas as pd
import logging
import ssl

trade_bp = Blueprint('trade_bp', __name__)


@trade_bp.route('/trades')
def trades_all():
    '''Returns list of all trades in db'''
    trade_list = Trade.query.all()
    trades = []

    for trade in trade_list:
        trades.append({'team1' : trade.team1, 
                        'team2' : trade.team2,
                        'team1_gm' : trade.team1_gm, 
                        'team2_gm' : trade.team2_gm,  
                        'date' : trade.date}
                    )

    return jsonify({'trades': trades})


@trade_bp.route('/trades/team')
def trades():
    '''Returns list of all trades matching team name
    Team name is passed in as a query string parameter'''
    team_name = request.args.get('name')
    if team_name is None:
        trade_list = Trade.query.all()
    else:
        trade_list = Trade.query.filter( (Trade.team1==team_name) | (Trade.team2==team_name) ).all()
    
    trades = []
    for trade in trade_list:
        trades.append({'team1' : trade.team1, 
                        'team2' : trade.team2,
                        'date' : trade.date}
                    )

    # return jsonify({'trades': trades})
    return jsonify({'trades': convert_to_cytoscape_json(trades, False)})


@trade_bp.route('/trades/name')
def trades_by_gm():
    '''Returns list of all trades matching gm name
    Team name is passed in as a query string parameter'''
    gm_name = request.args.get('name1')
    season = request.args.get('season')

    logging.warning('gmName: ' + gm_name)
    logging.warning('season: ' + season)

    trade_list = get_trade_list(gm_name, season)

    trades = []
    for trade in trade_list:
        trades.append({'team1_gm' : trade.team1_gm, 
                        'team2_gm' : trade.team2_gm,  
                        'date' : trade.date}
                    )

    # return jsonify({'trades': trades})
    return jsonify({'graphData': convert_to_cytoscape_json(trades, True)})


@trade_bp.route('/trades/list')
def trades_by_gm_list():
    '''Returns list of all trades matching one or two gm names
    Team name is passed in as a query string parameter'''
    gm_name1 = request.args.get('name1')
    gm_name2 = request.args.get('name2')

    if gm_name2 is None:
        trade_list = Trade.query.filter( (Trade.team1_gm==gm_name1) | (Trade.team2_gm==gm_name1) ).order_by(Trade.date.desc()).all()
        trades = []
        for trade in trade_list:
            if trade.team1_gm == gm_name1:
                trades.append([datetime.datetime.strftime(trade.date, '%d%b%Y'), trade.team1_gm, trade.team2_gm])
            else:
                trades.append([datetime.datetime.strftime(trade.date, '%d%b%Y'), trade.team2_gm, trade.team1_gm])
        return jsonify(trades)
    
    else:
        trade_list = Trade.query.filter( ((Trade.team1_gm==gm_name1) & (Trade.team2_gm==gm_name2)) | \
                                            ((Trade.team1_gm==gm_name2) & (Trade.team2_gm==gm_name1)) ).order_by(Trade.date.desc()).all()
        trades = []
        for trade in trade_list:
            if trade.team1_gm == gm_name1:
                trades.append([datetime.datetime.strftime(trade.date, '%d%b%Y'), trade.team1_gm, trade.team2_gm])
            else:
                trades.append([datetime.datetime.strftime(trade.date, '%d%b%Y'), trade.team2_gm, trade.team1_gm])
        return jsonify(trades)


@trade_bp.route('/trades/stats')
def stats_by_gm():
    # get query string params
    gm_name = request.args.get('name1')
    season = request.args.get('season')

    # calculate szn stats
    trade_list = get_trade_list("All", season)
    season_stats = []
    season_stats.append('Total Trades: ' + str(len(trade_list)))
    season_stats.append('Average Trades per GM: ' + str(get_avg_trades_per_gm(len(trade_list), season)))
    season_stats.append('Most Active GM: ' + get_most_active_gm(trade_list))

    # calculate gm stats
    trade_list = get_trade_list(gm_name, season)
    name_stats = []
    name_stats.append('Total Trades: ' + str(len(trade_list)))
    name_stats.append('Favorite Trade Partner: ' + get_favorite_trade_partner(gm_name, trade_list))

    all_stats = []
    all_stats.append(season_stats)
    all_stats.append(name_stats)
    return jsonify({'stats': all_stats})



@trade_bp.route('/trades/scrape', methods=['POST'])
def scrape():
    '''Refreshes DB with trade data'''
    Trade.query.delete()

    trades = scrape_trades()
    df_gms = get_gms()
    trades_and_gms = merge_trades_gms(trades, df_gms)

    for trade in trades_and_gms:
        new_trade = Trade(
                            team1=trade['team1'],
                            team2=trade['team2'],
                            team1_gm=trade['team1_gm'],
                            team2_gm=trade['team2_gm'],
                            date=trade['date']
                        )
        db.session.add(new_trade)
    
    db.session.commit()

    return 'Successfully scraped ' + str(len(trades_and_gms)) + ' trades', 201


def scrape_trades():
    '''Scrapes trades from website'''
    ssl._create_default_https_context = ssl._create_unverified_context
    trades_by_season = {}

    start_szn = 2000

    while start_szn < 2022:
        
        # format http link
        szn_str = str(start_szn) + '-' + str(start_szn+1)[2:]
        page_num = 1
        
        trades_for_szn = []
        while True:
            try:
                url = 'https://www.nhltradetracker.com/user/trade_list_by_season/' + szn_str + '/' + str(page_num)
                page = urlopen(url)
                html = page.read().decode("utf-8")
                soup = BeautifulSoup(html, 'html.parser')
                
                trades_for_this_page = return_trades_from_html(soup)
                if len(trades_for_this_page) == 0:
                    break
                trades_for_szn.extend(trades_for_this_page)
            except Exception as e:
                logging.warning(e)
                break
            
            page_num += 1
        
        
        trades_by_season[szn_str] = trades_for_szn
        start_szn += 1
        
    return trades_by_season


def return_teams_involved(teams_html):
    return [team.getText().strip('acquire').strip() for team in teams_html.find_all('td', align='center')]


def return_players_involved(players_html):
    players_by_team = []
    for players in players_html.find_all('td', width='75%'):
        players_by_team.append([player.getText().strip() for player in players.find_all('span')])
    return players_by_team


def return_date(players_html):
    date_str = players_html.find('td', width='20%').getText()
    return datetime.datetime.strptime(date_str, '%B %d, %Y').date()


def return_trades_from_html(html):
    trades = []
    trade_tables = html.find('div', id='container').find_all('table', align='center')
    for i in range(len(trade_tables)):
        # extract html
        tr = trade_tables[i].find_all('tr')

        # extract teams involved in trade
        teams_list = return_teams_involved(tr[0])

        # extract players involved in trade
        players_list = return_players_involved(tr[1])

        # extract date of trade
        date_of_trade = return_date(tr[1])

        # form dict object
        trade = {
            'team1': teams_list[0],
            'team2': teams_list[2],
            'team1_aquires': players_list[0],
            'team2_aquires': players_list[1],
            'date': date_of_trade
        }
        trades.append(trade)
    return trades


def get_gms():
    path = os.getcwd()
    path = os.path.abspath(os.path.join(path, 'backend/hand_tracked_data/gm_history.csv'))
    with open(path) as f:
        df_gm_hist = pd.read_csv(f)
    
    df = df_gm_hist[['team', 'start_date', 'name']]
    df = df.apply(lambda x: x.str.strip() if x.dtype == "object" else x)
    df['start_date'] = pd.to_datetime(df['start_date'], format="%B %d, %Y", errors='coerce')

    return df


def merge_trades_gms(trades, df_gms):
    trades_and_gms = []

    for year in trades:
        for trade in trades[year]:
            date = datetime.datetime.strptime(trade['date'].strftime("%d%b%Y"), '%d%b%Y')
            try:
                gm_1 = df_gms[ (df_gms['team']==trade['team1']) & (df_gms['start_date'] < date) ].iloc[-1]['name']
                gm_2 = df_gms[ (df_gms['team']==trade['team2']) & (df_gms['start_date'] < date) ].iloc[-1]['name']
                trade['team1_gm'] = gm_1
                trade['team2_gm'] = gm_2
                trades_and_gms.append(trade.copy())
            except Exception as e:
                logging.warning('line162: ' + str(trade))
                logging.warning(e)

    return trades_and_gms


def convert_to_cytoscape_json(data, get_gm):
    nodes_and_edges = []

    # set nodes as team names or gm names?
    key1 = 'team1'
    key2 = 'team2'
    if get_gm:
        key1 = 'team1_gm'
        key2 = 'team2_gm'

    # get nodes
    items = set()
    for trade in data:
        items.add(trade[key1])
        items.add(trade[key2])    
    nodes = [({ 'data': { 'id': item, 'name': item, "nodeColor": "grey" } }) for item in items]

    # get edges
    edges = [({'data': { 'source': trade[key1], 'target': trade[key2]}}) for trade in data]

    nodes_and_edges.extend(nodes)
    nodes_and_edges.extend(edges)

    return nodes_and_edges


def get_trade_list(gm_name, season):
    trade_list = []

    if gm_name == 'All' and season == 'All':
        trade_list = Trade.query.all()
    elif gm_name == 'All' and season != 'All':
        start_date = season.split('-')[0] + '-04-15'
        end_date = '20' + season.split('-')[1] + '-04-15'
        logging.warning(start_date)
        logging.warning(end_date)
        trade_list = Trade.query.filter( (Trade.date>(start_date)) & (Trade.date<(end_date)) ).all()
    elif gm_name != 'All' and season == 'All':
        trade_list = Trade.query.filter( (Trade.team1_gm==gm_name) | (Trade.team2_gm==gm_name) ).all()
    else:
        start_date = season.split('-')[0] + '-04-15'
        end_date = '20' + season.split('-')[1] + '-04-15'
        trade_list = Trade.query.filter( (Trade.date>(start_date)) & (Trade.date<(end_date)) & ((Trade.team1_gm==gm_name) | (Trade.team2_gm==gm_name)) ).all()
    
    return trade_list


def get_avg_trades_per_gm(total_trades, season):
    # control for expansion teams
    if season >= '2021-22':
        avg = total_trades / 32
    elif season >= '2017-18':
        avg = total_trades / 31
    else:
        avg = total_trades / 30
    return round(avg, 1)


def get_most_active_gm(trade_list):
    counts = {}
    for trade in trade_list:
        if trade.team1_gm not in counts:
            counts[trade.team1_gm] = 0
        counts[trade.team1_gm] += 1

        if trade.team2_gm not in counts:
            counts[trade.team2_gm] = 0
        counts[trade.team2_gm] += 1

    # get the most active gm

    most_active_gm = ''
    most_active_numTrades = 0
    for gm, numTrades in counts.items():
        if numTrades > most_active_numTrades:
            most_active_gm = gm
            most_active_numTrades = numTrades
    
    return most_active_gm + ' (' + str(most_active_numTrades) + ' trades)'

    
def get_favorite_trade_partner(gm_name, trade_list):
    counts = {}
    for trade in trade_list:
        if trade.team1_gm != gm_name:
            if trade.team1_gm not in counts:
                counts[trade.team1_gm] = 0
            counts[trade.team1_gm] += 1

        if trade.team2_gm != gm_name:
            if trade.team2_gm not in counts:
                counts[trade.team2_gm] = 0
            counts[trade.team2_gm] += 1

    # find this gm's favorite partner(s) to trade with
    most_active_numTrades = 0
    for gm, numTrades in counts.items():
        if numTrades > most_active_numTrades:
            most_active_numTrades = numTrades

    favs = []
    for gm, numTrades in counts.items():
        if numTrades == most_active_numTrades:
            favs.append(gm)

    if len(favs) > 2:
        return 'None'

    elif len(favs) == 2:
        return favs[0] + ' and ' + favs[1] + ' (' + str(most_active_numTrades) + ' trades)'
    
    return favs[0] + ' (' + str(most_active_numTrades) + ' trades)'
