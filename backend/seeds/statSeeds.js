// Seed file for Stat table

const { Stat } = require("../models");

// need to create a loop to generate stat data for all 38 gameweeks
const allStatArray = [];
const seedPlayers = [
  {
    owner_id: 82627,
    entry_id: 82391,
    person: "TeamMax",
    league_id: 24003
  },
  {
    owner_id: 83210,
    entry_id: 82971,
    person: "TeamEli",
    league_id: 24003
  },
  {
    owner_id: 70583,
    entry_id: 70394,
    person: "TeamRyan",
    league_id: 20667
  },
  {
    owner_id: 70949,
    entry_id: 70760,
    person: "TeamPat",
    league_id: 20667
  }
];

for (var i = 0; i < 38; i++) {
  for (var y = 0; y < seedPlayers.length; y++) {
    var stat = {
      minutes: Math.floor(Math.random() * (990 - 300) + 300),
      goals_scored: Math.floor(Math.random() * (5 - 0) + 0),
      assists: Math.floor(Math.random() * (5 - 0) + 0),
      clean_sheets: Math.floor(Math.random() * (10 - 0) + 0),
      goals_conceded: Math.floor(Math.random() * (10 - 0) + 0),
      yellow_cards: Math.floor(Math.random() * (4 - 0) + 0),
      red_cards: Math.floor(Math.random() * (2 - 0) + 0),
      bonus: Math.floor(Math.random() * (10 - 0) + 0),
      total_points: Math.floor(Math.random() * (60 - 10) + 10),
      league_id: seedPlayers[y].league_id,
      entry_id: seedPlayers[y].entry_id,
      person: seedPlayers[y].person,
      gameweek: i,
      owner_id: seedPlayers[y].owner_id
    };
    allStatArray.push(stat);
  }
}

const seedAllStats = () => Stat.bulkCreate(allStatArray);

module.exports = seedAllStats;
