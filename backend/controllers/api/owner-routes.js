const router = require("express").Router();
const { Owner } = require("../../models");

// GET all users
router.get("/", (req, res) => {
    Owner.findAll({
        attributes: ["id", "team_name", "primary_league_id", "entry_id", "fpl_id", "secondary_league_id"]
    })
    .then((dbOwnerdata) => res.status(200).json(dbOwnerdata))
    .catch(err => {
        res.status(500).json(err);
    });
});

// POST create an owner /api/owners
router.post("/", (req, res) => {
    Owner.create({
        team_name: req.body.team_name,
        password: req.body.password,
        primary_league_id: req.body.primary_league_id,
        entry_id: req.body.entry_id,
        fpl_id: req.body.fpl_id,
        secondary_league_id: req.body.secondary_league_id
    })
    .then(dbOwnerData => {
        req.session.save(() => {
            req.session.loggedIn = true;
            res.status(201).send(dbOwnerData);
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// POST login a user
router.post("/login", (req, res) => {
    Owner.findOne({
        where: {
            team_name: req.body.team_name
        }
    })
    .then(dbOwnerData => {
        if (!dbOwnerData) {
            res.status(400).send({message: "No user found with that team name."});
            return;
        }
        const validPassword = dbOwnerData.checkPassword(req.body.password);
        if (!validPassword) {
            res.status(400).send({message: "Incorrect password!"});
            return;
        }
        req.session.save(() => {
            req.session.loggedIn = true;
            res.status(200).send(dbOwnerData);
        });
    });
});

// POST user logout
router.post("/logout", (req, res) => {
    if (req.session.loggedIn) {
        req.session.destroy(() => {
            res.status(204).end();
        });
    }
    else {
        res.status(200).end();
    }
});

module.exports = router;