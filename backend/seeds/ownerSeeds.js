// Seed file for Owner records

const { Owner } = require("../models");

const owners = [
  {
    team_name: "TeamMax",
    password: "rootroot",
    primary_league_id: 24003,
    entry_id: 82391,
    fpl_id: 82627,
    secondary_league_id: 20667
  },
  {
    team_name: "TeamEli",
    password: "rootroot",
    primary_league_id: 24003,
    entry_id: 82971,
    fpl_id: 83210,
    secondary_league_id: 20667
  },
  {
    team_name: "TeamRyan",
    password: "rootroot",
    primary_league_id: 20667,
    entry_id: 70394,
    fpl_id: 70583,
    secondary_league_id: 24003
  },
  {
    team_name: "TeamPat",
    password: "rootroot",
    primary_league_id: 20667,
    entry_id: 70760,
    fpl_id: 70949,
    secondary_league_id: 24003
  }
];

const seedOwners = () => Owner.bulkCreate(owners);

module.exports = seedOwners;
