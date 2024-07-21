const { ChampionsLeagueFixtures } = require("../models");

const championsLeagueFixturesData = [
  {
    gameweek: 1,
    league_entry_1: 82627,
    league_entry_1_points: 30,
    league_entry_2: 83210,
    league_entry_2_points: 27
  },
  {
    gameweek: 6,
    league_entry_1: 83210,
    league_entry_1_points: 31,
    league_entry_2: 70583,
    league_entry_2_points: 42
  },
  {
    gameweek: 10,
    league_entry_1: 82627,
    league_entry_1_points: 28,
    league_entry_2: 70583,
    league_entry_2_points: 37
  },
  {
    gameweek: 13,
    league_entry_1: 83210,
    league_entry_1_points: 34,
    league_entry_2: 82627,
    league_entry_2_points: 43
  }  
];

const seedChampionsLeagueFixtures = () => ChampionsLeagueFixtures.bulkCreate(championsLeagueFixturesData);

module.exports = seedChampionsLeagueFixtures;
