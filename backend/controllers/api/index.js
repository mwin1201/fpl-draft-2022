const router = require("express").Router();

const ownerRoutes = require("./owner-routes");
const betRoutes = require("./bet-routes");

router.use("/owners", ownerRoutes);
router.use("/bets", betRoutes);

module.exports = router;