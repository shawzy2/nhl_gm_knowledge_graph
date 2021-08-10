// import logo from './logos/bruins.svg';
// import { ReactComponent as Bruins } from './logos/bruins.svg';
// import './App.css';
// import React, { useEffect, useState } from 'react';
// import { Trades } from './components/trades';
// import { CSSTransition } from 'react-transition-group';
// // import { DropdownExampleSearchSelection } from './components/dropdown';
// // import { DropdownMenu } from 'semantic-ui-react';

// function App() {

//   const [trades, setTrades] = useState([]);
//   const [generalManager, setGeneralManager] = useState('All');

//   // /trades/gm?name=Stan+Bowman
//   useEffect(() => {
//     fetch('/trades/gm').then(response => 
//       response.json().then(data => {
//         // setTrades(JSON.stringify(data));
//         setTrades(data.trades)
//     }))
//   }, [])

//   function handleClick(generalManager) {
//     console.log('change from app: ' + generalManager)
//     // props.onClick(generalManager)
//   }

//   console.log(trades);
//   console.log('gm: ' + generalManager)

//   return (
//     <div className="App">
//       {/* <header className="App-nav">
//         <div className="App-nav-logo">
//           <img src={logo} className="App-logo" alt="logo" />
//         </div>
//         <div className="App-nav-dropdown">
//           <form action="/action_page.php">
//             <label for="team">Filter by Team Name:</label>
//             <select id="team" name="team">
//               <option value="car">Carolina Hurricanes</option>
//               <option value="chi">Chicago Blackhawks</option>
//             </select>
//           </form>
//         </div>
//         <div class="ui container">
//           <DropdownExampleSearchSelection id='exampleSelect'/>
//         </div>
//       </header> */}
      
//       <Navbar>
//         {/* <NavTitle /> */}
//         <NavItem icon={<Bruins />} />
//         <NavItem icon="👨‍💻" />
//         <NavItem icon="🧑‍💻" />

//         <NavItem icon="⬇️" onClick={handleClick}>
//           <DropdownMenu onClick={handleClick} />
//         </NavItem>
//       </Navbar>

//       {/* <body className="App-body">
//         <Trades trades={trades}/>
//       </body> */}
      

//     </div>
//   );
// }

// function Navbar(props) {
//   return (
//     <nav className="navbar">
//       <ul className="navbar-nav"> { props.children } </ul>
//     </nav>
//   )
// }

// function NavItem(props) {
//   const [open, setOpen] = useState(false);

//   function handleChange(generalManager) {
//     console.log('change from navitem: ' + generalManager)
//     // props.onClick(generalManager)
//   }

//   return (
//   <li className="nav-item">
//     <a href="#" className="icon-button" onClick={() => setOpen(!open)} onChange={handleChange}>
//       { props.icon }
//     </a>

//     { open && props.children }
//   </li>
//   )
// }

// function DropdownMenu() {
//   const [activeMenu, setActiveMenu] = useState('main');

//   function handleClick(generalManager) {
//     console.log('change from dropdownmenu: ' + generalManager)
//     // props.onChange(generalManager)
//   }

//   function DropdownItem(props) {
//     const [selectedItem, setSelectedItem] = useState('None');

//     function handleClick(generalManager) {
//       console.log('change from dropdownitem: ' + generalManager)
//       props.onClick(generalManager)
//     }
    
//     useEffect(() => {
//       console.log(selectedItem)
//     })

//     return (
//       <a href="#" className="menu-item" onClick={() => handleClick(props.children)}>
//         <span className="icon-button">{ props.leftIcon }</span>
//         { props.children }

//         <span className="icon-right">{ props.rightIcon }</span>
//       </a>
//     )
//     // return (
//     //   <a href="#" className="menu-item" onClick={() => setSelectedItem(props.children)}>
//     //     <span className="icon-button">{ props.leftIcon }</span>
//     //     { props.children }

//     //     <span className="icon-right">{ props.rightIcon }</span>
//     //   </a>
//     // )
//   }

//   return (
//     <div className="dropdown">
//       <CSSTransition in={activeMenu === 'main'} unmountOnExit timeout={500} classNames="menu-primary">
//         <div className="menu">
//           <DropdownItem onClick={handleClick}>My Profile</DropdownItem>
//           <DropdownItem leftIcon={<Bruins />} onClick={handleClick}>Don Sweeney</DropdownItem>
//           <DropdownItem onClick={handleClick}>Don Waddell</DropdownItem>
//           <DropdownItem onClick={handleClick}>Stan Bowman</DropdownItem>
//           <DropdownItem onClick={handleClick}>David Shaw</DropdownItem>
//         </div>
//       </CSSTransition>

//       <CSSTransition in={activeMenu === 'settings'} unmountOnExit timeout={500} classNames="menu-secondary">
//         <div className="menu">
//           <DropdownItem>My Profile</DropdownItem>
//           <DropdownItem leftIcon={<Bruins />}>Don Sweeney</DropdownItem>
//         </div>
//       </CSSTransition>
//     </div>
//   )
// }

// export default App;


import logo from './logos/bruins.svg';
import { ReactComponent as Bruins } from './logos/bruins.svg';
import './App.css';
import React, { useEffect, useState } from 'react';
import { Trades } from './components/trades';
import { CSSTransition } from 'react-transition-group';

function App() {
  var endpoint = '/trades/gm';
  const [trades, setTrades] = useState([]);
  const [generalManager, setGeneralManager] = useState('All');
  const [graphLayout, setGraphLayout] = useState(false);

  useEffect(() => {
    // update trade data
    var gm_str = `${generalManager}`.replace(' ', '+')
    fetch(`/trades/gm?name=${gm_str}`).then(response => 
      response.json().then(data => {;
        setTrades(data.trades)
    }));
  }, [generalManager])

  useEffect(() => {
    // force graph to re-render
    setGraphLayout(!graphLayout)
  }, [trades])


  console.log(trades)
  console.log(generalManager)
  console.log(graphLayout)

  return (
    <div className="App">      
      <Navbar>
        {/* {generalManager}'s Trade Graph */}
        <NavTitle>{generalManager}</NavTitle>
        <NavItem icon={<Bruins />}/>
        <NavItem icon="👨‍💻" />
        <NavItem icon="🧑‍💻" />

        <NavItem icon="⬇️">
          <DropdownMenu>
            <DropdownItem onClick={() => setGeneralManager("All")}>All</DropdownItem>
            <DropdownItem onClick={() => setGeneralManager("Don Sweeney")} leftIcon={<Bruins />} >Don Sweeney</DropdownItem>
            <DropdownItem onClick={() => setGeneralManager("Don Waddell")}>Don Waddell</DropdownItem>
            <DropdownItem onClick={() => setGeneralManager("Stan Bowman")}>Stan Bowman</DropdownItem>
            <DropdownItem onClick={() => setGeneralManager("David Shaw")} leftIcon={<Bruins />}>David Shaw</DropdownItem>
          </DropdownMenu>
        </NavItem>
      </Navbar>

      <div>
        <TradeGraph trades={trades} graphLayout={graphLayout}></TradeGraph>
      </div>
      
      

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
      {props.children} Trades Graph
    </h1>
  )
}

function NavItem(props) {
  const [open, setOpen] = useState(false);

  return (
  <li className="nav-item">
    <a href="#" className="icon-button" onClick={() => setOpen(!open)}>
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

function TradeGraph(props) {
  var layout = {name: 'random'}
  if (props.graphLayout) {
    layout = {name: 'cola'}
  }
  // const layout = {name: `${props.graphLayout}`}
  console.log(layout)
  return (
    <body className="App-body">
      <Trades trades={props.trades} layout={layout}/>
    </body>
  )
}

export default App;
