//import logo from './logo.svg';
import "./App.css";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Homepage from "./pages/Homepage";
import Fixtures from "./pages/Fixtures";
import PremPlayers from "./pages/PremPlayers";
//import Lineups from './pages/Lineups';
import HeadtoHead from "./pages/HeadtoHead";
import Aggregate from "./pages/Aggregate";
import Draft from "./pages/Draft";
import GameweekStats from "./pages/GameweekStats";
import SeasonLeaders from "./pages/SeasonLeaders";
import PremFixtures from "./pages/PremFixtures";
import Dashboard from "./pages/Dashboard";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import UpdatePassword from "./pages/UpdatePassword";
import Bets from "./pages/Bets";
import Profile from "./pages/Profile";
import ChampionshipPlayoffs from "./pages/ChampionshipPlayoffs";
import ChampionsLeague from "./pages/ChampionsLeague";

import Header from "./components/Header";
import Footer from "./components/Footer";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Homepage />}></Route>
        <Route path="/signup" element={<SignUp />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/update" element={<UpdatePassword />}></Route>
        <Route path="/dashboard" element={<Dashboard />}></Route>
        <Route path="/fixtureHistory" element={<Fixtures />}></Route>
        <Route path="/premPlayers" element={<PremPlayers />}></Route>
        <Route path="/matchups" element={<HeadtoHead />}></Route>
        <Route path="/aggregate" element={<Aggregate />}></Route>
        <Route path="/draft" element={<Draft />}></Route>
        <Route path="/gameweekStats" element={<GameweekStats />}></Route>
        <Route path="/seasonLeaders" element={<SeasonLeaders />}></Route>
        <Route path="/premFixtures" element={<PremFixtures />}></Route>
        <Route path="/bets" element={<Bets />}></Route>
        <Route path="/profile/:id" element={<Profile />}></Route>
        <Route
          path="/championshipPlayoffs"
          element={<ChampionshipPlayoffs />}
        ></Route>
        <Route path="/championsLeague" element={<ChampionsLeague />}></Route>
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
