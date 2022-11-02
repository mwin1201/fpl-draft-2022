import logo from './logo.svg';
import './App.css';

import {BrowserRouter as Router, Route, Routes} from "react-router-dom";

import Homepage from './pages/Homepage';
import Fixtures from './pages/Fixtures';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Homepage/>}></Route>
        <Route path='/fixtureHistory' element={<Fixtures/>}></Route>
      </Routes>
    </Router>
  );
}

export default App;
