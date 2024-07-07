// Seed file for Wallet records

const { Wallet } = require("../models");

const wallets = [
  {
    total: 100,
    owner_id: 82627
  },
  {
    total: 100,
    owner_id: 83210
  },
  {
    total: 100,
    owner_id: 70583
  },
  {
    total: 100,
    owner_id: 70949
  }
];

const seedWallets = () => Wallet.bulkCreate(wallets);

module.exports = seedWallets;
