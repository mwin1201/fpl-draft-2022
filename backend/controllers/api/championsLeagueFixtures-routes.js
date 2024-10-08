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

// GET all champions league fixtures for gameweek /api/championsLeagueFixtures/gameweek/:gameweek
router.get("/gameweek/:gameweek", (req, res) => {
  ChampionsLeagueFixtures.findAll({
    where:{
      gameweek: req.params.gameweek
    }
  })
  .then(dbChampionsLeagueFixturesdata => res.status(200).json(dbChampionsLeagueFixturesdata))
  .catch(err => {
    res.status(500).json(err);
  });
})


router.post("/", (req, res) => {
  ChampionsLeagueFixtures.create({
    gameweek: req.body.gameweek,
    league_entry_1: req.body.league_entry_1,
    league_entry_1_points: req.body.league_entry_1_points,
    league_entry_2: req.body.league_entry_2,
    league_entry_2_points: req.body.league_entry_2_points
  })
  .then((dbChampionsLeagueFixturesdata) => res.status(200).json(dbChampionsLeagueFixturesdata))
  .catch(err => {
    res.status(500).json(err);
  });
});

// remove a champions league fixture /api/championsLeagueFixtures/:id
router.delete("/:id", (req, res) => {
  ChampionsLeagueFixtures.destroy({
    where: {
      id: req.params.id
    }
  })
  .then(dbChampionsLeagueFixturesdata => {
    if (!dbChampionsLeagueFixturesdata) {
      res.status(404).json({ message: "No champions league fixture found with this id" });
      return;
    }
    res.status(200).json(dbChampionsLeagueFixturesdata);
  })
  .catch(err => {
    res.status(500).json(err);
  });
});

module.exports = router;
