import { ReactComponent as Nhl } from './logos/nhl.svg';
import { ReactComponent as Anaheim } from './logos/anaheim.svg';
import { ReactComponent as Arizona } from './logos/arizona.svg';
import { ReactComponent as Boston } from './logos/boston.svg';
import { ReactComponent as Buffalo } from './logos/buffalo.svg';
import { ReactComponent as Calgary } from './logos/calgary.svg';
import { ReactComponent as Carolina } from './logos/carolina.svg';
import { ReactComponent as Chicago } from './logos/chicago.svg';
import { ReactComponent as Colorado } from './logos/colorado.svg';
import { ReactComponent as Columbus } from './logos/columbus.svg';
import { ReactComponent as Dallas } from './logos/dallas.svg';
import { ReactComponent as Detroit } from './logos/detroit.svg';
import { ReactComponent as Edmonton } from './logos/edmonton.svg';
import { ReactComponent as Florida } from './logos/florida.svg';
import { ReactComponent as Losangeles } from './logos/losangeles.svg';
import { ReactComponent as Minnesota } from './logos/minnesota.svg';
import { ReactComponent as Montreal } from './logos/montreal.svg';
import { ReactComponent as Nashville } from './logos/nashville.svg';
import { ReactComponent as Newjersey } from './logos/newjersey.svg';
import { ReactComponent as Newyorkislanders } from './logos/newyorkislanders.svg';
import { ReactComponent as Newyorkrangers } from './logos/newyorkrangers.svg';
import { ReactComponent as Ottawa } from './logos/ottawa.svg';
import { ReactComponent as Philadelphia } from './logos/philadelphia.svg';
import { ReactComponent as Pittsburgh } from './logos/pittsburgh.svg';
import { ReactComponent as Sanjose } from './logos/sanjose.svg';
import { ReactComponent as Seattle } from './logos/seattle.svg';
import { ReactComponent as Stlouis } from './logos/stlouis.svg';
import { ReactComponent as Tampa } from './logos/tampa.svg';
import { ReactComponent as Toronto } from './logos/toronto.svg';
import { ReactComponent as Vancouver } from './logos/vancouver.svg';
import { ReactComponent as Vegas } from './logos/vegas.svg';
import { ReactComponent as Washington } from './logos/washington.svg';
import { ReactComponent as Winnipeg } from './logos/winnipeg.svg';

import './App.css';
import React, { useEffect, useState, useRef } from 'react';
import { CSSTransition } from 'react-transition-group';
import CytoscapeComponent from 'react-cytoscapejs';
import cytoscape from 'cytoscape';
import cola from 'cytoscape-cola';

cytoscape.use( cola );

function App() {
  const [category, setCategory] = useState('staff') /* i.e. 'trades', 'staff', ... */
  const [graphData, setGraphData] = useState([]);
  const [generalManager, setGeneralManager] = useState('All');
  const [season, setSeason] = useState('2021-22');
  const [stats, setStats] = useState('{}')
  const [viewStats, setViewStats] = useState(true);
  const [details, setDetails] = useState([[]]);
  const [viewDetails, setViewDetails] = useState(false);
  const [selectedGraphItem, setSelectedGraphItem] = useState('');
  const [graphLayout, setGraphLayout] = useState(false);
  const myCyRef = useRef([]);
  const [refreshData, setRefreshData] = useState(false);
  // const seasons = ["All","2020-21", "2019-20"]

  useEffect(() => {
    // update graph data
    var gm_str = `${generalManager}`.replace(' ', '+')
    fetch(`/${category}/name?name1=${gm_str}&season=${season}`).then(response => 
      response.json().then(data => {;
        setGraphData(data.graphData)
    }));

    fetch(`/${category}/stats?name1=${gm_str}&season=${season}`).then(response => 
      response.json().then(data => {;
        setStats(data.stats)
    }));
  }, [generalManager, season])

  useEffect(() => {
    // force graph to re-render
    setGraphLayout(!graphLayout)
  }, [graphData])

  useEffect(() => {
    // get selected node/edge in graph
    var noSelection = true;
    for (const element of myCyRef.current) { 
      if (element._private.selected) { 
        setSelectedGraphItem(element._private.data); 
        noSelection = false;
      }
    }
    if (noSelection) {
      setSelectedGraphItem('none');
    }
  }, [refreshData]);

  useEffect(() => {
    var name = selectedGraphItem.name; 
    var apiEndpoint =  `/${category}/list?name1=${name}`;
    if (!name) {
      var source = selectedGraphItem.source;
      var target = selectedGraphItem.target;
      apiEndpoint = `/${category}/list?name1=${source}&name2=${target}`;
    } 

    fetch(apiEndpoint).then(response => 
      response.json().then(data => 
        setDetails(data)
    ));
  }, [selectedGraphItem]);

  console.log(graphData);
  console.log(stats);
  console.log('gm: ' + generalManager);
  console.log('season: ' + season);
  console.log('viewStats: ' + viewStats);
  console.log('viewDetails: ' + viewDetails);
  console.log(graphLayout);
  console.log(selectedGraphItem)
  console.log(details)

  return (
    <div className="App">      
      <Navbar>
        {/* {generalManager}'s Trade Graph */}
        <NavTitle >NHL Trade Graph</NavTitle>

        <NavItem icon="Select Season">
          <DropdownMenu>
            {/* { seasons.map(x => <DropdownItem onClick={() => setSeason(x)}>{ x }</DropdownItem>) } */}
            <DropdownItem onClick={() => setSeason("All")}>All</DropdownItem>
            <DropdownItem onClick={() => setSeason("2021-22")}>2021-22</DropdownItem>
            <DropdownItem onClick={() => setSeason("2020-21")}>2020-21</DropdownItem>
            <DropdownItem onClick={() => setSeason("2019-20")}>2019-20</DropdownItem>
            <DropdownItem onClick={() => setSeason("2018-19")}>2018-19</DropdownItem>
            <DropdownItem onClick={() => setSeason("2017-18")}>2017-18</DropdownItem>
            <DropdownItem onClick={() => setSeason("2016-17")}>2016-17</DropdownItem>
            <DropdownItem onClick={() => setSeason("2015-16")}>2015-16</DropdownItem>
            <DropdownItem onClick={() => setSeason("2014-15")}>2014-15</DropdownItem>
            <DropdownItem onClick={() => setSeason("2013-14")}>2013-14</DropdownItem>
            <DropdownItem onClick={() => setSeason("2012-13")}>2012-13</DropdownItem>
            <DropdownItem onClick={() => setSeason("2011-12")}>2011-12</DropdownItem>
            <DropdownItem onClick={() => setSeason("2010-11")}>2010-11</DropdownItem>
            <DropdownItem onClick={() => setSeason("2009-10")}>2009-10</DropdownItem>
            <DropdownItem onClick={() => setSeason("2008-09")}>2008-09</DropdownItem>
            <DropdownItem onClick={() => setSeason("2007-08")}>2007-08</DropdownItem>
            <DropdownItem onClick={() => setSeason("2006-07")}>2006-07</DropdownItem>
            <DropdownItem onClick={() => setSeason("2005-06")}>2005-06</DropdownItem>
            <DropdownItem onClick={() => setSeason("2004-05")}>2004-05</DropdownItem>
            <DropdownItem onClick={() => setSeason("2003-04")}>2003-04</DropdownItem>
            <DropdownItem onClick={() => setSeason("2002-03")}>2002-03</DropdownItem>
            <DropdownItem onClick={() => setSeason("2002-03")}>2002-03</DropdownItem>
            <DropdownItem onClick={() => setSeason("2000-01")}>2000-01</DropdownItem>
          </DropdownMenu>
        </NavItem>

        <NavItem icon="Select GM">
          <DropdownMenu>
            <DropdownItem onClick={() => setGeneralManager("All")} leftIcon={<Nhl />} >All</DropdownItem> 

            {/* Current GMs in alphabetical order by team name */}
            <DropdownItem onClick={() => setGeneralManager("Bob Murray")} leftIcon={<Anaheim />} >Bob Murray</DropdownItem>
            <DropdownItem onClick={() => setGeneralManager("Bill Armstrong")} leftIcon={<Arizona />} >Bill Armstrong</DropdownItem>
            <DropdownItem onClick={() => setGeneralManager("Don Sweeney")} leftIcon={<Boston />} >Don Sweeney</DropdownItem>
            <DropdownItem onClick={() => setGeneralManager("Kevyn Adams")} leftIcon={<Buffalo />} >Kevyn Adams</DropdownItem>
            <DropdownItem onClick={() => setGeneralManager("Brad Treliving")} leftIcon={<Calgary />} >Brad Treliving</DropdownItem>
            <DropdownItem onClick={() => setGeneralManager("Don Waddell")} leftIcon={<Carolina />} >Don Waddell</DropdownItem>
            <DropdownItem onClick={() => setGeneralManager("Stan Bowman")} leftIcon={<Chicago />} >Stan Bowman</DropdownItem>
            <DropdownItem onClick={() => setGeneralManager("Joe Sakic")} leftIcon={<Colorado />} >Joe Sakic</DropdownItem>
            <DropdownItem onClick={() => setGeneralManager("Jarmo Kekalainen")} leftIcon={<Columbus />} >Jarmo Kekalainen</DropdownItem>
            <DropdownItem onClick={() => setGeneralManager("Jim Nill")} leftIcon={<Dallas />} >Jim Nill</DropdownItem>
            <DropdownItem onClick={() => setGeneralManager("Steve Yzerman")} leftIcon={<Detroit />} >Steve Yzerman</DropdownItem>
            <DropdownItem onClick={() => setGeneralManager("Ken Holland")} leftIcon={<Edmonton />} >Ken Holland</DropdownItem>
            <DropdownItem onClick={() => setGeneralManager("Bill Zito")} leftIcon={<Florida />} >Bill Zito</DropdownItem>
            <DropdownItem onClick={() => setGeneralManager("Rob Blake")} leftIcon={<Losangeles />} >Rob Blake</DropdownItem>
            <DropdownItem onClick={() => setGeneralManager("Bill Guerin")} leftIcon={<Minnesota />} >Bill Guerin</DropdownItem>
            <DropdownItem onClick={() => setGeneralManager("Marc Bergevin")} leftIcon={<Montreal />} >Marc Bergevin</DropdownItem>
            <DropdownItem onClick={() => setGeneralManager("David Poile")} leftIcon={<Nashville />} >David Poile</DropdownItem>
            <DropdownItem onClick={() => setGeneralManager("Tom Fitzgerald")} leftIcon={<Newjersey />} >Tom Fitzgerald</DropdownItem>
            <DropdownItem onClick={() => setGeneralManager("Lou Lamoriello")} leftIcon={<Newyorkislanders />} >Lou Lamoriello</DropdownItem>
            <DropdownItem onClick={() => setGeneralManager("Chris Drury")} leftIcon={<Newyorkrangers />} >Chris Drury</DropdownItem>
            <DropdownItem onClick={() => setGeneralManager("Pierre Dorion")} leftIcon={<Ottawa />} >Pierre Dorion</DropdownItem>
            <DropdownItem onClick={() => setGeneralManager("Chuck Fletcher")} leftIcon={<Philadelphia />} >Chuck Fletcher</DropdownItem>
            <DropdownItem onClick={() => setGeneralManager("Ron Hextall")} leftIcon={<Pittsburgh />} >Ron Hextall</DropdownItem>
            <DropdownItem onClick={() => setGeneralManager("Doug Wilson")} leftIcon={<Sanjose />} >Doug Wilson</DropdownItem>
            <DropdownItem onClick={() => setGeneralManager("Ron Francis")} leftIcon={<Seattle />} >Ron Francis</DropdownItem>
            <DropdownItem onClick={() => setGeneralManager("Doug Armstrong")} leftIcon={<Stlouis />} >Doug Armstrong</DropdownItem>
            <DropdownItem onClick={() => setGeneralManager("Julien BriseBois")} leftIcon={<Tampa />} >Julien BriseBois</DropdownItem>
            <DropdownItem onClick={() => setGeneralManager("Kyle Dubas")} leftIcon={<Toronto />} >Kyle Dubas</DropdownItem>
            <DropdownItem onClick={() => setGeneralManager("Jim Benning")} leftIcon={<Vancouver />} >Jim Benning</DropdownItem>
            <DropdownItem onClick={() => setGeneralManager("Kelly McCrimmon")} leftIcon={<Vegas />} >Kelly McCrimmon</DropdownItem>
            <DropdownItem onClick={() => setGeneralManager("Brian MacLellan")} leftIcon={<Washington />} >Brian MacLellan</DropdownItem>
            <DropdownItem onClick={() => setGeneralManager("Kevin Cheveldayoff")} leftIcon={<Winnipeg />} >Kevin Cheveldayoff</DropdownItem>

            <DropdownItem onClick={() => setGeneralManager("David Shaw")} leftIcon={<Boston />}>David Shaw</DropdownItem>
          </DropdownMenu>
        </NavItem>
      </Navbar>

      <div className="body" onClick={() => setRefreshData(!refreshData)}>
        {viewStats && <Stats width="100%" generalManager={generalManager} season={season} stats={stats}/>}
        <div className="stats-accordian" onClick={() => setViewStats(!viewStats)}>view stats</div>
        <Graph category={category} graphData={graphData} graphLayout={graphLayout} viewStats={viewStats} viewDetails={viewDetails} myCyRef={myCyRef}></Graph>
        <button class='show-details-button' disabled={selectedGraphItem=="none"} onClick={() => setViewDetails(!viewDetails)}>View Details</button>
      </div>
      {viewDetails && <button className="close-details-button" onClick={() => setViewDetails(!viewDetails)}>x</button>}
      {viewDetails && <Details selectedGraphItem={selectedGraphItem} details={details}></Details>}

    </div>
  );
}

function Navbar(props) {
  return (
    <nav className="navbar">
      <ul className="navbar-nav"> { props.children } </ul>
    </nav>
  )
}

function NavTitle(props) {
  return (
    <h1 className="navbar-title">
      {props.children}
    </h1>
  )
}

function NavItem(props) {
  const [open, setOpen] = useState(false);

  return (
  <li className="nav-item">
    <a href="#" className="nav-icon-button" onClick={() => setOpen(!open)}>
      { props.icon }
    </a>

    { open && props.children }
  </li>
  )
}

function DropdownMenu(props) {
  const [activeMenu, setActiveMenu] = useState('main');

  return (
    <div className="dropdown">
      <CSSTransition in={activeMenu === 'main'} unmountOnExit timeout={500} classNames="menu-primary">
        <div className="menu">
          {props.children}
        </div>
      </CSSTransition>
    </div>
  )
}

function DropdownItem(props) {

  function handleClick() {
    props.onClick(props.children)
  }

  return (
    <a href="#" className="menu-item" onClick={handleClick}>
      <span className="icon-button">{ props.leftIcon }</span>
        { props.children }
      <span className="icon-right">{ props.rightIcon }</span>
    </a>
  )
}

function Stats(props) {
  /* TODO: use 'map' to display these items */
  var statsParsed = JSON.parse(props.stats);

  /* season stats */
  var totalTradesSzn = statsParsed['totalTradesSzn']
  var avgTradesSzn = statsParsed['avgTradesSzn']
  var mostActiveManagerSzn = statsParsed['mostActiveManagerSzn']

  /* gm stats */
  var totalTradesGM = statsParsed['totalTradesGM']
  var shareOfTradesGM = statsParsed['shareOfTradesGM']
  var avgTradesGM = statsParsed['avgTradesGM']
  var tradePartnerGM = statsParsed['tradePartnerGM']
  var connectivityGM = statsParsed['connectivityGM']

  return (
    <div className="stats-list">
      <h1>Season: {props.season}</h1>
      <ul>
        <li>Total Trades: {totalTradesSzn}</li>
        <li>Average Trades per GM this Season: {avgTradesSzn}</li>
        <li>Most Active GM: {mostActiveManagerSzn}</li>
      </ul>
      <h1>GM: {props.generalManager}</h1>
      <ul>
        <li>Total Trades: {totalTradesGM}</li>
        <li>Share of Trades: {shareOfTradesGM}</li>
        <li>Average Trades per Season: {avgTradesGM}</li>
        <li>Favorite Trade Partner: {tradePartnerGM}</li>
      </ul>
    </div>
    
  )
}

function Graph(props) {
  // need layout var to change 'coolingFactor' so that we can force trade graph to refresh
  // without slight change, nodes will be stacked ontop of eachother when we select a new season/gm
  var layout_name = 'cola';
  if (props.category=='staff'){
    layout_name = 'preset'
  }
  var layout = layout = {
                  name: layout_name,
                  componentSpacing: 40,
                  coolingFactor: 0.98
                }
  if (props.graphLayout) {
    layout = {
      name: layout_name,
      componentSpacing: 40,
      coolingFactor: 0.99
    }
  } 

  var style = {height: 'calc(100vh - 80px)', width: 'calc(100vw - 21px)'}
  if(props.viewStats) {
    style = {height: 'calc(100vh - 61px)', width: 'calc(100vw - 371px)'}
  }

  const stylesheet = [
    {
      selector: 'node',
      style: {
        width: 20,
        height: 20,
        color: 'white',
        label: 'data(id)',
        "background-color": "data(nodeColor)",
        "font-size": "10px"
      }
    },
    {
      selector: 'edge',
      style: {
        width: 2,
        "curve-style": 'bezier'
      }
    },
    {
      selector: ':selected',
      css: {
        'background-color': '#FFB81C',
        'line-color': '#FFB81C'
      }
    }
  ]

  return (
    <div>
      <CytoscapeComponent className="graph" elements={props.graphData} layout={layout} style={style} 
                            stylesheet={stylesheet} minZoom={.5} maxZoom={4} cy={(cy) => { props.myCyRef.current = cy._private.elements }} />
    </div>
  );
}

function Details(props) {
  var cols = ['Date', 'GM1', 'GM2']
  if (props.selectedGraphItem.name) {
    var header = 'Trade History for ' + props.selectedGraphItem.name
  } else {
    var header = 'Trade History between ' + props.selectedGraphItem.source + ' and ' + props.selectedGraphItem.target
  }

  return (
    <div className="view-details-display">
      <h2>{header}</h2>
      <table>
        <tr>
          { cols.map(x => <th>{x}</th>) }
        </tr>
        { props.details.map( row => 
          <tr>
            { row.map( element => <td>{ element }</td> ) }
          </tr>
        ) }
      </table>
    </div>
  )
}

export default App;
