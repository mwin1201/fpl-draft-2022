const router = require("express").Router();
const { Bet } = require("../../models");

// GET all Bets for an owner /api/bets/owner/1
router.get("/owner/:owner_id", (req, res) => {
    Bet.findAll({
        where: {
            owner_id: req.params.owner_id
        }
    })
    .then((dbBetData) => res.status(200).json(dbBetData))
    .catch(err => {
        res.status(500).json(err);
    });
});

// POST create a bet /api/bets
router.post("/", (req, res) => {
    Bet.create({
        fixture_id: req.body.fixture_id,
        team_h: req.body.team_h,
        team_h_prediction: req.body.team_h_prediction,
        team_a: req.body.team_a,
        team_a_prediction: req.body.team_a_prediction,
        amount: req.body.amount,
        owner_id: req.body.owner_id
    })
})