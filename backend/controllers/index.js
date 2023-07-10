const router = require("express").Router();
const homeRoutes = require("./home-routes");
const dashboardRoutes = require("./dashboard-routes");
const apiRoutes = require("./api");

router.use("/", homeRoutes);
router.use("/api", apiRoutes);
router.use("/dashboard", dashboardRoutes);

router.use((req, res) => {
    res.status(404).end();
});

module.exports = router;