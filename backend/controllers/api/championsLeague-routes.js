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

// POST create a champions league team
router.post("/", (req, res) => {
    ChampionsLeague.create({
        owner_id: req.body.owner_id,
        team_name: req.body.team_name
    })
    .then(dbChampionsLeagueData => {
        res.status(200).send(dbChampionsLeagueData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

module.exports = router;
