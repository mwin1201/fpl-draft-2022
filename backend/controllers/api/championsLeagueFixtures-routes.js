const router = require("express").Router();
const { Op } = require('sequelize');
const { ChampionsLeagueFixtures } = require("../../models");

// GET all champions league fixtures
router.get("/", (req, res) => {
  ChampionsLeagueFixtures.findAll({
    attributes: ["id", "gameweek", "league_entry_1", "league_entry_1_points", "league_entry_2", "league_entry_2_points"]
  })
  .then((dbChampionsLeagueFixturesdata) => res.status(200).json(dbChampionsLeagueFixturesdata))
  .catch(err => {
    res.status(500).json(err);
  });
});

// GET all champions league fixtures for owner /api/championsLeagueFixtures/owner/:owner_id
router.get("/owner/:owner_id", (req, res) => {
  ChampionsLeagueFixtures.findAll({
    where:{
      [Op.or]: [{league_entry_1: req.params.owner_id}, {league_entry_2: req.params.owner_id}]
    }
  })
  .then(dbChampionsLeagueFixturesdata => res.status(200).json(dbChampionsLeagueFixturesdata))
  .catch(err => {
    res.status(500).json(err);
  });
});

module.exports = router;
