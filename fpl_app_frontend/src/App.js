import logo from './logo.svg';
import './App.css';

import {BrowserRouter as Router, Route, Routes} from "react-router-dom";

import Homepage from './pages/Homepage';
import Fixtures from './pages/Fixtures';
import PremPlayers from './pages/PremPlayers';
import Lineups from './pages/Lineups';
import Aggregate from './pages/Aggregate';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Homepage/>}></Route>
        <Route path='/fixtureHistory' element={<Fixtures/>}></Route>
        <Route path='/premPlayers' element={<PremPlayers/>}></Route>
        <Route path='/lineups' element={<Lineups/>}></Route>
        <Route path='/aggregate' element={<Aggregate/>}></Route>
      </Routes>
    </Router>
  );
}

export default App;
