const router = require("express").Router();

const ownerRoutes = require("./owner-routes");
const betRoutes = require("./bet-routes");
const walletRoutes = require("./wallet-bets");
const leagueDataRoutes = require("./leagueData-routes");
const statRoutes = require("./stat-routes");


router.use("/owners", ownerRoutes);
router.use("/bets", betRoutes);
router.use("/wallets", walletRoutes);
router.use("/leaguedata", leagueDataRoutes);
router.use("/stats", statRoutes);

module.exports = router;
