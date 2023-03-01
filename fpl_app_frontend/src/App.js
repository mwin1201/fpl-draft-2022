//import logo from './logo.svg';
import './App.css';

import {BrowserRouter as Router, Route, Routes} from "react-router-dom";

import Homepage from './pages/Homepage';
import Fixtures from './pages/Fixtures';
import PremPlayers from './pages/PremPlayers';
//import Lineups from './pages/Lineups';
import HeadtoHead from './pages/HeadtoHead';
import Aggregate from './pages/Aggregate';
import Draft from './pages/Draft';
import GameweekStats from './pages/GameweekStats';
import SeasonLeaders from './pages/SeasonLeaders';
import PremFixtures from './pages/PremFixtures';

import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path='/' element={<Homepage/>}></Route>
        <Route path='/fixtureHistory' element={<Fixtures/>}></Route>
        <Route path='/premPlayers' element={<PremPlayers/>}></Route>
        <Route path='/matchups' element={<HeadtoHead/>}></Route>
        <Route path='/aggregate' element={<Aggregate/>}></Route>
        <Route path='/draft' element={<Draft/>}></Route>
        <Route path='/gameweekStats' element={<GameweekStats/>}></Route>
        <Route path='/seasonLeaders' element={<SeasonLeaders/>}></Route>
        <Route path='/premFixtures' element={<PremFixtures/>}></Route>
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
