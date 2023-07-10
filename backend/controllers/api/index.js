const router = require("express").Router();

const ownerRoutes = require("./owner-routes");

router.use("/owners", ownerRoutes);

module.exports = router;