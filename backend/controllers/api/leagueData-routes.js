const router = require("express").Router();
const { LeagueData } = require("../../models");

// GET league data for owner /api/leaguedata/owner/1
router.get("/owner/:owner_id", (req, res) => {
    LeagueData.findOne({
        where: {
            owner_id: req.params.owner_id,
            season_complete: false
        }
    })
    .then((dbLeagueData) => {
        res.status(200).json(dbLeagueData);
    })
    .catch(err => {
        res.status(500).json(err);
    })
});

// POST create a data entry /api/leaguedata
router.post("/", (req, res) => {
    LeagueData.create({
        season_year: req.body.season_year,
        league_started_in: req.body.league_started_in,
        league_ended_in: req.body.league_ended_in,
        championship_playoff: req.body.championship_playoff,
        champions_league: req.body.champions_league,
        table_position: req.body.table_position,
        relegation: req.body.relegation,
        promotion: req.body.promotion,
        total_points: req.body.total_points,
        total_goals: req.body.total_goals,
        total_assists: req.body.total_assists,
        season_complete: req.body.season_complete,
        owner_id: req.body.owner_id
    })
    .then((dbLeagueData) => res.status(200).send(dbLeagueData))
    .catch(err => res.status(500).json(err));
});

// PUT update league data entry /api/leaguedata/1
router.put("/:owner_id", (req, res) => {
    LeagueData.update(
        {
            league_ended_in: req.body.league_ended_in,
            championship_playoff: req.body.championship_playoff,
            champions_league: req.body.champions_league,
            table_position: req.body.table_position,
            relegation: req.body.relegation,
            promotion: req.body.promotion,
            total_points: req.body.total_points,
            total_goals: req.body.total_goals,
            total_assists: req.body.total_assists,
            season_complete: req.body.season_complete
        },
        {
            where: {
                owner_id: req.params.owner_id,
                season_complete: false
            }
        }
    )
    .then((dbLeagueData) => {
        if (!dbLeagueData) {
            res.status(404).send({message: "No league data entry found"});
        }
        res.status(200).send(dbLeagueData);
    })
    .catch(err => res.status(500).send(err));
});


module.exports = router;