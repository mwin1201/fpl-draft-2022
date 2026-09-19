import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Welcome from "./pages/Welcome";
import Homepage from "./pages/Homepage";
import Fixtures from "./pages/Fixtures";
import PremPlayers from "./pages/PremPlayers";
import HeadtoHead from "./pages/HeadtoHead";
import Aggregate from "./pages/Aggregate";
import Draft from "./pages/Draft";
import GameweekStats from "./pages/GameweekStats";
import SeasonLeaders from "./pages/SeasonLeaders";
import PremFixtures from "./pages/PremFixtures";
import Profile from "./pages/Profile";
import ChampionshipPlayoffs from "./pages/ChampionshipPlayoffs";

import Header from "./components/Header";
import Footer from "./components/Footer";
import LeagueLayout from "./components/LeagueLayout";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        {/* Public welcome page: choose a league */}
        <Route path="/" element={<Welcome />}></Route>

        {/* Everything else is scoped to a selected league. LeagueLayout loads
            the data and redirects to "/" if no league is selected. */}
        <Route element={<LeagueLayout />}>
          <Route path="/overview" element={<Homepage />}></Route>
          <Route path="/fixtureHistory" element={<Fixtures />}></Route>
          <Route path="/premPlayers" element={<PremPlayers />}></Route>
          <Route path="/matchups" element={<HeadtoHead />}></Route>
          <Route path="/aggregate" element={<Aggregate />}></Route>
          <Route path="/draft" element={<Draft />}></Route>
          <Route path="/gameweekStats" element={<GameweekStats />}></Route>
          <Route path="/seasonLeaders" element={<SeasonLeaders />}></Route>
          <Route path="/premFixtures" element={<PremFixtures />}></Route>
          <Route path="/profile/:id" element={<Profile />}></Route>
          <Route
            path="/championshipPlayoffs"
            element={<ChampionshipPlayoffs />}
          ></Route>
        </Route>
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
