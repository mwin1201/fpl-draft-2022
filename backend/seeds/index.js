// need to create seeds for the following tables: Owner, LeagueData, Wallet, Stat, Bet
const ownerSeed = require("./ownerSeeds");
const walletSeed = require("./walletSeeds");
const seedAllStats = require("./statSeeds");
const seedAllChampionsLeague = require("./championsLeagueSeeds");
const seedAllChampionsLeagueFixtures = require("./championsLeagueFixtureSeeds");

const sequelize = require("../config/connection");

const seedAll = async () => {
  await sequelize.sync({ force: true });

  await ownerSeed();
  await walletSeed();
  await seedAllStats();
  await seedAllChampionsLeague();
  await seedAllChampionsLeagueFixtures();

  process.exit(0);
};

seedAll();
