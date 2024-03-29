const router = require("express").Router();
const { Bet } = require("../../models");

//SHOULD I ADD AUTHORIZATION TO THESE ROUTES??


// GET all Bets /api/bets
router.get("/", (req, res) => {
    Bet.findAll()
    .then(dbBetData => res.status(200).json(dbBetData))
    .catch(err => {
        res.status(500).json(err);
    });
});

// GET all Bets for an owner /api/bets/owner/1
router.get("/owner/:owner_id", (req, res) => {
    Bet.findAll({
        where: {
            owner_id: req.params.owner_id
        }
    })
    .then((dbBetData) => {
        res.status(200).json(dbBetData);
    })
    .catch(err => {
        res.status(500).json(err);
    });
});

// GET specific bet for an owner /api/bets/owner/123/fixture/456
router.get("/owner/:owner_id/fixture/:fixture_id", (req, res) => {
    Bet.findOne({
        where: {
            owner_id: req.params.owner_id,
            fixture_id: req.params.fixture_id
        }
    })
    .then((dbBetData) => {
        if (!dbBetData) {
            res.status(202).json([]);
            return;
        }
        res.status(200).json(dbBetData);
    })
    .catch(err => {
        res.status(500).json(err);
    });
});

// POST create a bet /api/bets
router.post("/", (req, res) => {
    Bet.create({
        fixture_id: req.body.fixture_id,
        gameweek: req.body.gameweek,
        team_h: req.body.team_h,
        team_h_prediction: req.body.team_h_prediction,
        team_a: req.body.team_a,
        team_a_prediction: req.body.team_a_prediction,
        amount: req.body.amount,
        owner_id: req.body.owner_id
    })
    .then((dbBetData) => res.status(200).send(dbBetData))
    .catch(err => {
        res.status(500).json(err);
    });
});

// PUT update bet /api/bets
router.put("/", (req, res) => {
    Bet.update(
        {
            team_h_prediction: req.body.team_h_prediction,
            team_a_prediction: req.body.team_a_prediction,
            amount: req.body.amount,
            paid: req.body.paid,
            success: req.body.success
        },
        {
            where: {
                fixture_id: req.body.fixture_id,
                owner_id: req.body.owner_id
            }
        }
    )
    .then((dbBetData) => {
        if (!dbBetData) {
            res.status(404).send({message: "No Bet found to update"});
            return;
        }
        res.status(200).send(dbBetData);
    })
    .catch(err => {
        res.status(500).send(err);
    });
});

// DELETE bet /api/bets
router.delete("/", (req, res) => {
    Bet.destroy(
        {
            where: {
                fixture_id: req.body.fixture_id,
                owner_id: req.body.owner_id
            }
        
        }
    )
    .then((dbBetData) => {
        if (!dbBetData) {
            res.status(404).send({message: "No Bet found to delete"});
            return;
        }
        res.sendStatus(200).send(dbBetData);
    })
    .catch(err => {
        res.status(500).send(err);
    });
});

module.exports = router;