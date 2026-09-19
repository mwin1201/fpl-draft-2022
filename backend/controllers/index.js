const router = require("express").Router();
const fplRoutes = require("./fpl-routes");

// This app is now a stateless proxy: the only routes are the /fpl/* endpoints
// that relay requests to the official FPL API (which blocks direct browser
// calls via CORS). There is no database and no /api/* application routes.
router.use("/fpl", fplRoutes);

router.use((req, res) => {
    res.status(404).end();
});

module.exports = router;
