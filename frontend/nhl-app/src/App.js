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
import React, { useEffect, useState } from 'react';
import { Trades } from './components/trades';
import { CSSTransition } from 'react-transition-group';

function App() {
  const [trades, setTrades] = useState([]);
  const [generalManager, setGeneralManager] = useState('All');
  const [season, setSeason] = useState('All');
  const [stats, setStats] = useState('{}')
  const [viewStats, setViewStats] = useState(true);
  const [graphLayout, setGraphLayout] = useState(false);
  // const seasons = ["All","2020-21", "2019-20"]

  useEffect(() => {
    // update trade data
    var gm_str = `${generalManager}`.replace(' ', '+')
    fetch(`/trades/gm?name=${gm_str}&season=${season}`).then(response => 
      response.json().then(data => {;
        setTrades(data.trades)
    }));

    fetch(`/trades/stats?name=${gm_str}&season=${season}`).then(response => 
      response.json().then(data => {;
        setStats(data.stats)
    }));
  }, [generalManager, season])

  useEffect(() => {
    // force graph to re-render
    setGraphLayout(!graphLayout)
  }, [trades])


  console.log(trades);
  console.log(generalManager);
  console.log(season);
  console.log(stats)
  console.log(viewStats);
  console.log(graphLayout);

  return (
    <div className="App">      
      <Navbar>
        {/* {generalManager}'s Trade Graph */}
        <NavTitle>NHL Trade Graph</NavTitle>

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

      <Body>
        {viewStats && <TradeStats width="100%" generalManager={generalManager} season={season} stats={stats}/>}
        {/* {!viewStats && <TradeStats width="100%" generalManager={generalManager} season={season} stats={stats}/>} */}
        <div className="trade-stats-accordian" onClick={() => setViewStats(!viewStats)}>view stats</div>
        <TradeGraph trades={trades} graphLayout={graphLayout} viewStats={viewStats}></TradeGraph>
      </Body>
      
      

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

function Body(props) {
  return (
    <div className="body">
      {props.children}
    </div>
  )
}

function TradeStats(props) {
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
    <div className="trade-stats">
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

function TradeGraph(props) {
  // need layout var to change 'coolingFactor' so that we can force trade graph to refresh
  // without slight change, nodes will be stacked ontop of eachother when we select a new season/gm
  var layout = layout = {
                  name: 'cola',
                  componentSpacing: 40,
                  coolingFactor: 0.98
                }
  if (props.graphLayout) {
    layout = {
      name: 'cola',
      componentSpacing: 40,
      coolingFactor: 0.99
    }
  }
  console.log(layout)

  var style = {height: 'calc(100vh - 80px)', width: 'calc(100vw - 25px)'}
  if(props.viewStats) {
    style = {height: 'calc(100vh - 61px)', width: 'calc(100vw - 375px)'}
  }

  return (
    <div className="trade-graph">
      <Trades trades={props.trades} layout={layout} style={style}/>
    </div>
  )
}

export default App;
