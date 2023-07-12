const router = require("express").Router();
const { Owner } = require("../../models");

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
        console.log(dbOwnerData);
        req.session.save(() => {
            req.session.owner_id = dbOwnerData.id;
            req.session.team_name = dbOwnerData.team_name;
            req.session.primary_league_id = dbOwnerData.primary_league_id;
            req.session.entry_id = dbOwnerData.entry_id;
            req.session.fpl_id = dbOwnerData.fpl_id;
            req.session.secondary_league_id = dbOwnerData.secondary_league_id;
            req.session.loggedIn = true;
        })
        res.status(201).send(dbOwnerData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

module.exports = router;