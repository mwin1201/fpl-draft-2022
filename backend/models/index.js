const Owner = require("./Owner");
const Bet = require("./Bet");
const Wallet = require("./Wallet");
const LeagueData = require("./LeagueData");
const Stat = require("./Stat");

Owner.hasMany(Bet, {
  foreignKey: "owner_id",
});

Bet.belongsTo(Owner, {
  foreignKey: "owner_id",
});

Owner.hasOne(Wallet, {
  foreignKey: "owner_id",
});

Wallet.belongsTo(Owner, {
  foreignKey: "owner_id",
});

Owner.hasMany(LeagueData, {
  foreignKey: "owner_id",
});

LeagueData.belongsTo(Owner, {
  foreignKey: "owner_id",
});

Owner.hasMany(Stat, {
  foreignKey: "owner_id",
});

Stat.belongsTo(Owner, {
  foreignKey: "owner_id",
});

module.exports = { Owner, Bet, Wallet, LeagueData, Stat };
