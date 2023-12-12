const router = require("express").Router();

const ownerRoutes = require("./owner-routes");
const betRoutes = require("./bet-routes");
const walletRoutes = require("./wallet-bets");
const leagueDataRoutes = require("./leagueData-routes");

router.use("/owners", ownerRoutes);
router.use("/bets", betRoutes);
router.use("/wallets", walletRoutes);
router.use("/leaguedata", leagueDataRoutes);

module.exports = router;
