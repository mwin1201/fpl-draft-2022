const router = require("express").Router();
const { Owner } = require("../../models");

// POST create an owner /api/owners
router.post("/", (req, res) => {
    Owner.create({
        teamName: req.body.teamName,
        password: req.body.password,
        primaryLeagueID: req.body.primaryLeagueID,
        entryID: req.body.entryID,
        fplID: req.body.fplID,
        secondaryLeagueID: req.body.secondaryLeagueID
    })
    .then(dbOwnerData => {
        req.session.save(() => {
            req.session.owner_id = dbOwnerData.id;
            req.session.teamName = dbOwnerData.teamName;
            req.session.primaryLeagueID = dbOwnerData.primaryLeagueID;
            req.session.entryID = dbOwnerData.entryID;
            req.session.fplID = dbOwnerData.fplID;
            req.session.secondaryLeagueID = dbOwnerData.secondaryLeagueID;
            req.session.loggedIn = true;

            res.json(dbOwnerData);
        })
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

module.exports = router;