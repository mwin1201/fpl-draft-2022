const router = require("express").Router();

const ownerRoutes = require("./owner-routes");
const betRoutes = require("./bet-routes");
const walletRoutes = require("./wallet-bets");

router.use("/owners", ownerRoutes);
router.use("/bets", betRoutes);
router.use("/wallets", walletRoutes);

module.exports = router;