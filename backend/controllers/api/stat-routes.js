const router = require("express").Router();
const { Stat } = require("../../models");

// GET all stats for league /api/stats/league/24003
router.get("/league/:league_id", (req, res) => {
    Stat.findAll({
        where: {
            league_id: req.params.league_id
        }
    })
    .then((dbStatData) => {
        res.status(200).json(dbStatData);
    })
    .catch(err => {
        res.status(500).json(err);
    })
});

// GET all stats

// GET all stats for league and gameweek /api/stats/league/24003/gameweek/13
router.get("/league/:league_id/gameweek/:gameweek", (req, res) => {
    Stat.findAll({
        where: {
            league_id: req.params.league_id,
            gameweek: req.params.gameweek
        }
    })
    .then((dbStatData) => {
        res.status(200).json(dbStatData);
    })
    .catch(err => {
        res.status(500).json(err);
    })
});

// POST create stat for owner /api/stats
router.post("/", (req, res) => {
    Stat.bulkCreate(req.body)
    .then((dbStatData) => res.status(200).send(dbStatData))
    .catch(err => res.status(500).json(err));
});

module.exports = router;
