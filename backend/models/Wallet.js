const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connection");

class Wallet extends Model {}

Wallet.init (
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        total: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 0,
            }
        },

        //foreignKey
        owner_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "owner",
                key: "fpl_id"
            }
        }
    },
    {
        sequelize,
        freezeTableName: true,
        underscored: true,
        modelName: "wallet"
    }
);

module.exports = Wallet;