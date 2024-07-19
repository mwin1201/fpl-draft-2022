const { ChampionsLeague } = require("../models");

const championsLeagueData = [
  {
    owner_id: 82627
  },
  {
    owner_id: 83210
  },
  {
    owner_id: 70583
  }
];

const seedChampionsLeague = () => ChampionsLeague.bulkCreate(championsLeagueData);

module.exports = seedChampionsLeague;
