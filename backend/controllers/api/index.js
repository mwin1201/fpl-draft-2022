const router = require("express").Router();

const ownerRoutes = require("./owner-routes");
const betRoutes = require("./bet-routes");
const walletRoutes = require("./wallet-bets");
const leagueDataRoutes = require("./leagueData-routes");
const statRoutes = require("./stat-routes");
const championsLeagueRoutes = require("./championsLeague-routes");
const championsLeagueFixturesRoutes = require("./championsLeagueFixtures-routes");


router.use("/owners", ownerRoutes);
router.use("/bets", betRoutes);
router.use("/wallets", walletRoutes);
router.use("/leaguedata", leagueDataRoutes);
router.use("/stats", statRoutes);
router.use("/championsleague", championsLeagueRoutes);
router.use("/championsleaguefixtures", championsLeagueFixturesRoutes);

module.exports = router;
