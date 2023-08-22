const router = require("express").Router();
const { Wallet } = require("../../models/");

// GET wallet for owner /api/wallets/owner/1
router.get("/owner/:owner_id", (req, res) => {
    Wallet.findOne({
        where: {
            owner_id: req.params.owner_id
        }
    })
    .then((dbWalletData) => {
        if (!dbWalletData) {
            res.status(404).send({message: "No Owner Found"});
            return;
        }
        res.status(200).json(dbWalletData);
    })
    .catch(err => {
        res.status(500).json(err);
    });
});

// PUT edit wallet total /api/wallets
router.put("/", (req, res) => {
    Wallet.update(
        {
            total: req.params.total
        },
        {
            where: {
                owner_id: req.params.owner_id
            }
        }
    )
    .then((dbWalletData) => {
        if (!dbWalletData) {
            res.status(404).send({message: "No Wallet found to update"});
            return;
        }
        res.status(200).send(dbWalletData);
    })
    .catch(err => {
        res.status(500).send(err);
    });
})

module.exports = router;