const { ChampionsLeague } = require("../models");

const championsLeagueData = [
  {
    owner_id: 82627,
    team_name: "TeamMax"
  },
  {
    owner_id: 83210,
    team_name: "TeamEli"
  },
  {
    owner_id: 70583,
    team_name: "TeamRyan"
  }
];

const seedChampionsLeague = () => ChampionsLeague.bulkCreate(championsLeagueData);

module.exports = seedChampionsLeague;
