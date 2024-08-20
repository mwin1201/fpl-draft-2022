const router = require("express").Router();
const { ChampionsLeague } = require("../../models");

// GET all champions league data
router.get("/", (req, res) => {
    ChampionsLeague.findAll({
        attributes: ["id", "owner_id", "team_name"]
    })
    .then((dbChampionsLeaguedata) => res.status(200).json(dbChampionsLeaguedata))
    .catch(err => {
        res.status(500).json(err);
    });
});

module.exports = router;
